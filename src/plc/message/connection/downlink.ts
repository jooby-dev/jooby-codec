import * as wrappers from '../../../mtx1/message/wrappers.js';

import * as commands from '../../commands/downlink/index.js';
import downlinkNames from '../../constants/downlinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = downlinkNames;

export const getMessageFromBytes = wrappers.getMessageFromBytes(fromBytesMap, nameMap);

export const getBytesFromMessage = wrappers.getBytesFromMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.phyConnect.id] = commands.phyConnect.toBytes;


// because of webpack/rollup processing!
fromBytesMap[commands.phyConnect.id] = commands.phyConnect.fromBytes;
