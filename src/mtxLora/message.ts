import * as mtx from '../mtx/message.js';

export const fromBytes = ( message: Uint8Array, config?: mtx.IFromBytesOptions ): mtx.IMessage => (
    mtx.fromBytes(message, {withMtxLora: true, ...config})
);

export const fromHex = ( data: string, config?: mtx.IFromBytesOptions ): mtx.IMessage => (
    mtx.fromHex(data, {withMtxLora: true, ...config})
);

export const fromBase64 = ( data: string, config?: mtx.IFromBytesOptions ): mtx.IMessage => (
    mtx.fromBase64(data, {withMtxLora: true, ...config})
);

export {
    IFromBytesOptions,
    IToBytesOptions,
    toBytes,
    toFrame,
    toHex,
    toBase64
} from '../mtx/message.js';
