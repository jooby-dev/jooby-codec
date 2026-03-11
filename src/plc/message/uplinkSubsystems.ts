import {TMessageFromBytes, TMessageToBytes} from '../../mtx1/message/wrappers.js';
import * as mtx1 from '../../mtx1/message/uplink.js';
import * as mtx3 from '../../mtx3/message/uplink.js';
import * as connection from './connection/uplink.js';
import * as modem from './modem/uplink.js';

import * as subsystemIds from '../constants/subsystemIds.js';
import {TSubsystemIds} from '../types.js';

import {ISubsystem} from './downlinkSubsystems.js';


const mtx1Subsystem = {
    fromBytes: mtx1.messageFromBytes,
    toBytes: mtx1.toBytes
};

const mtx3Subsystem = {
    fromBytes: mtx3.messageFromBytes,
    toBytes: mtx3.toBytes
};

const subsystems = {
    mtx1: {
        [subsystemIds.CONNECTION]: connection,
        [subsystemIds.MODEM]: modem,
        [subsystemIds.MTX]: mtx1Subsystem,
        [subsystemIds.MTX_REPORT]: mtx1Subsystem,
        [subsystemIds.MTX_EVENT]: mtx1Subsystem
    },
    mtx3: {
        [subsystemIds.CONNECTION]: connection,
        [subsystemIds.MODEM]: modem,
        [subsystemIds.MTX]: mtx3Subsystem,
        [subsystemIds.MTX_REPORT]: mtx3Subsystem,
        [subsystemIds.MTX_EVENT]: mtx3Subsystem
    }
};


export const getMessageFromBytes = (
    mtxType: 'mtx1' | 'mtx3',
    subsystemId: TSubsystemIds
): TMessageFromBytes | undefined => {
    const subsystem: ISubsystem = subsystems[mtxType][subsystemId];

    return subsystem?.fromBytes;
};

export const getMessageToBytes = (
    mtxType: 'mtx1' | 'mtx3',
    subsystemId: TSubsystemIds
): TMessageToBytes | undefined => {
    const subsystem: ISubsystem = subsystems[mtxType][subsystemId];

    return subsystem?.toBytes;
};
