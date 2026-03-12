import {TMessageFromBytes, TBytesFromMessage} from '../../mtx1/message/wrappers.js';
import * as mtx1 from '../../mtx1/message/uplink.js';
import * as mtx3 from '../../mtx3/message/uplink.js';
import * as connection from './connection/uplink.js';
import * as modem from './modem/uplink.js';

import * as subsystemIds from '../constants/subsystemIds.js';
import {TUint8} from '../types.js';
import {ISubsystem} from './downlink.js';


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


export const getMessageFromBytes = (
    mtxType: 'mtx1' | 'mtx3',
    subsystemId: TUint8
): TMessageFromBytes | undefined => {
    const subsystem: ISubsystem = subsystems[mtxType][subsystemId];

    return subsystem?.getMessageFromBytes;
};

export const getBytesFromMessage = (
    mtxType: 'mtx1' | 'mtx3',
    subsystemId: TUint8
): TBytesFromMessage | undefined => {
    const subsystem: ISubsystem = subsystems[mtxType][subsystemId];

    return subsystem?.getBytesFromMessage;
};
