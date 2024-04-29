import * as commands from '../commands/uplink/index.js';
import * as wrappers from './wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);
export const toMessage = wrappers.getToMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.fromBytes;

nameMap[commands.getBuildVersion.id] = commands.getBuildVersion.name;
