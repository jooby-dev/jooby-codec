/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog/message/downlink';
 * import * as downlinkCommands from 'jooby-codec/analog/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.correctTime2000.id,
 *         parameters: {sequenceNumber: 45, seconds: -120}
 *     }
 * ];
 * const bytes = message.toBytes(commands);
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // output:
 * '[12,2,45,136,254]'
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // output:
 * '0c 02 2d 88 fe'
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/downlink/index.js';
import * as wrappers from './wrappers.js';
import downlinkNames from '../constants/downlinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = downlinkNames;

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);
export const toMessage = wrappers.getToMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.correctTime2000.id] = commands.correctTime2000.toBytes;
toBytesMap[commands.dataSegment.id] = commands.dataSegment.toBytes;
toBytesMap[commands.getArchiveDays.id] = commands.getArchiveDays.toBytes;
toBytesMap[commands.getArchiveDaysMc.id] = commands.getArchiveDaysMc.toBytes;
toBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.toBytes;
toBytesMap[commands.getArchiveHours.id] = commands.getArchiveHours.toBytes;
toBytesMap[commands.getArchiveHoursMc.id] = commands.getArchiveHoursMc.toBytes;
toBytesMap[commands.getArchiveHoursMcEx.id] = commands.getArchiveHoursMcEx.toBytes;
toBytesMap[commands.getBatteryStatus.id] = commands.getBatteryStatus.toBytes;
toBytesMap[commands.getChannelsStatus.id] = commands.getChannelsStatus.toBytes;
toBytesMap[commands.getChannelsTypes.id] = commands.getChannelsTypes.toBytes;
toBytesMap[commands.getCurrent.id] = commands.getCurrent.toBytes;
toBytesMap[commands.getCurrentMc.id] = commands.getCurrentMc.toBytes;
toBytesMap[commands.getExAbsArchiveDaysMc.id] = commands.getExAbsArchiveDaysMc.toBytes;
toBytesMap[commands.getExAbsArchiveHoursMc.id] = commands.getExAbsArchiveHoursMc.toBytes;
toBytesMap[commands.getExAbsCurrentMc.id] = commands.getExAbsCurrentMc.toBytes;
toBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.toBytes;
toBytesMap[commands.getParameter.id] = commands.getParameter.toBytes;
toBytesMap[commands.getStatus.id] = commands.getStatus.toBytes;
toBytesMap[commands.getTime2000.id] = commands.getTime2000.toBytes;
toBytesMap[commands.setParameter.id] = commands.setParameter.toBytes;
toBytesMap[commands.setTime2000.id] = commands.setTime2000.toBytes;
toBytesMap[commands.softRestart.id] = commands.softRestart.toBytes;
toBytesMap[commands.updateRun.id] = commands.updateRun.toBytes;
toBytesMap[commands.usWaterMeterCommand.id] = commands.usWaterMeterCommand.toBytes;
toBytesMap[commands.verifyImage.id] = commands.verifyImage.toBytes;
toBytesMap[commands.writeImage.id] = commands.writeImage.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.correctTime2000.id] = commands.correctTime2000.fromBytes;
fromBytesMap[commands.dataSegment.id] = commands.dataSegment.fromBytes;
fromBytesMap[commands.getArchiveDays.id] = commands.getArchiveDays.fromBytes;
fromBytesMap[commands.getArchiveDaysMc.id] = commands.getArchiveDaysMc.fromBytes;
fromBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.fromBytes;
fromBytesMap[commands.getArchiveHours.id] = commands.getArchiveHours.fromBytes;
fromBytesMap[commands.getArchiveHoursMc.id] = commands.getArchiveHoursMc.fromBytes;
fromBytesMap[commands.getArchiveHoursMcEx.id] = commands.getArchiveHoursMcEx.fromBytes;
fromBytesMap[commands.getBatteryStatus.id] = commands.getBatteryStatus.fromBytes;
fromBytesMap[commands.getChannelsStatus.id] = commands.getChannelsStatus.fromBytes;
fromBytesMap[commands.getChannelsTypes.id] = commands.getChannelsTypes.fromBytes;
fromBytesMap[commands.getCurrent.id] = commands.getCurrent.fromBytes;
fromBytesMap[commands.getCurrentMc.id] = commands.getCurrentMc.fromBytes;
fromBytesMap[commands.getExAbsArchiveDaysMc.id] = commands.getExAbsArchiveDaysMc.fromBytes;
fromBytesMap[commands.getExAbsArchiveHoursMc.id] = commands.getExAbsArchiveHoursMc.fromBytes;
fromBytesMap[commands.getExAbsCurrentMc.id] = commands.getExAbsCurrentMc.fromBytes;
fromBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.fromBytes;
fromBytesMap[commands.getParameter.id] = commands.getParameter.fromBytes;
fromBytesMap[commands.getStatus.id] = commands.getStatus.fromBytes;
fromBytesMap[commands.getTime2000.id] = commands.getTime2000.fromBytes;
fromBytesMap[commands.setParameter.id] = commands.setParameter.fromBytes;
fromBytesMap[commands.setTime2000.id] = commands.setTime2000.fromBytes;
fromBytesMap[commands.softRestart.id] = commands.softRestart.fromBytes;
fromBytesMap[commands.updateRun.id] = commands.updateRun.fromBytes;
fromBytesMap[commands.usWaterMeterCommand.id] = commands.usWaterMeterCommand.fromBytes;
fromBytesMap[commands.verifyImage.id] = commands.verifyImage.fromBytes;
fromBytesMap[commands.writeImage.id] = commands.writeImage.fromBytes;
