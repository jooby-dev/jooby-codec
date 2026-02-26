import {TIPv4, IVersion} from '../../types.js';
import {IBinaryBuffer} from '../BinaryBuffer.js';


export const setIPv4 = ( buffer: IBinaryBuffer, value: TIPv4 ) => {
    buffer.setBytes(value);
};

export const getIPv4 = ( buffer: IBinaryBuffer ): TIPv4 => (
    buffer.getBytes(4) as TIPv4
);

export const setVersion = ( buffer: IBinaryBuffer, {major, minor}: IVersion ) => {
    buffer.setUint8(major);
    buffer.setUint8(minor);
};

export const getVersion = ( buffer: IBinaryBuffer ): IVersion => (
    {major: buffer.getUint8(), minor: buffer.getUint8()}
);
