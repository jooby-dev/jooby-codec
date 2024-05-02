/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx/message/uplink';
 * import getBytesFromHex from 'jooby-codec/utils/getBytesFromHex.js';
 *
 * const aesKey = [...Array(16).keys()];
 *
 * const messageBytes = getBytesFromHex('0a 13 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7e c2 b5 88');
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
 *       {
 *         id: 112,
 *         name: 'getBuildVersion',
 *         headerSize: 2,
 *         bytes: [Array],
 *         parameters: [Object]
 *       }
 *     ],
 *     bytes: [
 *        10,  19, 155,  75, 247,  42,
 *       209, 229,  73, 165,   9,  80,
 *       154,  89, 126, 194, 181, 136
 *     ],
 *     lrc: { expected: 53, actual: 53 }
 * }
 *
 * const parsedFrame = message.fromFrame(frameBytes, {aesKey});
 *
 * console.log('parsed frame:', parsedFrame);
 * // output:
 * {
 *     type: 81,
 *     destination: 43690,
 *     source: 65535,
 *     messageId: 10,
 *     accessLevel: 3,
 *     commands: [
 *       {
 *         id: 112,
 *         name: 'getBuildVersion',
 *         headerSize: 2,
 *         bytes: [Array],
 *         parameters: [Object]
 *       }
 *     ],
 *     bytes: [
 *        10,  19, 155,  75, 247,  42,
 *       209, 229,  73, 165,   9,  80,
 *       154,  89, 126, 194, 181, 136
 *     ],
 *     lrc: { expected: 53, actual: 53 },
 *     crc: 8532
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
//export const toMessage = wrappers.getToMessage(toBytesMap);
export const fromFrame = wrappers.getFromFrame(fromBytes);
export const toFrame = wrappers.getToFrame;


// fill maps
// iteration should not be used
toBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.toBytes;
toBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.toBytes;
toBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.toBytes;
toBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.toBytes;
toBytesMap[commands.getDateTime.id] = commands.getDateTime.toBytes;
toBytesMap[commands.getDayProfile.id] = commands.getDayProfile.toBytes;
toBytesMap[commands.getDeviceId.id] = commands.getDeviceId.toBytes;
toBytesMap[commands.getDeviceType.id] = commands.getDeviceType.toBytes;
toBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.toBytes;
toBytesMap[commands.getEnergyCurrent.id] = commands.getEnergyCurrent.toBytes;
toBytesMap[commands.getEnergyDay.id] = commands.getEnergyDay.toBytes;
toBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.toBytes;
toBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.toBytes;
toBytesMap[commands.getHalfHours.id] = commands.getHalfHours.toBytes;
toBytesMap[commands.getOpParams.id] = commands.getOpParams.toBytes;
toBytesMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.toBytes;
toBytesMap[commands.getSaldo.id] = commands.getSaldo.toBytes;
toBytesMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.toBytes;
toBytesMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.toBytes;
toBytesMap[commands.getSpecialDay.id] = commands.getSpecialDay.toBytes;
toBytesMap[commands.getVersion.id] = commands.getVersion.toBytes;
toBytesMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.toBytes;
toBytesMap[commands.runTariffPlan.id] = commands.runTariffPlan.toBytes;
toBytesMap[commands.setAccessKey.id] = commands.setAccessKey.toBytes;
toBytesMap[commands.setDateTime.id] = commands.setDateTime.toBytes;
toBytesMap[commands.setDayProfile.id] = commands.setDayProfile.toBytes;
toBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.toBytes;
toBytesMap[commands.setOpParams.id] = commands.setOpParams.toBytes;
toBytesMap[commands.setSaldo.id] = commands.setSaldo.toBytes;
toBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.toBytes;
toBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.toBytes;
toBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.toBytes;
toBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.toBytes;
toBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.fromBytes;
fromBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.fromBytes;
fromBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.fromBytes;
fromBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.fromBytes;
fromBytesMap[commands.getDateTime.id] = commands.getDateTime.fromBytes;
fromBytesMap[commands.getDayProfile.id] = commands.getDayProfile.fromBytes;
fromBytesMap[commands.getDeviceId.id] = commands.getDeviceId.fromBytes;
fromBytesMap[commands.getDeviceType.id] = commands.getDeviceType.fromBytes;
fromBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.fromBytes;
fromBytesMap[commands.getEnergyCurrent.id] = commands.getEnergyCurrent.fromBytes;
fromBytesMap[commands.getEnergyDay.id] = commands.getEnergyDay.fromBytes;
fromBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.fromBytes;
fromBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.fromBytes;
fromBytesMap[commands.getHalfHours.id] = commands.getHalfHours.fromBytes;
fromBytesMap[commands.getOpParams.id] = commands.getOpParams.fromBytes;
fromBytesMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.fromBytes;
fromBytesMap[commands.getSaldo.id] = commands.getSaldo.fromBytes;
fromBytesMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.fromBytes;
fromBytesMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.fromBytes;
fromBytesMap[commands.getSpecialDay.id] = commands.getSpecialDay.fromBytes;
fromBytesMap[commands.getVersion.id] = commands.getVersion.fromBytes;
fromBytesMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.fromBytes;
fromBytesMap[commands.runTariffPlan.id] = commands.runTariffPlan.fromBytes;
fromBytesMap[commands.setAccessKey.id] = commands.setAccessKey.fromBytes;
fromBytesMap[commands.setDateTime.id] = commands.setDateTime.fromBytes;
fromBytesMap[commands.setDayProfile.id] = commands.setDayProfile.fromBytes;
fromBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.fromBytes;
fromBytesMap[commands.setOpParams.id] = commands.setOpParams.fromBytes;
fromBytesMap[commands.setSaldo.id] = commands.setSaldo.fromBytes;
fromBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.fromBytes;
fromBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.fromBytes;
fromBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.fromBytes;
fromBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.fromBytes;
fromBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.fromBytes;


nameMap[commands.activateRatePlan.id] = commands.activateRatePlan.name;
nameMap[commands.getBuildVersion.id] = commands.getBuildVersion.name;
nameMap[commands.getCorrectTime.id] = commands.getCorrectTime.name;
nameMap[commands.getCurrentValues.id] = commands.getCurrentValues.name;
nameMap[commands.getDateTime.id] = commands.getDateTime.name;
nameMap[commands.getDayProfile.id] = commands.getDayProfile.name;
nameMap[commands.getDeviceId.id] = commands.getDeviceId.name;
nameMap[commands.getDeviceType.id] = commands.getDeviceType.name;
nameMap[commands.getDisplayParam.id] = commands.getDisplayParam.name;
nameMap[commands.getEnergyCurrent.id] = commands.getEnergyCurrent.name;
nameMap[commands.getEnergyDay.id] = commands.getEnergyDay.name;
nameMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.name;
nameMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.name;
nameMap[commands.getHalfHours.id] = commands.getHalfHours.name;
nameMap[commands.getOpParams.id] = commands.getOpParams.name;
nameMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.name;
nameMap[commands.getSaldo.id] = commands.getSaldo.name;
nameMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.name;
nameMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.name;
nameMap[commands.getSpecialDay.id] = commands.getSpecialDay.name;
nameMap[commands.getVersion.id] = commands.getVersion.name;
nameMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.name;
nameMap[commands.runTariffPlan.id] = commands.runTariffPlan.name;
nameMap[commands.setAccessKey.id] = commands.setAccessKey.name;
nameMap[commands.setDateTime.id] = commands.setDateTime.name;
nameMap[commands.setDayProfile.id] = commands.setDayProfile.name;
nameMap[commands.setDisplayParam.id] = commands.setDisplayParam.name;
nameMap[commands.setOpParams.id] = commands.setOpParams.name;
nameMap[commands.setSaldo.id] = commands.setSaldo.name;
nameMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.name;
nameMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.name;
nameMap[commands.setSpecialDay.id] = commands.setSpecialDay.name;
nameMap[commands.turnRelayOff.id] = commands.turnRelayOff.name;
nameMap[commands.turnRelayOn.id] = commands.turnRelayOn.name;
