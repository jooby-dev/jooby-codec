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

import * as mtxCommands from '../../mtx/commands/downlink/index.js';
import * as wrappers from '../../mtx/message/wrappers.js';
import * as mtx3Commands from '../commands/downlink/index.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// commands identical to MTX1
toBytesMap[mtxCommands.activateRatePlan.id] = mtxCommands.activateRatePlan.toBytes;
toBytesMap[mtxCommands.getBuildVersion.id] = mtxCommands.getBuildVersion.toBytes;
toBytesMap[mtxCommands.getCorrectTime.id] = mtxCommands.getCorrectTime.toBytes;
toBytesMap[mtxCommands.getDateTime.id] = mtxCommands.getDateTime.toBytes;
toBytesMap[mtxCommands.getDayProfile.id] = mtxCommands.getDayProfile.toBytes;
toBytesMap[mtxCommands.getDeviceId.id] = mtxCommands.getDeviceId.toBytes;
toBytesMap[mtxCommands.getDeviceType.id] = mtxCommands.getDeviceType.toBytes;
toBytesMap[mtxCommands.getEvents.id] = mtxCommands.getEvents.toBytes;
toBytesMap[mtxCommands.getEventsCounters.id] = mtxCommands.getEventsCounters.toBytes;
toBytesMap[mtxCommands.getEventStatus.id] = mtxCommands.getEventStatus.toBytes;
toBytesMap[mtxCommands.getMagneticFieldThreshold.id] = mtxCommands.getMagneticFieldThreshold.toBytes;
toBytesMap[mtxCommands.getRatePlanInfo.id] = mtxCommands.getRatePlanInfo.toBytes;
toBytesMap[mtxCommands.getSaldo.id] = mtxCommands.getSaldo.toBytes;
toBytesMap[mtxCommands.getSaldoParameters.id] = mtxCommands.getSaldoParameters.toBytes;
toBytesMap[mtxCommands.getSeasonProfile.id] = mtxCommands.getSeasonProfile.toBytes;
toBytesMap[mtxCommands.getSpecialDay.id] = mtxCommands.getSpecialDay.toBytes;
toBytesMap[mtxCommands.getVersion.id] = mtxCommands.getVersion.toBytes;
toBytesMap[mtxCommands.prepareRatePlan.id] = mtxCommands.prepareRatePlan.toBytes;
toBytesMap[mtxCommands.resetPowerMaxDay.id] = mtxCommands.resetPowerMaxDay.toBytes;
toBytesMap[mtxCommands.resetPowerMaxMonth.id] = mtxCommands.resetPowerMaxMonth.toBytes;
toBytesMap[mtxCommands.runTariffPlan.id] = mtxCommands.runTariffPlan.toBytes;
toBytesMap[mtxCommands.setAccessKey.id] = mtxCommands.setAccessKey.toBytes;
toBytesMap[mtxCommands.setCorrectDateTime.id] = mtxCommands.setCorrectDateTime.toBytes;
toBytesMap[mtxCommands.setCorrectTime.id] = mtxCommands.setCorrectTime.toBytes;
toBytesMap[mtxCommands.setDateTime.id] = mtxCommands.setDateTime.toBytes;
toBytesMap[mtxCommands.setDayProfile.id] = mtxCommands.setDayProfile.toBytes;
toBytesMap[mtxCommands.setSaldo.id] = mtxCommands.setSaldo.toBytes;
toBytesMap[mtxCommands.setSaldoParameters.id] = mtxCommands.setSaldoParameters.toBytes;
toBytesMap[mtxCommands.setSeasonProfile.id] = mtxCommands.setSeasonProfile.toBytes;
toBytesMap[mtxCommands.setSpecialDay.id] = mtxCommands.setSpecialDay.toBytes;
toBytesMap[mtxCommands.setSpecialOperation.id] = mtxCommands.setSpecialOperation.toBytes;
toBytesMap[mtxCommands.turnRelayOff.id] = mtxCommands.turnRelayOff.toBytes;
toBytesMap[mtxCommands.turnRelayOn.id] = mtxCommands.turnRelayOn.toBytes;

