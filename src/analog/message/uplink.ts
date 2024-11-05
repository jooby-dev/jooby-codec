/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog/message/uplink';
 *
 * // binary data received from a device
 * const bytes = [0x0c, 0x01, 0x00, 0x58];
 *
 * // decode it
 * const payload = message.fromBytes(bytes);
 *
 * if ( 'error' in payload ) {
 *     console.log('decode failure:', payload.error, payload.message);
 * } else {
 *     console.log('message decoded:', payload.commands);
 *     // output:
 *     [
 *         {
 *             id: 12,
 *             name: "correctTime2000",
 *             headerSize: 2,
 *             bytes: [ 12, 1, 0 ],
 *             parameters: { status: 0 }
 *         }
 *     ]
 * }
 * ```
 *
 * @example with config
 * ```js
 * import * as message from 'jooby-codec/analog/message/uplink';
 * import * as hardwareTypes from 'jooby-codec/analog/constants/hardwareTypes.js';
 *
 * // binary data received from a device
 * const bytes = [0x62, 0x20, 0x09, 0x1e];
 *
 * const config = {
 *     hardwareType: hardwareTypes.GASI3
 * };
 *
 * // decode it
 * const payload = message.fromBytes(bytes, config);
 *
 * if ( 'error' in payload ) {
 *     console.log('decode failure:', payload.error, payload.message);
 * } else {
 *     console.log('message decoded:', payload.commands[0]);
 *     // output:
 *     [
 *         {
 *             id: 96,
 *             name: 'lastEvent',
 *             headerSize: 1,
 *             bytes: [98, 32, 9],
 *             config: {hardwareType: 3},
 *             parameters: {
 *                 sequenceNumber: 32,
 *                 status: {
 *                     isBatteryLow: true,
 *                     isMagneticInfluence: false,
 *                     isButtonReleased: false,
 *                     isConnectionLost: true
 *                 }
 *             }
 *         }
 *     ]
 * }
 * ```
 *
 * @packageDocumentation
 */

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
toBytesMap[commands.correctTime2000.id] = commands.correctTime2000.toBytes;
toBytesMap[commands.current.id] = commands.current.toBytes;
toBytesMap[commands.currentMc.id] = commands.currentMc.toBytes;
toBytesMap[commands.dataSegment.id] = commands.dataSegment.toBytes;
toBytesMap[commands.day.id] = commands.day.toBytes;
toBytesMap[commands.dayMc.id] = commands.dayMc.toBytes;
toBytesMap[commands.exAbsCurrentMc.id] = commands.exAbsCurrentMc.toBytes;
toBytesMap[commands.exAbsDayMc.id] = commands.exAbsDayMc.toBytes;
toBytesMap[commands.exAbsHourMc.id] = commands.exAbsHourMc.toBytes;
toBytesMap[commands.getArchiveDays.id] = commands.getArchiveDays.toBytes;
toBytesMap[commands.getArchiveDaysMc.id] = commands.getArchiveDaysMc.toBytes;
toBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.toBytes;
toBytesMap[commands.getArchiveHours.id] = commands.getArchiveHours.toBytes;
toBytesMap[commands.getArchiveHoursMc.id] = commands.getArchiveHoursMc.toBytes;
toBytesMap[commands.getArchiveHoursMcEx.id] = commands.getArchiveHoursMcEx.toBytes;
toBytesMap[commands.getBatteryStatus.id] = commands.getBatteryStatus.toBytes;
toBytesMap[commands.getChannelsStatus.id] = commands.getChannelsStatus.toBytes;
toBytesMap[commands.getExAbsArchiveDaysMc.id] = commands.getExAbsArchiveDaysMc.toBytes;
toBytesMap[commands.getExAbsArchiveHoursMc.id] = commands.getExAbsArchiveHoursMc.toBytes;
toBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.toBytes;
toBytesMap[commands.getParameter.id] = commands.getParameter.toBytes;
toBytesMap[commands.hour.id] = commands.hour.toBytes;
toBytesMap[commands.hourMc.id] = commands.hourMc.toBytes;
toBytesMap[commands.hourMcEx.id] = commands.hourMcEx.toBytes;
toBytesMap[commands.lastEvent.id] = commands.lastEvent.toBytes;
toBytesMap[commands.newEvent.id] = commands.newEvent.toBytes;
toBytesMap[commands.setParameter.id] = commands.setParameter.toBytes;
toBytesMap[commands.setTime2000.id] = commands.setTime2000.toBytes;
toBytesMap[commands.softRestart.id] = commands.softRestart.toBytes;
toBytesMap[commands.status.id] = commands.status.toBytes;
toBytesMap[commands.time2000.id] = commands.time2000.toBytes;
toBytesMap[commands.updateRun.id] = commands.updateRun.toBytes;
toBytesMap[commands.usWaterMeterBatteryStatus.id] = commands.usWaterMeterBatteryStatus.toBytes;
toBytesMap[commands.usWaterMeterCommand.id] = commands.usWaterMeterCommand.toBytes;
toBytesMap[commands.verifyImage.id] = commands.verifyImage.toBytes;
toBytesMap[commands.writeImage.id] = commands.writeImage.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.correctTime2000.id] = commands.correctTime2000.fromBytes;
fromBytesMap[commands.current.id] = commands.current.fromBytes;
fromBytesMap[commands.currentMc.id] = commands.currentMc.fromBytes;
fromBytesMap[commands.dataSegment.id] = commands.dataSegment.fromBytes;
fromBytesMap[commands.day.id] = commands.day.fromBytes;
fromBytesMap[commands.dayMc.id] = commands.dayMc.fromBytes;
fromBytesMap[commands.exAbsCurrentMc.id] = commands.exAbsCurrentMc.fromBytes;
fromBytesMap[commands.exAbsDayMc.id] = commands.exAbsDayMc.fromBytes;
fromBytesMap[commands.exAbsHourMc.id] = commands.exAbsHourMc.fromBytes;
fromBytesMap[commands.getArchiveDays.id] = commands.getArchiveDays.fromBytes;
fromBytesMap[commands.getArchiveDaysMc.id] = commands.getArchiveDaysMc.fromBytes;
fromBytesMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.fromBytes;
fromBytesMap[commands.getArchiveHours.id] = commands.getArchiveHours.fromBytes;
fromBytesMap[commands.getArchiveHoursMc.id] = commands.getArchiveHoursMc.fromBytes;
fromBytesMap[commands.getArchiveHoursMcEx.id] = commands.getArchiveHoursMcEx.fromBytes;
fromBytesMap[commands.getBatteryStatus.id] = commands.getBatteryStatus.fromBytes;
fromBytesMap[commands.getChannelsStatus.id] = commands.getChannelsStatus.fromBytes;
fromBytesMap[commands.getExAbsArchiveDaysMc.id] = commands.getExAbsArchiveDaysMc.fromBytes;
fromBytesMap[commands.getExAbsArchiveHoursMc.id] = commands.getExAbsArchiveHoursMc.fromBytes;
fromBytesMap[commands.getLmicInfo.id] = commands.getLmicInfo.fromBytes;
fromBytesMap[commands.getParameter.id] = commands.getParameter.fromBytes;
fromBytesMap[commands.hour.id] = commands.hour.fromBytes;
fromBytesMap[commands.hourMc.id] = commands.hourMc.fromBytes;
fromBytesMap[commands.hourMcEx.id] = commands.hourMcEx.fromBytes;
fromBytesMap[commands.lastEvent.id] = commands.lastEvent.fromBytes;
fromBytesMap[commands.newEvent.id] = commands.newEvent.fromBytes;
fromBytesMap[commands.setParameter.id] = commands.setParameter.fromBytes;
fromBytesMap[commands.setTime2000.id] = commands.setTime2000.fromBytes;
fromBytesMap[commands.softRestart.id] = commands.softRestart.fromBytes;
fromBytesMap[commands.status.id] = commands.status.fromBytes;
fromBytesMap[commands.time2000.id] = commands.time2000.fromBytes;
fromBytesMap[commands.updateRun.id] = commands.updateRun.fromBytes;
fromBytesMap[commands.usWaterMeterBatteryStatus.id] = commands.usWaterMeterBatteryStatus.fromBytes;
fromBytesMap[commands.usWaterMeterCommand.id] = commands.usWaterMeterCommand.fromBytes;
fromBytesMap[commands.verifyImage.id] = commands.verifyImage.fromBytes;
fromBytesMap[commands.writeImage.id] = commands.writeImage.fromBytes;

nameMap[commands.correctTime2000.id] = commands.correctTime2000.name;
nameMap[commands.current.id] = commands.current.name;
nameMap[commands.currentMc.id] = commands.currentMc.name;
nameMap[commands.dataSegment.id] = commands.dataSegment.name;
nameMap[commands.day.id] = commands.day.name;
nameMap[commands.dayMc.id] = commands.dayMc.name;
nameMap[commands.exAbsCurrentMc.id] = commands.exAbsCurrentMc.name;
nameMap[commands.exAbsDayMc.id] = commands.exAbsDayMc.name;
nameMap[commands.exAbsHourMc.id] = commands.exAbsHourMc.name;
nameMap[commands.getArchiveDays.id] = commands.getArchiveDays.name;
nameMap[commands.getArchiveDaysMc.id] = commands.getArchiveDaysMc.name;
nameMap[commands.getArchiveEvents.id] = commands.getArchiveEvents.name;
nameMap[commands.getArchiveHours.id] = commands.getArchiveHours.name;
nameMap[commands.getArchiveHoursMc.id] = commands.getArchiveHoursMc.name;
nameMap[commands.getArchiveHoursMcEx.id] = commands.getArchiveHoursMcEx.name;
nameMap[commands.getBatteryStatus.id] = commands.getBatteryStatus.name;
nameMap[commands.getChannelsStatus.id] = commands.getChannelsStatus.name;
nameMap[commands.getExAbsArchiveDaysMc.id] = commands.getExAbsArchiveDaysMc.name;
nameMap[commands.getExAbsArchiveHoursMc.id] = commands.getExAbsArchiveHoursMc.name;
nameMap[commands.getLmicInfo.id] = commands.getLmicInfo.name;
nameMap[commands.getParameter.id] = commands.getParameter.name;
nameMap[commands.hour.id] = commands.hour.name;
nameMap[commands.hourMc.id] = commands.hourMc.name;
nameMap[commands.hourMcEx.id] = commands.hourMcEx.name;
nameMap[commands.lastEvent.id] = commands.lastEvent.name;
nameMap[commands.newEvent.id] = commands.newEvent.name;
nameMap[commands.setParameter.id] = commands.setParameter.name;
nameMap[commands.setTime2000.id] = commands.setTime2000.name;
nameMap[commands.softRestart.id] = commands.softRestart.name;
nameMap[commands.status.id] = commands.status.name;
nameMap[commands.time2000.id] = commands.time2000.name;
nameMap[commands.updateRun.id] = commands.updateRun.name;
nameMap[commands.usWaterMeterBatteryStatus.id] = commands.usWaterMeterBatteryStatus.name;
nameMap[commands.usWaterMeterCommand.id] = commands.usWaterMeterCommand.name;
nameMap[commands.verifyImage.id] = commands.verifyImage.name;
nameMap[commands.writeImage.id] = commands.writeImage.name;
