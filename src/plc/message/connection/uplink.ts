import * as wrappers from '../../../mtx1/message/wrappers.js';

import * as commands from '../../commands/uplink/index.js';
import uplinkNames from '../../constants/uplinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = uplinkNames;

export const getMessageFromBytes = wrappers.getMessageFromBytes(fromBytesMap, nameMap);

export const getBytesFromMessage = wrappers.getBytesFromMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.phyConnect.id] = commands.phyConnect.toBytes;


// because of webpack/rollup processing!
fromBytesMap[commands.phyConnect.id] = commands.phyConnect.fromBytes;