// commands different from MTX1
toBytesMap[mtx3Commands.getCriticalEvent.id] = mtx3Commands.getCriticalEvent.toBytes;
toBytesMap[mtx3Commands.getDisplayParam.id] = mtx3Commands.getDisplayParam.toBytes;
toBytesMap[mtx3Commands.setDisplayParam.id] = mtx3Commands.setDisplayParam.toBytes;


// commands identical to MTX1
fromBytesMap[mtxCommands.activateRatePlan.id] = mtxCommands.activateRatePlan.fromBytes;
fromBytesMap[mtxCommands.getBuildVersion.id] = mtxCommands.getBuildVersion.fromBytes;
fromBytesMap[mtxCommands.getCorrectTime.id] = mtxCommands.getCorrectTime.fromBytes;
fromBytesMap[mtxCommands.getDateTime.id] = mtxCommands.getDateTime.fromBytes;
fromBytesMap[mtxCommands.getDayProfile.id] = mtxCommands.getDayProfile.fromBytes;
fromBytesMap[mtxCommands.getDeviceId.id] = mtxCommands.getDeviceId.fromBytes;
fromBytesMap[mtxCommands.getDeviceType.id] = mtxCommands.getDeviceType.fromBytes;
fromBytesMap[mtxCommands.getEvents.id] = mtxCommands.getEvents.fromBytes;
fromBytesMap[mtxCommands.getEventsCounters.id] = mtxCommands.getEventsCounters.fromBytes;
fromBytesMap[mtxCommands.getEventStatus.id] = mtxCommands.getEventStatus.fromBytes;
fromBytesMap[mtxCommands.getMagneticFieldThreshold.id] = mtxCommands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[mtxCommands.getRatePlanInfo.id] = mtxCommands.getRatePlanInfo.fromBytes;
fromBytesMap[mtxCommands.getSaldo.id] = mtxCommands.getSaldo.fromBytes;
fromBytesMap[mtxCommands.getSaldoParameters.id] = mtxCommands.getSaldoParameters.fromBytes;
fromBytesMap[mtxCommands.getSeasonProfile.id] = mtxCommands.getSeasonProfile.fromBytes;
fromBytesMap[mtxCommands.getSpecialDay.id] = mtxCommands.getSpecialDay.fromBytes;
fromBytesMap[mtxCommands.getVersion.id] = mtxCommands.getVersion.fromBytes;
fromBytesMap[mtxCommands.prepareRatePlan.id] = mtxCommands.prepareRatePlan.fromBytes;
fromBytesMap[mtxCommands.resetPowerMaxDay.id] = mtxCommands.resetPowerMaxDay.fromBytes;
fromBytesMap[mtxCommands.resetPowerMaxMonth.id] = mtxCommands.resetPowerMaxMonth.fromBytes;
fromBytesMap[mtxCommands.runTariffPlan.id] = mtxCommands.runTariffPlan.fromBytes;
fromBytesMap[mtxCommands.setAccessKey.id] = mtxCommands.setAccessKey.fromBytes;
fromBytesMap[mtxCommands.setCorrectDateTime.id] = mtxCommands.setCorrectDateTime.fromBytes;
fromBytesMap[mtxCommands.setCorrectTime.id] = mtxCommands.setCorrectTime.fromBytes;
fromBytesMap[mtxCommands.setDateTime.id] = mtxCommands.setDateTime.fromBytes;
fromBytesMap[mtxCommands.setDayProfile.id] = mtxCommands.setDayProfile.fromBytes;
fromBytesMap[mtxCommands.setSaldo.id] = mtxCommands.setSaldo.fromBytes;
fromBytesMap[mtxCommands.setSaldoParameters.id] = mtxCommands.setSaldoParameters.fromBytes;
fromBytesMap[mtxCommands.setSeasonProfile.id] = mtxCommands.setSeasonProfile.fromBytes;
fromBytesMap[mtxCommands.setSpecialDay.id] = mtxCommands.setSpecialDay.fromBytes;
fromBytesMap[mtxCommands.setSpecialOperation.id] = mtxCommands.setSpecialOperation.fromBytes;
fromBytesMap[mtxCommands.turnRelayOff.id] = mtxCommands.turnRelayOff.fromBytes;
fromBytesMap[mtxCommands.turnRelayOn.id] = mtxCommands.turnRelayOn.fromBytes;

