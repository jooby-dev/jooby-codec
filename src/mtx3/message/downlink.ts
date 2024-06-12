/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx3/message/downlink';
 * import * as frame from 'jooby-codec/mtx/utils/frame.js';
 * import * as downlinkCommands from 'jooby-codec/mtx3/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 * import * as frameTypes from 'jooby-codec/mtx/constants/frameTypes.js';
 *
 * const aesKey = [...Array(16).keys()];
 * const messageId = 10;
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.setDateTime.id,
 *         parameters: {
 *             isSummerTime: false,
 *             seconds: 55,
 *             minutes: 31,
 *             hours: 18,
 *             day: 2,
 *             date: 19,
 *             month: 2,
 *             year: 24
 *         }
 *     }
 * ];
 * const messageBytes = message.toBytes(
 *     commands,
 *     {
 *         messageId,
 *         accessLevel: downlinkCommands.setDateTime.accessLevel,
 *         aesKey
 *     }
 * );
 *
 * console.log('message encoded:', JSON.stringify(messageBytes));
 * // output:
 * [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132]
 *
 * console.log('message encoded in HEX:', getHexFromBytes(messageBytes));
 * // output:
 * '0a 13 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84'
 *
 * const frameBytes = frame.toBytes(
 *     messageBytes,
 *     {
 *         type: frameTypes.DATA_REQUEST,
 *         source: 0xffff,
 *         destination: 0xaaaa
 *     }
 * );
 *
 * console.log('frame encoded:', frameBytes);
 * // output:
 * [126,80,170,170,255,255,10,125,51,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132,97,187,126]
 *
 * console.log('frame encoded in HEX:', getHexFromBytes(frameBytes));
 * // output:
 * '7e 50 aa aa ff ff 0a 7d 33 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84 61 bb 7e'
 *
 *
 * // decode message back from bytes
 * const parsedMessage = message.fromBytes(messageBytes, {aesKey});
 *
 * console.log('parsed message:', parsedMessage);
 * // output:
 * {
 *     messageId: 3,
 *     accessLevel: 3,
 *     commands: [
 *         {
 *             id: 8,
 *             name: 'setDateTime',
 *             headerSize: 2,
 *             bytes: [Array],
 *             parameters: [Object]
 *         }
 *     ],
 *     bytes: [3,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
 *     lrc: {expected: 119, actual: 119}
 * }
 *
 * // decode message back from frame
 * const parsedFrame = frame.fromBytes(frameBytes);
 *
 * console.log('parsedFrame:', parsedFrame);
 * // output:
 * {
 *     bytes: [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
 *     crc: {actual: 47969, expected: 47969},
 *     header: {type: 80, destination: 43690, source: 65535}
 * }
 *
 * // parsed successfully
 * if ( 'bytes' in parsedFrame ) {
 *     const parsedMessage2 = message.fromBytes(parsedFrame.bytes, {aesKey});
 *
 *     console.log('parsedMessage2:', parsedMessage2);
 *     // output:
 *     {
 *         messageId: 10,
 *         accessLevel: 3,
 *         commands: [
 *             {
 *                 id: 8,
 *                 name: 'setDateTime',
 *                 headerSize: 2,
 *                 bytes: [Array],
 *                 parameters: [Object]
 *             }
 *         ],
 *         bytes: [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
 *         lrc: {expected: 119, actual: 119}
 *     }
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../../mtx/commands/downlink/index.js';
import * as wrappers from '../../mtx/message/wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// commands identical to MTX1
toBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.toBytes;
toBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.toBytes;
toBytesMap[commands.getDateTime.id] = commands.getDateTime.toBytes;
toBytesMap[commands.getDeviceId.id] = commands.getDeviceId.toBytes;
toBytesMap[commands.getDeviceType.id] = commands.getDeviceType.toBytes;
toBytesMap[commands.getEvents.id] = commands.getEvents.toBytes;
toBytesMap[commands.getSaldo.id] = commands.getSaldo.toBytes;
toBytesMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.toBytes;
toBytesMap[commands.getVersion.id] = commands.getVersion.toBytes;
toBytesMap[commands.setAccessKey.id] = commands.setAccessKey.toBytes;
toBytesMap[commands.setCorrectDateTime.id] = commands.setCorrectDateTime.toBytes;
toBytesMap[commands.setCorrectTime.id] = commands.setCorrectTime.toBytes;
toBytesMap[commands.setDateTime.id] = commands.setDateTime.toBytes;
toBytesMap[commands.setSaldo.id] = commands.setSaldo.toBytes;
toBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.toBytes;
toBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.toBytes;
toBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.toBytes;
toBytesMap[commands.getEventsCounters.id] = commands.getEventsCounters.toBytes;
toBytesMap[commands.getEventStatus.id] = commands.getEventStatus.toBytes;
toBytesMap[commands.resetPowerMaxDay.id] = commands.resetPowerMaxDay.toBytes;
toBytesMap[commands.resetPowerMaxMonth.id] = commands.resetPowerMaxMonth.toBytes;
toBytesMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.toBytes;
toBytesMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.toBytes;
toBytesMap[commands.setDayProfile.id] = commands.setDayProfile.toBytes;
toBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.toBytes;
toBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.toBytes;
toBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.toBytes;
toBytesMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.toBytes;
toBytesMap[commands.runTariffPlan.id] = commands.runTariffPlan.toBytes;
toBytesMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.toBytes;
toBytesMap[commands.getDayProfile.id] = commands.getDayProfile.toBytes;
toBytesMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.toBytes;
toBytesMap[commands.getSpecialDay.id] = commands.getSpecialDay.toBytes;

// commands different from MTX1
toBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.toBytes;


// commands identical to MTX1
fromBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.fromBytes;
fromBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.fromBytes;
fromBytesMap[commands.getDateTime.id] = commands.getDateTime.fromBytes;
fromBytesMap[commands.getDeviceId.id] = commands.getDeviceId.fromBytes;
fromBytesMap[commands.getDeviceType.id] = commands.getDeviceType.fromBytes;
fromBytesMap[commands.getEvents.id] = commands.getEvents.fromBytes;
fromBytesMap[commands.getSaldo.id] = commands.getSaldo.fromBytes;
fromBytesMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.fromBytes;
fromBytesMap[commands.getVersion.id] = commands.getVersion.fromBytes;
fromBytesMap[commands.setAccessKey.id] = commands.setAccessKey.fromBytes;
fromBytesMap[commands.setCorrectDateTime.id] = commands.setCorrectDateTime.fromBytes;
fromBytesMap[commands.setCorrectTime.id] = commands.setCorrectTime.fromBytes;
fromBytesMap[commands.setDateTime.id] = commands.setDateTime.fromBytes;
fromBytesMap[commands.setSaldo.id] = commands.setSaldo.fromBytes;
fromBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.fromBytes;
fromBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.fromBytes;
fromBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.fromBytes;
fromBytesMap[commands.getEventsCounters.id] = commands.getEventsCounters.fromBytes;
fromBytesMap[commands.getEventStatus.id] = commands.getEventStatus.fromBytes;
fromBytesMap[commands.resetPowerMaxDay.id] = commands.resetPowerMaxDay.fromBytes;
fromBytesMap[commands.resetPowerMaxMonth.id] = commands.resetPowerMaxMonth.fromBytes;
fromBytesMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.fromBytes;
fromBytesMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[commands.setDayProfile.id] = commands.setDayProfile.fromBytes;
fromBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.fromBytes;
fromBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.fromBytes;
fromBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.fromBytes;
fromBytesMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.fromBytes;
fromBytesMap[commands.runTariffPlan.id] = commands.runTariffPlan.fromBytes;
fromBytesMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.fromBytes;
fromBytesMap[commands.getDayProfile.id] = commands.getDayProfile.fromBytes;
fromBytesMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.fromBytes;
fromBytesMap[commands.getSpecialDay.id] = commands.getSpecialDay.fromBytes;

// commands different from MTX1
fromBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.fromBytes;


// commands identical to MTX1
nameMap[commands.getBuildVersion.id] = commands.getBuildVersion.name;
nameMap[commands.getCorrectTime.id] = commands.getCorrectTime.name;
nameMap[commands.getDateTime.id] = commands.getDateTime.name;
nameMap[commands.getDeviceId.id] = commands.getDeviceId.name;
nameMap[commands.getDeviceType.id] = commands.getDeviceType.name;
nameMap[commands.getEvents.id] = commands.getEvents.name;
nameMap[commands.getSaldo.id] = commands.getSaldo.name;
nameMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.name;
nameMap[commands.getVersion.id] = commands.getVersion.name;
nameMap[commands.setAccessKey.id] = commands.setAccessKey.name;
nameMap[commands.setCorrectDateTime.id] = commands.setCorrectDateTime.name;
nameMap[commands.setCorrectTime.id] = commands.setCorrectTime.name;
nameMap[commands.setDateTime.id] = commands.setDateTime.name;
nameMap[commands.setSaldo.id] = commands.setSaldo.name;
nameMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.name;
nameMap[commands.turnRelayOff.id] = commands.turnRelayOff.name;
nameMap[commands.turnRelayOn.id] = commands.turnRelayOn.name;
nameMap[commands.getEventsCounters.id] = commands.getEventsCounters.name;
nameMap[commands.getEventStatus.id] = commands.getEventStatus.name;
nameMap[commands.resetPowerMaxDay.id] = commands.resetPowerMaxDay.name;
nameMap[commands.resetPowerMaxMonth.id] = commands.resetPowerMaxMonth.name;
nameMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.name;
nameMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.name;
nameMap[commands.setDayProfile.id] = commands.setDayProfile.name;
nameMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.name;
nameMap[commands.setSpecialDay.id] = commands.setSpecialDay.name;
nameMap[commands.activateRatePlan.id] = commands.activateRatePlan.name;
nameMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.name;
nameMap[commands.runTariffPlan.id] = commands.runTariffPlan.name;
nameMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.name;
nameMap[commands.getDayProfile.id] = commands.getDayProfile.name;
nameMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.name;
nameMap[commands.getSpecialDay.id] = commands.getSpecialDay.name;

// commands different from MTX1
nameMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.name;
