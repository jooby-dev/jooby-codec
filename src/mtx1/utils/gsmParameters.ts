import * as types from '../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import {convertCrcToBytes} from '../../utils/hashCrc16.js';
import calculateCrc16 from '../../utils/calculateCrc16.js';
import {
    GSM_BLOCK_SIZE,
    GSM_VALID_BLOCK_NUMBER,
    getGsmConfiguration,
    setGsmConfiguration,
    getGsmStatus,
    setGsmStatus,
    IGsmBlock,
    IGsmConfiguration,
    TGsmStatus
} from './binary/gsm.js';
import * as gsmBlockTypes from '../constants/gsmBlockTypes.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';


export type Parameters =
    {type: 'configuration', data: IGsmConfiguration} |
    {type: 'status', data: TGsmStatus} |
    {type: 'incomplete'} |
    {type: 'unsupported', block: IGsmBlock};

export class Collector {
    payload0?: types.TBytes;

    payload1?: types.TBytes;

    push ( block: IGsmBlock ): Parameters {
        const [payloadLength, ...data] = block.data;
        const payload = data.slice(0, payloadLength);
        let buffer: IBinaryBuffer;

        switch ( block.index ) {
            case gsmBlockTypes.CONFIGURATION_0:
                this.payload0 = payload;
                break;

            case gsmBlockTypes.CONFIGURATION_1:
                this.payload1 = payload;
                break;

            case gsmBlockTypes.STATUS: {
                buffer = new BinaryBuffer(payload);
                console.log(`read gsmStatus: ${getHexFromBytes(payload)}`);

                return {type: 'status', data: getGsmStatus(buffer)};
            }

            default:
                return {type: 'unsupported', block};
        }

        if ( !this.payload0 || !this.payload1 ) {
            return {type: 'incomplete'};
        }

        const bytes = [...this.payload0, ...this.payload1];

        this.clear();

        buffer = new BinaryBuffer(bytes);

        const configuration = getGsmConfiguration(buffer);
        const calculatedCrc = calculateCrc16(buffer.getBytesToOffset());
        const receivedCrc = buffer.getUint16();

        if ( receivedCrc > 0 && calculatedCrc !== receivedCrc ) {
            throw new Error('Gsm configuration. Invalid crc. '
                + `Calculated: 0x${calculatedCrc.toString(16).padStart(4, '0')}, `
                + `received: ${receivedCrc.toString(16).padStart(4, '0')}.`);
        }

        return {type: 'configuration', data: configuration};
    }

    clear () {
        this.payload0 = null;
        this.payload1 = null;
    }
}

export const split = ( parameters: Parameters ): Array<IGsmBlock> => {
    const buffer: IBinaryBuffer = new BinaryBuffer(GSM_BLOCK_SIZE * GSM_VALID_BLOCK_NUMBER);

    switch ( parameters.type ) {
        case 'configuration': {
            setGsmConfiguration(buffer, parameters.data);

            const bytes = buffer.getBytesToOffset();
            const payload0 = bytes.slice(0, GSM_BLOCK_SIZE);
            const payload1 = bytes.slice(GSM_BLOCK_SIZE);
            const crcBytes = convertCrcToBytes(calculateCrc16(bytes));

            return [
                {index: 0, data: [payload0.length, ...payload0]},
                {index: 1, data: [payload1.length, ...payload1, ...crcBytes]}
            ];
        }

        case 'status': {
            setGsmStatus(buffer, parameters.data);

            const payload = buffer.getBytesToOffset();
            console.log(`write GsmStatus: ${getHexFromBytes(payload)}`);

            return [{index: 3, data: [payload.length, ...payload]}];
        }

        default:
            return [];
    }
};
