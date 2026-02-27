import * as types from '../../types.js';
import * as hashCrc16 from '../../../utils/hashCrc16.js';
import * as binary from '../../../utils/binary/types.js';
import {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as bitSet from '../../../utils/bitSet.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as gsmAccessTypes from '../../constants/gsmAccessTypes.js';
import * as gsmBlockTypes from '../../constants/gsmBlockTypes.js';


/**
 * GSM module parameters
 */
export interface IGsmBlock {
    index: types.TUint8,
    data: types.TBytes
}

export interface IGsmConfiguration {
    blockVersion: types.TUint8,

    configurationId: types.TUint32,

    /**
     * possible value is one of {@link gsmAccessTypes}
     */
    gsmAccessTypes: types.TUint8,

    /**
     * GPRS access point
     */
    gprsAccessPoint: string,

    /**
     * GPRS user name
     */
    gprsUserName: string,

    /**
     * GPRS password
     */
    gprsPassword: string,

    /**
     * TCP server port for the main data channel.
     * The device listens on this port and accepts incoming connections
     * to receive commands / messages.
     */
    commandServerPort: types.TUint16;

    /**
     * TCP server port used for activity monitoring.
     * External systems can connect to this port to check whether
     * the device is online and responsive.
     */
    activityServerPort: types.TUint16;

    /**
     * period between activity pings in seconds
     */
    activityPingIntervalSec: types.TUint16;

    /**
     * Remote server IP address for activity pings.
     * The device acts as a TCP client and periodically
     * connects to the specified host.
     */
    activityPingIp: types.TIPv4;

    /**
     * Remote server TCP port for activity pings
     * Used together with {@link activityPingIp}.
     */
    activityPingPort: types.TUint16;
}

export interface IGsmStatusAttributesV11 {
    OPERATION_ERROR_PRESENT: boolean,
    USING_METER_CONFIGURATION: boolean,
    CONFIGURATION_DATA_SAVED: boolean,
    DEVICE_LONG_ADDRESS_SET: boolean,
    DEVICE_SHORT_ADDRESS_SET: boolean,
    CONFIGURATION_VALID: boolean,
    CONFIGURATION_SAVE_REQUIRED: boolean,
    CONFIGURATION_READY: boolean,
    READY_FOR_OPERATION: boolean
}

export interface IGsmStatusV11 {
    hardwareVersion: types.IVersion,
    softwareVersion: types.IVersion,
    uptime: types.TUint32,
    lastErrorStatus: types.TUint8,
    attributes: IGsmStatusAttributesV11,

    /**
     * number of allocated data blocks
     */
    allocatedDataBlockCount: types.TUint8;

    /**
     * number of allocated messages
     */
    allocatedMessageCount: types.TUint8;

    /**
     * IP address assigned to the modem by the GPRS network
     */
    ip: types.TIPv4;

    /**
     * GSM signal strength (RSSI)
     */
    rssi: types.TUint8;

    /**
     * GSM bit error rate (BER)
     */
    ber: types.TUint8;

    /**
     * maximum number of TCP requests
     */
    maxTcpRequestCount: types.TUint8;

    /**
     * maximum number of requests to the mtx device
     */
    maxMtxRequestCount: types.TUint8;

    /**
     * GSM module operational state
     */
    gsmState: types.TUint8;

    /**
     * TCP stack operational state
     */
    tcpState: types.TUint8;

    /**
     * MTX module operational state
     */
    mtxState: types.TUint8;
}

export interface IGsmStatusAttributesV12 {
    MESSAGE_SYSTEM_LOCKED: boolean,
    OPERATION_ERROR_PRESENT: boolean,
    SAVE_PARAMETERS_NOT_SUPPORTED: boolean,
    USING_METER_CONFIGURATION: boolean,
    CONFIGURATION_DATA_SAVED: boolean,
    DEVICE_LONG_ADDRESS_SET: boolean,
    DEVICE_SHORT_ADDRESS_SET: boolean,
    DEVICE_CONFIGURATION_RECEIVED: boolean,
    CONFIGURATION_SAVE_REQUIRED: boolean,
    CONFIGURATION_VALID: boolean,
    READY_FOR_OPERATION: boolean
}

export interface IGsmStatus12 {
    hardwareVersion: types.IVersion,
    softwareVersion: types.IVersion,
    uptime: types.TUint32,

    /**
     * number of allocated messages
     */
    allocatedMessageCount: types.TUint8;

    /**
     * number of allocated data blocks
     */
    allocatedDataBlockCount: types.TUint8;

    attributes: IGsmStatusAttributesV12,

    /**
     * IP address assigned to the modem by the GPRS network
     */
    ip: types.TIPv4;

    /**
     * GSM signal strength (RSSI)
     */
    rssi: types.TUint8;

    /**
     * GSM bit error rate (BER)
     */
    ber: types.TUint8;

    lastErrorStatus: types.TUint8,

    /**
     * MTX module operational state
     */
    mtxState: types.TUint8;

    /**
     * GSM module operational state
     */
    gsmState: types.TUint8;

    /**
     * TCP stack operational state
     */
    tcpState: types.TUint8;

    /**
     * maximum number of requests to the mtx device
     */
    maxMtxRequestCount: types.TUint8;

    mtxErrorCount: types.TUint8;

    /**
     * maximum number of TCP requests
     */
    maxTcpRequestCount: types.TUint16;

    tcpErrorCount: types.TUint16;
}

export type TGsmStatus =
    {version: 0x11, data: IGsmStatusV11} |
    {version: 0x12, data: IGsmStatus12};


export const GSM_BLOCK_PREFIX = 0xda;
export const GSM_BLOCK_SIZE = 60;
export const GSM_VALID_BLOCK_NUMBER = gsmBlockTypes.STATUS + 1;
export const GSM_CONFIGURATION_PREFIX = 0xae;


const gsmAttributeV11Mask = {
    OPERATION_ERROR_PRESENT: 0x0001,
    USING_METER_CONFIGURATION: 0x0002,
    CONFIGURATION_DATA_SAVED: 0x0004,
    DEVICE_LONG_ADDRESS_SET: 0x0008,
    DEVICE_SHORT_ADDRESS_SET: 0x0010,
    CONFIGURATION_VALID: 0x0020,
    CONFIGURATION_SAVE_REQUIRED: 0x0040,
    CONFIGURATION_READY: 0x0080,
    READY_FOR_OPERATION: 0x0100
};

const gsmAttributeV12Mask = {
    MESSAGE_SYSTEM_LOCKED: 0x0001,
    OPERATION_ERROR_PRESENT: 0x0002,
    SAVE_PARAMETERS_NOT_SUPPORTED: 0x0004,
    USING_METER_CONFIGURATION: 0x0008,
    CONFIGURATION_DATA_SAVED: 0x0010,
    DEVICE_LONG_ADDRESS_SET: 0x0020,
    DEVICE_SHORT_ADDRESS_SET: 0x0040,
    DEVICE_CONFIGURATION_RECEIVED: 0x0080,
    CONFIGURATION_SAVE_REQUIRED: 0x0100,
    CONFIGURATION_VALID: 0x0200,
    READY_FOR_OPERATION: 0x0400
};


const gprsAccessPointSize: number = 27;
const gprsUserNameSize: number = 14;
const gprsPasswordSize: number = 14;


export const getGsmConfiguration = ( buffer: IBinaryBuffer ): IGsmConfiguration => {
    const configurationPrefix = buffer.getUint8();

    if ( configurationPrefix !== GSM_CONFIGURATION_PREFIX ) {
        throw new Error(`Gsm configuration. Invalid prefix: ${configurationPrefix}.`);
    }

    return {
        blockVersion: buffer.getUint8(),
        configurationId: buffer.getUint32(),
        gsmAccessTypes: buffer.getUint8(),
        gprsAccessPoint: buffer.getFixedString(gprsAccessPointSize),
        gprsUserName: buffer.getFixedString(gprsUserNameSize),
        gprsPassword: buffer.getFixedString(gprsPasswordSize),
        commandServerPort: buffer.getUint16(),
        activityServerPort: buffer.getUint16(),
        activityPingIntervalSec: buffer.getUint16(),
        activityPingIp: binary.getIPv4(buffer),
        activityPingPort: buffer.getUint16()
    };
};

export const setGsmConfiguration = ( buffer: IBinaryBuffer, value: IGsmConfiguration ) => {
    buffer.setUint8(GSM_CONFIGURATION_PREFIX);
    buffer.setUint8(value.blockVersion);
    buffer.setUint32(value.configurationId);
    buffer.setUint8(value.gsmAccessTypes);
    buffer.setFixedString(value.gprsAccessPoint, gprsAccessPointSize);
    buffer.setFixedString(value.gprsUserName, gprsUserNameSize);
    buffer.setFixedString(value.gprsPassword, gprsPasswordSize);
    buffer.setUint16(value.commandServerPort);
    buffer.setUint16(value.activityServerPort);
    buffer.setUint16(value.activityPingIntervalSec);
    binary.setIPv4(buffer, value.activityPingIp);
    buffer.setUint16(value.activityPingPort);
};

export const getGsmStatus11 = ( buffer: IBinaryBuffer ): IGsmStatusV11 => ({
    hardwareVersion: binary.getVersion(buffer),
    softwareVersion: binary.getVersion(buffer),
    uptime: buffer.getUint32(),
    lastErrorStatus: (() => {
        const value = buffer.getUint8();

        // skip reserved bytes
        buffer.getUint16();

        return value;
    })(),
    attributes: (bitSet.toObject(gsmAttributeV11Mask, buffer.getUint32()) as unknown) as IGsmStatusAttributesV11,
    allocatedDataBlockCount: buffer.getUint8(),
    allocatedMessageCount: buffer.getUint8(),
    ip: binary.getIPv4(buffer),
    rssi: buffer.getUint8(),
    ber: buffer.getUint8(),
    maxTcpRequestCount: buffer.getUint8(),
    maxMtxRequestCount: buffer.getUint8(),
    gsmState: buffer.getUint8(),
    tcpState: buffer.getUint8(),
    mtxState: buffer.getUint8()
});

export const setGsmStatus11 = ( buffer: IBinaryBuffer, value: IGsmStatusV11 ) => {
    binary.setVersion(buffer, value.hardwareVersion);
    binary.setVersion(buffer, value.softwareVersion);
    buffer.setUint32(value.uptime);
    buffer.setUint8(value.lastErrorStatus);
    buffer.setUint16(0);
    buffer.setUint32(bitSet.fromObject(gsmAttributeV11Mask, (value.attributes as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(value.allocatedDataBlockCount);
    buffer.setUint8(value.allocatedMessageCount);
    binary.setIPv4(buffer, value.ip);
    buffer.setUint8(value.rssi);
    buffer.setUint8(value.ber);
    buffer.setUint8(value.maxTcpRequestCount);
    buffer.setUint8(value.maxMtxRequestCount);
    buffer.setUint8(value.gsmState);
    buffer.setUint8(value.tcpState);
    buffer.setUint8(value.mtxState);
};

export const getGsmStatus12 = ( buffer: IBinaryBuffer ): IGsmStatus12 => ({
    hardwareVersion: binary.getVersion(buffer),
    softwareVersion: binary.getVersion(buffer),
    uptime: buffer.getUint32(),
    allocatedMessageCount: buffer.getUint8(),
    allocatedDataBlockCount: buffer.getUint8(),
    attributes: (bitSet.toObject(gsmAttributeV12Mask, buffer.getUint32()) as unknown) as IGsmStatusAttributesV12,
    ip: binary.getIPv4(buffer),
    rssi: buffer.getUint8(),
    ber: buffer.getUint8(),
    lastErrorStatus: (() => {
        const value = buffer.getUint8();

        // skip reserved bytes
        buffer.getUint32();
        buffer.getUint32();

        return value;
    })(),
    mtxState: buffer.getUint8(),
    gsmState: buffer.getUint8(),
    tcpState: buffer.getUint8(),
    maxMtxRequestCount: buffer.getUint8(),
    mtxErrorCount: buffer.getUint8(),
    maxTcpRequestCount: buffer.getUint16(),
    tcpErrorCount: buffer.getUint16()
});

export const setGsmStatus12 = ( buffer: IBinaryBuffer, value: IGsmStatus12 ) => {
    binary.setVersion(buffer, value.hardwareVersion);
    binary.setVersion(buffer, value.softwareVersion);
    buffer.setUint32(value.uptime);
    buffer.setUint8(value.allocatedMessageCount);
    buffer.setUint8(value.allocatedDataBlockCount);
    buffer.setUint32(bitSet.fromObject(gsmAttributeV12Mask, (value.attributes as unknown) as bitSet.TBooleanObject));
    binary.setIPv4(buffer, value.ip);
    buffer.setUint8(value.rssi);
    buffer.setUint8(value.ber);
    buffer.setUint8(value.lastErrorStatus);
    buffer.setUint32(0);
    buffer.setUint32(0);
    buffer.setUint8(value.mtxState);
    buffer.setUint8(value.gsmState);
    buffer.setUint8(value.tcpState);
    buffer.setUint8(value.maxMtxRequestCount);
    buffer.setUint8(value.mtxErrorCount);
    buffer.setUint16(value.maxTcpRequestCount);
    buffer.setUint16(value.tcpErrorCount);
};

export const getGsmStatus = ( buffer: IBinaryBuffer ): TGsmStatus => {
    const payloadLength = buffer.bytesLeft;

    if ( payloadLength < 1 ) {
        throw new Error(`GsmStatus. Invalid payload length: ${payloadLength}.`);
    }

    const version = buffer.getUint8();

    switch ( version ) {
        case 0x11: {
            if ( payloadLength < 29 ) {
                throw new Error(`GsmStatus. Invalid payload length: ${payloadLength}.`);
            }

            return {
                version: 0x11,
                data: getGsmStatus11(buffer)
            };
        }

        case 0x12:
        case 0x16: {
            if ( payloadLength < 39 ) {
                throw new Error(`GsmStatus. Invalid payload length: ${payloadLength}.`);
            }

            return {
                version: 0x12,
                data: getGsmStatus12(buffer)
            };
        }

        default:
            throw new Error(`GsmStatus. Unsupported version: ${version}.`);
    }
};

export const setGsmStatus = ( buffer: IBinaryBuffer, {version, data}: TGsmStatus ) => {
    switch ( version ) {
        case 0x11: {
            buffer.setUint8(version);
            setGsmStatus11(buffer, data);
            break;
        }

        case 0x12: {
            buffer.setUint8(version);
            setGsmStatus12(buffer, data);
            break;
        }

        default: {
            const exhaustive: never = version;
            throw new Error(`GsmStatus. Unsupported version: ${String(exhaustive)}.`);
        }
    }
};

export const getGsmBlock = ( commandName: string, bytes: types.TBytes ): IGsmBlock => {
    const [index] = bytes;
    const block = hashCrc16.parse(bytes.slice(1));

    if ( index > 3 ) {
        throw new Error(`Command ${commandName}. Invalid block index: ${index}.`);
    }

    if ( block.crc.calculated !== block.crc.received ) {
        const crcToHex = ( value: types.TUint16 ) => (value.toString(16).padStart(4, '0'));
        throw new Error(
            `Command ${commandName}. Invalid block crc. Calculated: `
            + `0x${crcToHex(block.crc.calculated)}, received: 0x${crcToHex(block.crc.received)}`
        );
    }

    const [blockPrefix, ...data] = block.payload;

    if ( blockPrefix !== GSM_BLOCK_PREFIX ) {
        throw new Error(`Command ${commandName}. Invalid block prefix: ${blockPrefix}.`);
    }

    // data contains payload length and payload data
    if ( data.length !== 1 + GSM_BLOCK_SIZE ) {
        throw new Error(`Command ${commandName}. Invalid payload length: ${data.length}.`);
    }

    return {index, data};
};

export const setGsmBlock = ( block: IGsmBlock ): types.TBytes => {
    const data = [GSM_BLOCK_PREFIX, ...block.data];

    if ( block.data.length < GSM_BLOCK_SIZE ) {
        // block data contains payload length and payload data
        data.push(...new Array<types.TUint8>(GSM_BLOCK_SIZE + 1 - block.data.length).fill(0));
    }

    return [block.index, ...hashCrc16.appendCrc(data)];
};
