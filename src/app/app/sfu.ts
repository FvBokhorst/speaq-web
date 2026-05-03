/**
 * SPEAQ SFU helper - PWA side.
 *
 * Wraps mediasoup-client for room-based audio/video calls. Used when the
 * peer-to-peer-with-TURN path cannot work (notably 2 iOS Safari PWAs cross-
 * network: iOS WebKit blocks p2p relay-allocate-pairing). The SFU forwards
 * encrypted DTLS-SRTP packets without decrypting; insertable streams will
 * later add a second encryption layer keyed from the Kyber ratchet so even
 * the SFU operator cannot read media content.
 *
 * Architecture: signaling (CALL_OFFER / CALL_ANSWER) stays via SPEAQ-relay,
 * mediasoup only does media-routing. Both peers connect to the SFU with the
 * shared roomId (= callId) carried in the encrypted CALL_OFFER blob.
 *
 * Server: see ~/speaq-mediasoup on speaq-mediasoup VM (eu-west1-b).
 */

import type { Device as DeviceType, types as msTypes } from 'mediasoup-client';
type Transport = msTypes.Transport;
type Producer = msTypes.Producer;
type Consumer = msTypes.Consumer;
type RtpCapabilities = msTypes.RtpCapabilities;
type RtpParameters = msTypes.RtpParameters;

const SFU_URL = 'wss://sfu.thespeaq.com';

export type RemoteTrackHandler = (peerId: string, track: MediaStreamTrack, kind: 'audio' | 'video') => void;
export type PeerLeftHandler = (peerId: string) => void;

export interface SfuSession {
  ourPeerId: string;
  publish(track: MediaStreamTrack, kind: 'audio' | 'video'): Promise<void>;
  onRemoteTrack(cb: RemoteTrackHandler): void;
  onPeerLeft(cb: PeerLeftHandler): void;
  close(): void;
}

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (err: Error) => void;
  expectedType: string;
}

