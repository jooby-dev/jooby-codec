/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx1/message/uplink';
 * import * as frame from 'jooby-codec/mtx1/utils/frame.js';
 * import getBytesFromHex from 'jooby-codec/utils/getBytesFromHex.js';
 *
 * const aesKey = [...Array(16).keys()];
 *
 * // a message with one getDeviceId command
 * const messageBytes = getBytesFromHex('0d13cf5fa5a836724fc97a0735f817d49651');
 * // the same message as a frame
 * const frameBytes = getBytesFromHex('7e51fffffffe0d7d33cf5fa5a836724fc97a0735f817d4965178de7e');
 *
 * const parsedMessage = message.fromBytes(messageBytes, {aesKey});
 *
 * console.log('parsed message:', parsedMessage);
 * // output:
 * {
 *   messageId: 10,
 *   accessLevel: 0,
 *   commands: [
 *     {
 *       id: 5,
 *       name: 'getDeviceId',
 *       headerSize: 2,
 *       bytes: [Array],
 *       parameters: [Object]
 *     }
 *   ],
 *   bytes: [
 *      10,  16, 16,  5,  8,  0,
 *      26, 121, 23, 20, 27, 29,
 *     106,   0, 68
 *   ],
 *   lrc: { received: 68, calculated: 68 }
 * }
 *
 * const parsedFrame = frame.fromBytes(frameBytes);
 *
 * console.log('parsed frame:', parsedFrame);
 * // output:
 * {
 *   bytes: [
 *     126, 81, 255, 255, 255, 254,  11,
 *      16, 16,   5,   8,   0,  26, 121,
 *      23, 20,  27,  29, 106,   0,  68,
 *     151, 22, 126
 *   ],
 *   payload: [
 *      11,  16, 16,  5,  8,  0,
 *      26, 121, 23, 20, 27, 29,
 *     106,   0, 68
 *   ],
 *   crc: { calculated: 5783, received: 5783 },
 *   header: {
 *     type: 81,
 *     typeName: 'DATA_RESPONSE',
 *     destination: 65535,
 *     source: 65534
 *   }
 * }
 *
 * // parsed successfully
 * if ( 'bytes' in parsedFrame ) {
 *     const parsedMessage2 = message.fromBytes(parsedFrame.payload, {aesKey});
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

import * as commands from '../commands/uplink/index.js';
import * as wrappers from './wrappers.js';
import uplinkNames from '../constants/uplinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = uplinkNames;

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.toBytes;
toBytesMap[commands.errorResponse.id] = commands.errorResponse.toBytes;
toBytesMap[commands.getBv.id] = commands.getBv.toBytes;
toBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.toBytes;
toBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.toBytes;
toBytesMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.toBytes;
toBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.toBytes;
toBytesMap[commands.getDateTime.id] = commands.getDateTime.toBytes;
toBytesMap[commands.getDayDemand.id] = commands.getDayDemand.toBytes;
toBytesMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.toBytes;
toBytesMap[commands.getDayEnergies.id] = commands.getDayEnergies.toBytes;
toBytesMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.toBytes;
toBytesMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.toBytes;
toBytesMap[commands.getDayMaxDemandPrevious.id] = commands.getDayMaxDemandPrevious.toBytes;
toBytesMap[commands.getDayMaxPower.id] = commands.getDayMaxPower.toBytes;
toBytesMap[commands.getDayProfile.id] = commands.getDayProfile.toBytes;
toBytesMap[commands.getDemand.id] = commands.getDemand.toBytes;
toBytesMap[commands.getDemandParameters.id] = commands.getDemandParameters.toBytes;
toBytesMap[commands.getDeviceId.id] = commands.getDeviceId.toBytes;
toBytesMap[commands.getDeviceType.id] = commands.getDeviceType.toBytes;
toBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.toBytes;
toBytesMap[commands.getEnergy.id] = commands.getEnergy.toBytes;
toBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.toBytes;
toBytesMap[commands.getEnergyExport.id] = commands.getEnergyExport.toBytes;
toBytesMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.toBytes;
toBytesMap[commands.getEvents.id] = commands.getEvents.toBytes;
toBytesMap[commands.getEventsCounters.id] = commands.getEventsCounters.toBytes;
toBytesMap[commands.getEventStatus.id] = commands.getEventStatus.toBytes;
toBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.toBytes;
toBytesMap[commands.getExtendedCurrentValues2.id] = commands.getExtendedCurrentValues2.toBytes;
toBytesMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.toBytes;
toBytesMap[commands.getHalfHourDemandExport.id] = commands.getHalfHourDemandExport.toBytes;
toBytesMap[commands.getHalfHourDemandPrevious.id] = commands.getHalfHourDemandPrevious.toBytes;
toBytesMap[commands.getHalfHourEnergies.id] = commands.getHalfHourEnergies.toBytes;
toBytesMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.toBytes;
toBytesMap[commands.getMeterInfo.id] = commands.getMeterInfo.toBytes;
toBytesMap[commands.getMonthDemand.id] = commands.getMonthDemand.toBytes;
toBytesMap[commands.getMonthDemandExport.id] = commands.getMonthDemandExport.toBytes;
toBytesMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.toBytes;
toBytesMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.toBytes;
toBytesMap[commands.getOperatorParameters.id] = commands.getOperatorParameters.toBytes;
toBytesMap[commands.getOperatorParametersExtended3.id] = commands.getOperatorParametersExtended3.toBytes;
toBytesMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.toBytes;
toBytesMap[commands.getSaldo.id] = commands.getSaldo.toBytes;
toBytesMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.toBytes;
toBytesMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.toBytes;
toBytesMap[commands.getSpecialDay.id] = commands.getSpecialDay.toBytes;
toBytesMap[commands.getVersion.id] = commands.getVersion.toBytes;
toBytesMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.toBytes;
toBytesMap[commands.resetPowerMaxDay.id] = commands.resetPowerMaxDay.toBytes;
toBytesMap[commands.resetPowerMaxMonth.id] = commands.resetPowerMaxMonth.toBytes;
toBytesMap[commands.runTariffPlan.id] = commands.runTariffPlan.toBytes;
toBytesMap[commands.setAccessKey.id] = commands.setAccessKey.toBytes;
toBytesMap[commands.setCorrectDateTime.id] = commands.setCorrectDateTime.toBytes;
toBytesMap[commands.setCorrectTime.id] = commands.setCorrectTime.toBytes;
toBytesMap[commands.setDateTime.id] = commands.setDateTime.toBytes;
toBytesMap[commands.setDayProfile.id] = commands.setDayProfile.toBytes;
toBytesMap[commands.setDemandParameters.id] = commands.setDemandParameters.toBytes;
toBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.toBytes;
toBytesMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.toBytes;
toBytesMap[commands.setOperatorParametersExtended3.id] = commands.setOperatorParametersExtended3.toBytes;
toBytesMap[commands.setSaldo.id] = commands.setSaldo.toBytes;
toBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.toBytes;
toBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.toBytes;
toBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.toBytes;
toBytesMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.toBytes;
toBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.toBytes;
toBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.fromBytes;
fromBytesMap[commands.errorResponse.id] = commands.errorResponse.fromBytes;
fromBytesMap[commands.getBv.id] = commands.getBv.fromBytes;
fromBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.fromBytes;
fromBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.fromBytes;
fromBytesMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.fromBytes;
fromBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.fromBytes;
fromBytesMap[commands.getDateTime.id] = commands.getDateTime.fromBytes;
fromBytesMap[commands.getDayDemand.id] = commands.getDayDemand.fromBytes;
fromBytesMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.fromBytes;
fromBytesMap[commands.getDayEnergies.id] = commands.getDayEnergies.fromBytes;
fromBytesMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.fromBytes;
fromBytesMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.fromBytes;
fromBytesMap[commands.getDayMaxDemandPrevious.id] = commands.getDayMaxDemandPrevious.fromBytes;
fromBytesMap[commands.getDayMaxPower.id] = commands.getDayMaxPower.fromBytes;
fromBytesMap[commands.getDayProfile.id] = commands.getDayProfile.fromBytes;
fromBytesMap[commands.getDemand.id] = commands.getDemand.fromBytes;
fromBytesMap[commands.getDemandParameters.id] = commands.getDemandParameters.fromBytes;
fromBytesMap[commands.getDeviceId.id] = commands.getDeviceId.fromBytes;
fromBytesMap[commands.getDeviceType.id] = commands.getDeviceType.fromBytes;
fromBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.fromBytes;
fromBytesMap[commands.getEnergy.id] = commands.getEnergy.fromBytes;
fromBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.fromBytes;
fromBytesMap[commands.getEnergyExport.id] = commands.getEnergyExport.fromBytes;
fromBytesMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.fromBytes;
fromBytesMap[commands.getEvents.id] = commands.getEvents.fromBytes;
fromBytesMap[commands.getEventsCounters.id] = commands.getEventsCounters.fromBytes;
fromBytesMap[commands.getEventStatus.id] = commands.getEventStatus.fromBytes;
fromBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.fromBytes;
fromBytesMap[commands.getExtendedCurrentValues2.id] = commands.getExtendedCurrentValues2.fromBytes;
fromBytesMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.fromBytes;
fromBytesMap[commands.getHalfHourDemandExport.id] = commands.getHalfHourDemandExport.fromBytes;
fromBytesMap[commands.getHalfHourDemandPrevious.id] = commands.getHalfHourDemandPrevious.fromBytes;
fromBytesMap[commands.getHalfHourEnergies.id] = commands.getHalfHourEnergies.fromBytes;
fromBytesMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[commands.getMeterInfo.id] = commands.getMeterInfo.fromBytes;
fromBytesMap[commands.getMonthDemand.id] = commands.getMonthDemand.fromBytes;
fromBytesMap[commands.getMonthDemandExport.id] = commands.getMonthDemandExport.fromBytes;
fromBytesMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.fromBytes;
fromBytesMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.fromBytes;
fromBytesMap[commands.getOperatorParameters.id] = commands.getOperatorParameters.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended3.id] = commands.getOperatorParametersExtended3.fromBytes;
fromBytesMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.fromBytes;
fromBytesMap[commands.getSaldo.id] = commands.getSaldo.fromBytes;
fromBytesMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.fromBytes;
fromBytesMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.fromBytes;
fromBytesMap[commands.getSpecialDay.id] = commands.getSpecialDay.fromBytes;
fromBytesMap[commands.getVersion.id] = commands.getVersion.fromBytes;
fromBytesMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.fromBytes;
fromBytesMap[commands.resetPowerMaxDay.id] = commands.resetPowerMaxDay.fromBytes;
fromBytesMap[commands.resetPowerMaxMonth.id] = commands.resetPowerMaxMonth.fromBytes;
fromBytesMap[commands.runTariffPlan.id] = commands.runTariffPlan.fromBytes;
fromBytesMap[commands.setAccessKey.id] = commands.setAccessKey.fromBytes;
fromBytesMap[commands.setCorrectDateTime.id] = commands.setCorrectDateTime.fromBytes;
fromBytesMap[commands.setCorrectTime.id] = commands.setCorrectTime.fromBytes;
fromBytesMap[commands.setDateTime.id] = commands.setDateTime.fromBytes;
fromBytesMap[commands.setDayProfile.id] = commands.setDayProfile.fromBytes;
fromBytesMap[commands.setDemandParameters.id] = commands.setDemandParameters.fromBytes;
fromBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.fromBytes;
fromBytesMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended3.id] = commands.setOperatorParametersExtended3.fromBytes;
fromBytesMap[commands.setSaldo.id] = commands.setSaldo.fromBytes;
fromBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.fromBytes;
fromBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.fromBytes;
fromBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.fromBytes;
fromBytesMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.fromBytes;
fromBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.fromBytes;
fromBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.fromBytes;
