/**
 * WAV Recorder - records audio as WAV format using Web Audio API
 * Bypasses MediaRecorder entirely (Safari's MediaRecorder is broken)
 * WAV is universally playable on all browsers and devices
 */

export class WavRecorder {
  private context: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private chunks: Float32Array[] = [];
  private sampleRate = 16000;
  public recording = false;

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.sampleRate = this.context.sampleRate;
    this.source = this.context.createMediaStreamSource(this.stream);

    // Use ScriptProcessorNode to capture raw PCM samples
    this.processor = this.context.createScriptProcessor(4096, 1, 1);
    this.chunks = [];
    this.recording = true;

    this.processor.onaudioprocess = (e: AudioProcessingEvent) => {
      if (!this.recording) return;
      const input = e.inputBuffer.getChannelData(0);
      // Downsample to 16kHz for smaller file size
      const ratio = Math.floor(this.sampleRate / 16000);
      const downsampled = new Float32Array(Math.floor(input.length / ratio));
      for (let i = 0; i < downsampled.length; i++) {
        downsampled[i] = input[i * ratio];
      }
      this.chunks.push(new Float32Array(downsampled));
    };

    this.source.connect(this.processor);
    this.processor.connect(this.context.destination);
  }

  stop(): Blob {
    this.recording = false;
    if (this.processor) { this.processor.disconnect(); this.processor = null; }
    if (this.source) { this.source.disconnect(); this.source = null; }
    if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
    if (this.context) { this.context.close(); this.context = null; }

    // Combine chunks
    const totalLength = this.chunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    // Encode as WAV
    return this.encodeWAV(combined, 16000);
  }

  private encodeWAV(samples: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // WAV header
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    this.writeString(view, 8, "WAVE");
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    this.writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    // PCM samples (float32 -> int16)
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}
