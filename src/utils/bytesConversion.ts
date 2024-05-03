import * as types from '../types.js';
import {HEX} from '../constants/bytesConversionFormats.js';
import getBase64FromBytes from './getBase64FromBytes.js';
import getBytesFromBase64 from './getBytesFromBase64.js';
import getBytesFromHex from './getBytesFromHex.js';
import getHexFromBytes from './getHexFromBytes.js';
import {IHexFormatOptions} from '../config.js';


interface IBase64FormatOptions {}


export type TBytesConversionFormatOptions = IHexFormatOptions | IBase64FormatOptions;

export interface IBytesConversionFormatOptions {
    bytesConversionFormat: number,
    bytesConversionFormatOptions: TBytesConversionFormatOptions
}

export const defaultFormatOptions: IBytesConversionFormatOptions = {
    bytesConversionFormat: HEX,
    bytesConversionFormatOptions: {}
};

export const getStringFromBytes = (
    bytes: types.TBytes,
    options: IBytesConversionFormatOptions = defaultFormatOptions
) => {
    const {
        bytesConversionFormat = defaultFormatOptions.bytesConversionFormat,
        bytesConversionFormatOptions = defaultFormatOptions.bytesConversionFormatOptions
    } = options;

    return bytesConversionFormat === HEX
        ? getHexFromBytes(bytes, bytesConversionFormatOptions)
        : getBase64FromBytes(bytes);
};

export const getBytesFromString = ( data: string, bytesConversionFormat: number = HEX ) => (
    bytesConversionFormat === HEX ? getBytesFromHex(data) : getBytesFromBase64(data)
);