// commands different from MTX1
fromBytesMap[mtx3Commands.getCriticalEvent.id] = mtx3Commands.getCriticalEvent.fromBytes;
fromBytesMap[mtx3Commands.getDisplayParam.id] = mtx3Commands.getDisplayParam.fromBytes;
fromBytesMap[mtx3Commands.setDisplayParam.id] = mtx3Commands.setDisplayParam.fromBytes;


// commands identical to MTX1
nameMap[mtxCommands.activateRatePlan.id] = mtxCommands.activateRatePlan.name;
nameMap[mtxCommands.getBuildVersion.id] = mtxCommands.getBuildVersion.name;
nameMap[mtxCommands.getCorrectTime.id] = mtxCommands.getCorrectTime.name;
nameMap[mtxCommands.getDateTime.id] = mtxCommands.getDateTime.name;
nameMap[mtxCommands.getDayProfile.id] = mtxCommands.getDayProfile.name;
nameMap[mtxCommands.getDeviceId.id] = mtxCommands.getDeviceId.name;
nameMap[mtxCommands.getDeviceType.id] = mtxCommands.getDeviceType.name;
nameMap[mtxCommands.getEvents.id] = mtxCommands.getEvents.name;
nameMap[mtxCommands.getEventsCounters.id] = mtxCommands.getEventsCounters.name;
nameMap[mtxCommands.getEventStatus.id] = mtxCommands.getEventStatus.name;
nameMap[mtxCommands.getMagneticFieldThreshold.id] = mtxCommands.getMagneticFieldThreshold.name;
nameMap[mtxCommands.getRatePlanInfo.id] = mtxCommands.getRatePlanInfo.name;
nameMap[mtxCommands.getSaldo.id] = mtxCommands.getSaldo.name;
nameMap[mtxCommands.getSaldoParameters.id] = mtxCommands.getSaldoParameters.name;
nameMap[mtxCommands.getSeasonProfile.id] = mtxCommands.getSeasonProfile.name;
nameMap[mtxCommands.getSpecialDay.id] = mtxCommands.getSpecialDay.name;
nameMap[mtxCommands.getVersion.id] = mtxCommands.getVersion.name;
nameMap[mtxCommands.prepareRatePlan.id] = mtxCommands.prepareRatePlan.name;
nameMap[mtxCommands.resetPowerMaxDay.id] = mtxCommands.resetPowerMaxDay.name;
nameMap[mtxCommands.resetPowerMaxMonth.id] = mtxCommands.resetPowerMaxMonth.name;
nameMap[mtxCommands.runTariffPlan.id] = mtxCommands.runTariffPlan.name;
nameMap[mtxCommands.setAccessKey.id] = mtxCommands.setAccessKey.name;
nameMap[mtxCommands.setCorrectDateTime.id] = mtxCommands.setCorrectDateTime.name;
nameMap[mtxCommands.setCorrectTime.id] = mtxCommands.setCorrectTime.name;
nameMap[mtxCommands.setDateTime.id] = mtxCommands.setDateTime.name;
nameMap[mtxCommands.setDayProfile.id] = mtxCommands.setDayProfile.name;
nameMap[mtxCommands.setSaldo.id] = mtxCommands.setSaldo.name;
nameMap[mtxCommands.setSaldoParameters.id] = mtxCommands.setSaldoParameters.name;
nameMap[mtxCommands.setSeasonProfile.id] = mtxCommands.setSeasonProfile.name;
nameMap[mtxCommands.setSpecialDay.id] = mtxCommands.setSpecialDay.name;
nameMap[mtxCommands.setSpecialOperation.id] = mtxCommands.setSpecialOperation.name;
nameMap[mtxCommands.turnRelayOff.id] = mtxCommands.turnRelayOff.name;
nameMap[mtxCommands.turnRelayOn.id] = mtxCommands.turnRelayOn.name;

// commands different from MTX1
nameMap[mtx3Commands.getCriticalEvent.id] = mtx3Commands.getCriticalEvent.name;
nameMap[mtx3Commands.getDisplayParam.id] = mtx3Commands.getDisplayParam.name;
nameMap[mtx3Commands.setDisplayParam.id] = mtx3Commands.setDisplayParam.name;
