import {HEX} from '../constants/bytesConversionFormats.js';
import getBase64FromBytes from './getBase64FromBytes.js';
import getBytesFromBase64 from './getBytesFromBase64.js';
import getBytesFromHex from './getBytesFromHex.js';
import getHexFromBytes from './getHexFromBytes.js';
import {IHexFormatOptions} from '../config.js';


interface IBase64FormatOptions {}


export type TBytesConversionFormatOptions = IHexFormatOptions | IBase64FormatOptions;

export const getStringFromBytes = (
    bytes: Uint8Array,
    bytesConversionFormat: number = HEX,
    bytesConversionFormatOptions: TBytesConversionFormatOptions = {}
) => (
    bytesConversionFormat === HEX
        ? getHexFromBytes(bytes, bytesConversionFormatOptions)
        : getBase64FromBytes(bytes)
);

export const getBytesFromString = ( data: string, bytesConversionFormat: number = HEX ) => (
    bytesConversionFormat === HEX ? getBytesFromHex(data) : getBytesFromBase64(data)
);
