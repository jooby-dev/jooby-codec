import {IToBytesOptions, IFromBytesOptions} from '../../mtx1/message/wrappers.js';
import {TCommand} from '../../mtx1/utils/command.js';
import * as accessLevelIds from '../../mtx1/constants/accessLevels.js';
import * as types from '../types.js';
import * as message from '../message/index.js';
import * as subsystemIds from '../constants/subsystemIds.js';
import * as block from './block.js';


export interface IPlcFromBytesOptions extends IFromBytesOptions {
    mtxType?: types.TMtxType
}

export interface IPlcToBytesOptions extends IToBytesOptions {
    mtxType?: types.TMtxType
}


export const messageFromBlock = ( value: block.ISubsystemBlock, config: IPlcFromBytesOptions = {} ) => {
    const {mtxType = 'mtx1', ...mtxConfig} = config;
    const subsystemsWithEncryption = [subsystemIds.MTX, subsystemIds.MTX_REPORT, subsystemIds.MTX_EVENT];
    const direction = value.isDownlink
        ? message.downlink
        : message.uplink;
    const subsystemId = block.getCommandsSystemId(value);

    const fromBytes = direction.messageFromBytes(mtxType, subsystemId);
    const accessLevel = subsystemsWithEncryption.includes(value.subsystemId)
        ? value.accessLevel
        : accessLevelIds.UNENCRYPTED;

    return fromBytes != null
        ? fromBytes(
            accessLevel,
            value.messageId,
            value.payload,
            mtxConfig
        )
        : undefined;
};

export const bytesFromMessage = (
    commands: Array<TCommand>,
    isDownlink: boolean,
    subsystemId: types.TUint8,
    config: IPlcToBytesOptions = {}
) => {
    const {mtxType = 'mtx1', ...mtxConfig} = config;
    const direction = isDownlink
        ? message.downlink
        : message.uplink;
    const toBytes = direction.bytesFromMessage(mtxType, subsystemId);

    return toBytes != null
        ? toBytes(
            commands,
            mtxConfig
        )
        : undefined;
};
