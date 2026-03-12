import * as types from '../types.js';
import * as block from './block.js';
import * as message from '../message/index.js';
import {IToBytesOptions, IFromBytesOptions} from '../../mtx1/message/wrappers.js';
import {TCommand} from '../../mtx1/utils/command.js';


export const getMessageFromBlock = ( value: block.ISubsystemBlock, config: IFromBytesOptions = {} ) => {
    const direction = value.isDownlink
        ? message.downlink
        : message.uplink;
    const subsystemId = block.getCommandsSystemId(value);

    const fromBytes = direction.getMessageFromBytes('mtx1', subsystemId);

    return fromBytes != null
        ? fromBytes(
            value.accessLevel,
            value.messageId,
            value.payload,
            config
        )
        : undefined;
};

export const getBytesFromMessage = (
    commands: Array<TCommand>,
    isDownlink: boolean,
    subsystemId: types.TUint8,
    config: IToBytesOptions = {}
) => {
    const direction = isDownlink
        ? message.downlink
        : message.uplink;
    const toBytes = direction.getBytesFromMessage('mtx1', subsystemId);

    return toBytes != null
        ? toBytes(
            commands,
            config
        )
        : undefined;
};
