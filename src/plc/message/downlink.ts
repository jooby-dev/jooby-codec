import * as wrappers from '../../mtx1/message/wrappers.js';

import * as commands from '../commands/downlink/index.js';
import downlinkNames from '../constants/downlinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = downlinkNames;

export const fromBytes = wrappers.getMessageFromBytes(fromBytesMap, nameMap);

export const toBytes = wrappers.getToBytes(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.getBuildDate.id] = commands.getBuildDate.toBytes;
toBytesMap[commands.getFeedersStatus.id] = commands.getFeedersStatus.toBytes;
toBytesMap[commands.getFrequencyStatus.id] = commands.getFrequencyStatus.toBytes;
toBytesMap[commands.getLoopback.id] = commands.getLoopback.toBytes;
toBytesMap[commands.getModemStatus.id] = commands.getModemStatus.toBytes;
toBytesMap[commands.getPhaseStatus.id] = commands.getPhaseStatus.toBytes;
toBytesMap[commands.phyConnect.id] = commands.phyConnect.toBytes;
toBytesMap[commands.phyDisconnect.id] = commands.phyDisconnect.toBytes;
toBytesMap[commands.restart.id] = commands.restart.toBytes;
toBytesMap[commands.writeDownlinkTable.id] = commands.writeDownlinkTable.toBytes;
toBytesMap[commands.writeLinkTable.id] = commands.writeLinkTable.toBytes;


// because of webpack/rollup processing!
fromBytesMap[commands.getBuildDate.id] = commands.getBuildDate.fromBytes;
fromBytesMap[commands.getFeedersStatus.id] = commands.getFeedersStatus.fromBytes;
fromBytesMap[commands.getFrequencyStatus.id] = commands.getFrequencyStatus.fromBytes;
fromBytesMap[commands.getLoopback.id] = commands.getLoopback.fromBytes;
fromBytesMap[commands.getModemStatus.id] = commands.getModemStatus.fromBytes;
fromBytesMap[commands.getPhaseStatus.id] = commands.getPhaseStatus.fromBytes;
fromBytesMap[commands.phyConnect.id] = commands.phyConnect.fromBytes;
fromBytesMap[commands.phyDisconnect.id] = commands.phyDisconnect.fromBytes;
fromBytesMap[commands.restart.id] = commands.restart.fromBytes;
fromBytesMap[commands.writeDownlinkTable.id] = commands.writeDownlinkTable.fromBytes;
fromBytesMap[commands.writeLinkTable.id] = commands.writeLinkTable.fromBytes;
