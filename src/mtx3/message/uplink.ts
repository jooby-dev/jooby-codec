/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx3/message/uplink';
 * import * as frame from 'jooby-codec/mtx/utils/frame.js';
 * import getBytesFromHex from 'jooby-codec/utils/getBytesFromHex.js';
 *
 * const aesKey = [...Array(16).keys()];
 *
 * // a message with one getBuildVersion command
 * const messageBytes = getBytesFromHex('0a 13 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7e c2 b5 88');
 * // the same message as a frame
 * const frameBytes = getBytesFromHex('7e 51 aa aa ff ff 0a 7d 33 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7d 5e c2 b5 88 21 54 7e');
 *
 * const parsedMessage = message.fromBytes(messageBytes, {aesKey});
 *
 * console.log('parsed message:', parsedMessage);
 * // output:
 * {
 *     messageId: 10,
 *     accessLevel: 3,
 *     commands: [
 *         {
 *             id: 112,
 *             name: 'getBuildVersion',
 *             headerSize: 2,
 *             bytes: [Array],
 *             parameters: [Object]
 *         }
 *     ],
 *     bytes: [10,19,155,75,247,42,209,229,73,165,9,80,154,89,126,194,181,136],
 *     lrc: {expected: 53, actual: 53}
 * }
 *
 * const parsedFrame = frame.fromBytes(frameBytes);
 *
 * console.log('parsed frame:', parsedFrame);
 * // output:
 * {
 *     bytes: [10,19,155,75,247,42,209,229,73,165,9,80,154,89,126,194,181,136],
 *     crc: {actual: 21537, expected: 21537},
 *     header: {type: 81, destination: 43690, source: 65535}
 * }
 *
 * // parsed successfully
 * if ( 'bytes' in parsedFrame ) {
 *     const parsedMessage2 = message.fromBytes(parsedFrame.bytes, {aesKey});
 *
 *     if ( JSON.stringify(parsedMessage) === JSON.stringify(parsedMessage2) ) {
 *         console.log('correct message');
 *     } else {
 *         throw new Error('parsedMessage and parsedMessage2 should be identical!');
 *     }
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as mtx1Commands from '../../mtx/commands/uplink/index.js';
import * as wrappers from '../../mtx/message/wrappers.js';
import * as commands from '../commands/uplink/index.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// commands identical to MTX1
toBytesMap[mtx1Commands.activateRatePlan.id] = mtx1Commands.activateRatePlan.toBytes;
toBytesMap[mtx1Commands.getBuildVersion.id] = mtx1Commands.getBuildVersion.toBytes;
toBytesMap[mtx1Commands.getCorrectTime.id] = mtx1Commands.getCorrectTime.toBytes;
toBytesMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.toBytes;
toBytesMap[mtx1Commands.getDayProfile.id] = mtx1Commands.getDayProfile.toBytes;
toBytesMap[mtx1Commands.getDeviceId.id] = mtx1Commands.getDeviceId.toBytes;
toBytesMap[mtx1Commands.getDeviceType.id] = mtx1Commands.getDeviceType.toBytes;
toBytesMap[mtx1Commands.getEvents.id] = mtx1Commands.getEvents.toBytes;
toBytesMap[mtx1Commands.getEventsCounters.id] = mtx1Commands.getEventsCounters.toBytes;
toBytesMap[mtx1Commands.getEventStatus.id] = mtx1Commands.getEventStatus.toBytes;
toBytesMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.toBytes;
toBytesMap[mtx1Commands.getRatePlanInfo.id] = mtx1Commands.getRatePlanInfo.toBytes;
toBytesMap[mtx1Commands.getSaldo.id] = mtx1Commands.getSaldo.toBytes;
toBytesMap[mtx1Commands.getSaldoParameters.id] = mtx1Commands.getSaldoParameters.toBytes;
toBytesMap[mtx1Commands.getSeasonProfile.id] = mtx1Commands.getSeasonProfile.toBytes;
toBytesMap[mtx1Commands.getSpecialDay.id] = mtx1Commands.getSpecialDay.toBytes;
toBytesMap[mtx1Commands.getVersion.id] = mtx1Commands.getVersion.toBytes;
toBytesMap[mtx1Commands.prepareRatePlan.id] = mtx1Commands.prepareRatePlan.toBytes;
toBytesMap[mtx1Commands.resetPowerMaxDay.id] = mtx1Commands.resetPowerMaxDay.toBytes;
toBytesMap[mtx1Commands.resetPowerMaxMonth.id] = mtx1Commands.resetPowerMaxMonth.toBytes;
toBytesMap[mtx1Commands.runTariffPlan.id] = mtx1Commands.runTariffPlan.toBytes;
toBytesMap[mtx1Commands.setAccessKey.id] = mtx1Commands.setAccessKey.toBytes;
toBytesMap[mtx1Commands.setCorrectDateTime.id] = mtx1Commands.setCorrectDateTime.toBytes;
toBytesMap[mtx1Commands.setCorrectTime.id] = mtx1Commands.setCorrectTime.toBytes;
toBytesMap[mtx1Commands.setDateTime.id] = mtx1Commands.setDateTime.toBytes;
toBytesMap[mtx1Commands.setDayProfile.id] = mtx1Commands.setDayProfile.toBytes;
toBytesMap[mtx1Commands.setDisplayParam.id] = mtx1Commands.setDisplayParam.toBytes;
toBytesMap[mtx1Commands.setOpParams.id] = mtx1Commands.setOpParams.toBytes;
toBytesMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.toBytes;
toBytesMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.toBytes;
toBytesMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.toBytes;
toBytesMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.toBytes;
toBytesMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.toBytes;
toBytesMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.toBytes;
toBytesMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.toBytes;

// commands different from MTX1
toBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.toBytes;
toBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.toBytes;
toBytesMap[commands.getOpParams.id] = commands.getOpParams.toBytes;


// commands identical to MTX1
fromBytesMap[mtx1Commands.activateRatePlan.id] = mtx1Commands.activateRatePlan.fromBytes;
fromBytesMap[mtx1Commands.getBuildVersion.id] = mtx1Commands.getBuildVersion.fromBytes;
fromBytesMap[mtx1Commands.getCorrectTime.id] = mtx1Commands.getCorrectTime.fromBytes;
fromBytesMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.fromBytes;
fromBytesMap[mtx1Commands.getDayProfile.id] = mtx1Commands.getDayProfile.fromBytes;
fromBytesMap[mtx1Commands.getDeviceId.id] = mtx1Commands.getDeviceId.fromBytes;
fromBytesMap[mtx1Commands.getDeviceType.id] = mtx1Commands.getDeviceType.fromBytes;
fromBytesMap[mtx1Commands.getEvents.id] = mtx1Commands.getEvents.fromBytes;
fromBytesMap[mtx1Commands.getEventsCounters.id] = mtx1Commands.getEventsCounters.fromBytes;
fromBytesMap[mtx1Commands.getEventStatus.id] = mtx1Commands.getEventStatus.fromBytes;
fromBytesMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[mtx1Commands.getRatePlanInfo.id] = mtx1Commands.getRatePlanInfo.fromBytes;
fromBytesMap[mtx1Commands.getSaldo.id] = mtx1Commands.getSaldo.fromBytes;
fromBytesMap[mtx1Commands.getSaldoParameters.id] = mtx1Commands.getSaldoParameters.fromBytes;
fromBytesMap[mtx1Commands.getSeasonProfile.id] = mtx1Commands.getSeasonProfile.fromBytes;
fromBytesMap[mtx1Commands.getSpecialDay.id] = mtx1Commands.getSpecialDay.fromBytes;
fromBytesMap[mtx1Commands.getVersion.id] = mtx1Commands.getVersion.fromBytes;
fromBytesMap[mtx1Commands.prepareRatePlan.id] = mtx1Commands.prepareRatePlan.fromBytes;
fromBytesMap[mtx1Commands.resetPowerMaxDay.id] = mtx1Commands.resetPowerMaxDay.fromBytes;
fromBytesMap[mtx1Commands.resetPowerMaxMonth.id] = mtx1Commands.resetPowerMaxMonth.fromBytes;
fromBytesMap[mtx1Commands.runTariffPlan.id] = mtx1Commands.runTariffPlan.fromBytes;
fromBytesMap[mtx1Commands.setAccessKey.id] = mtx1Commands.setAccessKey.fromBytes;
fromBytesMap[mtx1Commands.setCorrectDateTime.id] = mtx1Commands.setCorrectDateTime.fromBytes;
fromBytesMap[mtx1Commands.setCorrectTime.id] = mtx1Commands.setCorrectTime.fromBytes;
fromBytesMap[mtx1Commands.setDateTime.id] = mtx1Commands.setDateTime.fromBytes;
fromBytesMap[mtx1Commands.setDayProfile.id] = mtx1Commands.setDayProfile.fromBytes;
fromBytesMap[mtx1Commands.setDisplayParam.id] = mtx1Commands.setDisplayParam.fromBytes;
fromBytesMap[mtx1Commands.setOpParams.id] = mtx1Commands.setOpParams.fromBytes;
fromBytesMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.fromBytes;
fromBytesMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.fromBytes;
fromBytesMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.fromBytes;
fromBytesMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.fromBytes;
fromBytesMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.fromBytes;
fromBytesMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.fromBytes;
fromBytesMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.fromBytes;

// commands different from MTX1
fromBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.fromBytes;
fromBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.fromBytes;
fromBytesMap[commands.getOpParams.id] = commands.getOpParams.fromBytes;


// commands identical to MTX1
nameMap[mtx1Commands.activateRatePlan.id] = mtx1Commands.activateRatePlan.name;
nameMap[mtx1Commands.getBuildVersion.id] = mtx1Commands.getBuildVersion.name;
nameMap[mtx1Commands.getCorrectTime.id] = mtx1Commands.getCorrectTime.name;
nameMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.name;
nameMap[mtx1Commands.getDayProfile.id] = mtx1Commands.getDayProfile.name;
nameMap[mtx1Commands.getDeviceId.id] = mtx1Commands.getDeviceId.name;
nameMap[mtx1Commands.getDeviceType.id] = mtx1Commands.getDeviceType.name;
nameMap[mtx1Commands.getEvents.id] = mtx1Commands.getEvents.name;
nameMap[mtx1Commands.getEventsCounters.id] = mtx1Commands.getEventsCounters.name;
nameMap[mtx1Commands.getEventStatus.id] = mtx1Commands.getEventStatus.name;
nameMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.name;
nameMap[mtx1Commands.getRatePlanInfo.id] = mtx1Commands.getRatePlanInfo.name;
nameMap[mtx1Commands.getSaldo.id] = mtx1Commands.getSaldo.name;
nameMap[mtx1Commands.getSaldoParameters.id] = mtx1Commands.getSaldoParameters.name;
nameMap[mtx1Commands.getSeasonProfile.id] = mtx1Commands.getSeasonProfile.name;
nameMap[mtx1Commands.getSpecialDay.id] = mtx1Commands.getSpecialDay.name;
nameMap[mtx1Commands.getVersion.id] = mtx1Commands.getVersion.name;
nameMap[mtx1Commands.prepareRatePlan.id] = mtx1Commands.prepareRatePlan.name;
nameMap[mtx1Commands.resetPowerMaxDay.id] = mtx1Commands.resetPowerMaxDay.name;
nameMap[mtx1Commands.resetPowerMaxMonth.id] = mtx1Commands.resetPowerMaxMonth.name;
nameMap[mtx1Commands.runTariffPlan.id] = mtx1Commands.runTariffPlan.name;
nameMap[mtx1Commands.setAccessKey.id] = mtx1Commands.setAccessKey.name;
nameMap[mtx1Commands.setCorrectDateTime.id] = mtx1Commands.setCorrectDateTime.name;
nameMap[mtx1Commands.setCorrectTime.id] = mtx1Commands.setCorrectTime.name;
nameMap[mtx1Commands.setDateTime.id] = mtx1Commands.setDateTime.name;
nameMap[mtx1Commands.setDayProfile.id] = mtx1Commands.setDayProfile.name;
nameMap[mtx1Commands.setDisplayParam.id] = mtx1Commands.setDisplayParam.name;
nameMap[mtx1Commands.setOpParams.id] = mtx1Commands.setOpParams.name;
nameMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.name;
nameMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.name;
nameMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.name;
nameMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.name;
nameMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.name;
nameMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.name;
nameMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.name;

// commands different from MTX1
nameMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.name;
nameMap[commands.getDisplayParam.id] = commands.getDisplayParam.name;
nameMap[commands.getOpParams.id] = commands.getOpParams.name;