export async function connectSfu(roomId: string): Promise<SfuSession> {
  const { Device } = (await import('mediasoup-client'));
  const ws = new WebSocket(SFU_URL);
  await new Promise<void>((res, rej) => {
    ws.onopen = () => res();
    ws.onerror = () => rej(new Error('sfu websocket failed to open'));
  });

  let nextId = 1;
  const pending = new Map<number, PendingRequest>();
  const remoteHandlers: RemoteTrackHandler[] = [];
  const peerLeftHandlers: PeerLeftHandler[] = [];
  // Buffer remote tracks that arrive before the caller registered onRemoteTrack.
  // Without this buffer, existingProducers consumed during connectSfu() are
  // attached to no listener and are silently lost (showing as "remote video
  // never appears" on the joiner side).
  const bufferedTracks: Array<{ peerId: string; track: MediaStreamTrack; kind: 'audio' | 'video' }> = [];

  function emitRemote(peerId: string, track: MediaStreamTrack, kind: 'audio' | 'video') {
    if (remoteHandlers.length === 0) {
      bufferedTracks.push({ peerId, track, kind });
    } else {
      for (const h of remoteHandlers) h(peerId, track, kind);
    }
  }

  let device: DeviceType | null = null;
  let recvTransport: Transport | null = null;

  ws.addEventListener('message', (e) => {
    let m: { id?: number; type: string; [k: string]: unknown };
    try { m = JSON.parse(typeof e.data === 'string' ? e.data : ''); } catch { return; }
    if (typeof m.id === 'number' && pending.has(m.id)) {
      const p = pending.get(m.id)!;
      pending.delete(m.id);
      if (m.type === p.expectedType) p.resolve(m);
      else if (m.type === 'error') p.reject(new Error(String(m.error || 'sfu error')));
      else p.reject(new Error('unexpected sfu type ' + m.type));
      return;
    }
    if (m.type === 'newProducer') {
      const producerId = String(m.producerId);
      const peerId = String(m.peerId);
      const kind = (m.kind === 'video' ? 'video' : 'audio') as 'audio' | 'video';
      void consumeRemote(producerId, peerId, kind);
    } else if (m.type === 'peerLeft') {
      const peerId = String(m.peerId);
      for (const h of peerLeftHandlers) h(peerId);
    }
  });

  function rpc<T>(req: Record<string, unknown>, expectedType: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve: resolve as (v: unknown) => void, reject, expectedType });
      ws.send(JSON.stringify({ ...req, id }));
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error('sfu rpc timeout for ' + expectedType));
        }
      }, 10000);
    });
  }

  async function consumeRemote(producerId: string, peerId: string, kind: 'audio' | 'video') {
    if (!device || !recvTransport) return;
    try {
      const m = await rpc<{ params: { id: string; producerId: string; kind: 'audio' | 'video'; rtpParameters: RtpParameters } }>(
        { type: 'consume', producerId, rtpCapabilities: device.rtpCapabilities },
        'consumed'
      );
      const consumer: Consumer = await recvTransport.consume(m.params);
      emitRemote(peerId, consumer.track, kind);
    } catch (err) {
      console.error('[sfu] consumeRemote failed', producerId, err);
    }
  }

  // Join room.
  const joined = await rpc<{
    peerId: string;
    rtpCapabilities: RtpCapabilities;
    existingProducers: Array<{ peerId: string; producerId: string; kind: 'audio' | 'video' }>;
  }>({ type: 'join', roomId }, 'joined');

  device = new Device();
  await device.load({ routerRtpCapabilities: joined.rtpCapabilities });

  // Create send transport.
  type TransportParams = {
    id: string;
    iceParameters: unknown;
    iceCandidates: unknown[];
    dtlsParameters: unknown;
  };
  const sParams = (await rpc<{ params: TransportParams }>({ type: 'createSendTransport' }, 'sendTransportCreated')).params;
  const sendTransport: Transport = device.createSendTransport(sParams as never);
  sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
    rpc({ type: 'connectSendTransport', dtlsParameters }, 'sendTransportConnected')
      .then(() => callback())
      .catch((err) => errback(err as Error));
  });
  sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
    try {
      const m = await rpc<{ producerId: string }>({ type: 'produce', kind, rtpParameters }, 'produced');
      callback({ id: m.producerId });
    } catch (err) {
      errback(err as Error);
    }
  });

  // Create recv transport.
  const rParams = (await rpc<{ params: TransportParams }>({ type: 'createRecvTransport' }, 'recvTransportCreated')).params;
  recvTransport = device.createRecvTransport(rParams as never);
  recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
    rpc({ type: 'connectRecvTransport', dtlsParameters }, 'recvTransportConnected')
      .then(() => callback())
      .catch((err) => errback(err as Error));
  });

  const producers: Producer[] = [];

  async function publish(track: MediaStreamTrack, kind: 'audio' | 'video') {
    const producer = await sendTransport.produce({ track });
    producers.push(producer);
    void kind;
  }

  // Consume any peers that were already in the room when we joined.
  for (const ep of joined.existingProducers) {
    await consumeRemote(ep.producerId, ep.peerId, ep.kind);
  }

  function close() {
    for (const p of producers) { try { p.close(); } catch {} }
    try { sendTransport.close(); } catch {}
    try { recvTransport?.close(); } catch {}
    try { ws.close(); } catch {}
    pending.clear();
  }

  return {
    ourPeerId: joined.peerId,
    publish,
    onRemoteTrack(cb) {
      remoteHandlers.push(cb);
      // Drain any tracks that arrived before this handler was registered.
      for (const buf of bufferedTracks) cb(buf.peerId, buf.track, buf.kind);
      bufferedTracks.length = 0;
    },
    onPeerLeft(cb) { peerLeftHandlers.push(cb); },
    close,
  };
}
