import {TMessageFromBytes, TBytesFromMessage} from '../../mtx1/message/wrappers.js';
import * as mtx1 from '../../mtx1/message/downlink.js';
import * as mtx3 from '../../mtx3/message/downlink.js';
import * as connection from './connection/downlink.js';
import * as modem from './modem/downlink.js';

import * as subsystemIds from '../constants/subsystemIds.js';
import {TUint8} from '../types.js';


export type ISubsystem = {
    messageFromBytes: TMessageFromBytes,
    bytesFromMessage: TBytesFromMessage
};

const subsystems = {
    mtx1: {
        [subsystemIds.CONNECTION]: connection,
        [subsystemIds.MODEM]: modem,
        [subsystemIds.MTX]: mtx1,
        [subsystemIds.MTX_REPORT]: mtx1,
        [subsystemIds.MTX_EVENT]: mtx1
    },
    mtx3: {
        [subsystemIds.CONNECTION]: connection,
        [subsystemIds.MODEM]: modem,
        [subsystemIds.MTX]: mtx3,
        [subsystemIds.MTX_REPORT]: mtx3,
        [subsystemIds.MTX_EVENT]: mtx3
    }
};


export const messageFromBytes = (
    mtxType: 'mtx1' | 'mtx3',
    subsystemId: TUint8
): TMessageFromBytes | undefined => {
    const subsystem: ISubsystem = subsystems[mtxType][subsystemId];

    return subsystem?.messageFromBytes;
};

export const bytesFromMessage = (
    mtxType: 'mtx1' | 'mtx3',
    subsystemId: TUint8
): TBytesFromMessage | undefined => {
    const subsystem: ISubsystem = subsystems[mtxType][subsystemId];

    return subsystem?.bytesFromMessage;
};
