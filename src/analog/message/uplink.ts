import * as commands from '../commands/uplink/index.js';
import * as wrappers from './wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap);
export const toBytes = wrappers.getToBytes(toBytesMap);
export const toMessage = wrappers.getToMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.correctTime2000.id] = commands.correctTime2000.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.correctTime2000.id] = commands.correctTime2000.fromBytes;
