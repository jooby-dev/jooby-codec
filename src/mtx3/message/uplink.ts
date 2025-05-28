/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx3/message/uplink';
 * import * as frame from 'jooby-codec/mtx1/utils/frame.js';
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
 *     lrc: {received: 53, calculated: 53}
 * }
 *
 * const parsedFrame = frame.fromBytes(frameBytes);
 *
 * console.log('parsed frame:', parsedFrame);
 * // output:
 * {
 *     bytes: [10,19,155,75,247,42,209,229,73,165,9,80,154,89,126,194,181,136],
 *     crc: {calculated: 21537, received: 21537},
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

import * as mtx1Commands from '../../mtx1/commands/uplink/index.js';
import * as wrappers from '../../mtx1/message/wrappers.js';
import * as commands from '../commands/uplink/index.js';
import uplinkNames from '../constants/uplinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = uplinkNames;

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
toBytesMap[mtx1Commands.getHalfhoursEnergies.id] = mtx1Commands.getHalfhoursEnergies.toBytes;
toBytesMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.toBytes;
toBytesMap[mtx1Commands.getMeterInfo.id] = mtx1Commands.getMeterInfo.toBytes;
toBytesMap[mtx1Commands.getOperatorParametersExtended3.id] = mtx1Commands.getOperatorParametersExtended3.toBytes;
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
toBytesMap[mtx1Commands.setOperatorParameters.id] = mtx1Commands.setOperatorParameters.toBytes;
toBytesMap[mtx1Commands.setOperatorParametersExtended3.id] = mtx1Commands.setOperatorParametersExtended3.toBytes;
toBytesMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.toBytes;
toBytesMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.toBytes;
toBytesMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.toBytes;
toBytesMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.toBytes;
toBytesMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.toBytes;
toBytesMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.toBytes;
toBytesMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.toBytes;

// commands different from MTX1
toBytesMap[commands.errorResponse.id] = commands.errorResponse.toBytes;
toBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.toBytes;
toBytesMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.toBytes;
toBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.toBytes;
toBytesMap[commands.getDayDemand.id] = commands.getDayDemand.toBytes;
toBytesMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.toBytes;
toBytesMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.toBytes;
toBytesMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.toBytes;
toBytesMap[commands.getDemand.id] = commands.getDemand.toBytes;
toBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.toBytes;
toBytesMap[commands.getEnergy.id] = commands.getEnergy.toBytes;
toBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.toBytes;
toBytesMap[commands.getEnergyExport.id] = commands.getEnergyExport.toBytes;
toBytesMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.toBytes;
toBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.toBytes;
toBytesMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.toBytes;
toBytesMap[commands.getHalfHourDemandChannel.id] = commands.getHalfHourDemandChannel.toBytes;
toBytesMap[commands.getHalfHourDemandExport.id] = commands.getHalfHourDemandExport.toBytes;
toBytesMap[commands.getHalfHourDemandVare.id] = commands.getHalfHourDemandVare.toBytes;
toBytesMap[commands.getHalfHourDemandVareExport.id] = commands.getHalfHourDemandVareExport.toBytes;
toBytesMap[commands.getHalfHourDemandVari.id] = commands.getHalfHourDemandVari.toBytes;
toBytesMap[commands.getHalfHourDemandVariExport.id] = commands.getHalfHourDemandVariExport.toBytes;
toBytesMap[commands.getMonthDemand.id] = commands.getMonthDemand.toBytes;
toBytesMap[commands.getMonthDemandExport.id] = commands.getMonthDemandExport.toBytes;
toBytesMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.toBytes;
toBytesMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.toBytes;
toBytesMap[commands.getOperatorParameters.id] = commands.getOperatorParameters.toBytes;
toBytesMap[commands.getOperatorParametersExtended.id] = commands.getOperatorParametersExtended.toBytes;
toBytesMap[commands.getOperatorParametersExtended2.id] = commands.getOperatorParametersExtended2.toBytes;
toBytesMap[commands.getOperatorParametersExtended4.id] = commands.getOperatorParametersExtended4.toBytes;
toBytesMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.toBytes;
toBytesMap[commands.setOperatorParametersExtended.id] = commands.setOperatorParametersExtended.toBytes;
toBytesMap[commands.setOperatorParametersExtended2.id] = commands.setOperatorParametersExtended2.toBytes;
toBytesMap[commands.setOperatorParametersExtended4.id] = commands.setOperatorParametersExtended4.toBytes;


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
fromBytesMap[mtx1Commands.getHalfhoursEnergies.id] = mtx1Commands.getHalfhoursEnergies.fromBytes;
fromBytesMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[mtx1Commands.getMeterInfo.id] = mtx1Commands.getMeterInfo.fromBytes;
fromBytesMap[mtx1Commands.getOperatorParametersExtended3.id] = mtx1Commands.getOperatorParametersExtended3.fromBytes;
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
fromBytesMap[mtx1Commands.setOperatorParameters.id] = mtx1Commands.setOperatorParameters.fromBytes;
fromBytesMap[mtx1Commands.setOperatorParametersExtended3.id] = mtx1Commands.setOperatorParametersExtended3.fromBytes;
fromBytesMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.fromBytes;
fromBytesMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.fromBytes;
fromBytesMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.fromBytes;
fromBytesMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.fromBytes;
fromBytesMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.fromBytes;
fromBytesMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.fromBytes;
fromBytesMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.fromBytes;

// commands different from MTX1
fromBytesMap[commands.errorResponse.id] = commands.errorResponse.fromBytes;
fromBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.fromBytes;
fromBytesMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.fromBytes;
fromBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.fromBytes;
fromBytesMap[commands.getDayDemand.id] = commands.getDayDemand.fromBytes;
fromBytesMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.fromBytes;
fromBytesMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.fromBytes;
fromBytesMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.fromBytes;
fromBytesMap[commands.getDemand.id] = commands.getDemand.fromBytes;
fromBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.fromBytes;
fromBytesMap[commands.getEnergy.id] = commands.getEnergy.fromBytes;
fromBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.fromBytes;
fromBytesMap[commands.getEnergyExport.id] = commands.getEnergyExport.fromBytes;
fromBytesMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.fromBytes;
fromBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.fromBytes;
fromBytesMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.fromBytes;
fromBytesMap[commands.getHalfHourDemandChannel.id] = commands.getHalfHourDemandChannel.fromBytes;
fromBytesMap[commands.getHalfHourDemandExport.id] = commands.getHalfHourDemandExport.fromBytes;
fromBytesMap[commands.getHalfHourDemandVare.id] = commands.getHalfHourDemandVare.fromBytes;
fromBytesMap[commands.getHalfHourDemandVareExport.id] = commands.getHalfHourDemandVareExport.fromBytes;
fromBytesMap[commands.getHalfHourDemandVari.id] = commands.getHalfHourDemandVari.fromBytes;
fromBytesMap[commands.getHalfHourDemandVariExport.id] = commands.getHalfHourDemandVariExport.fromBytes;
fromBytesMap[commands.getMonthDemand.id] = commands.getMonthDemand.fromBytes;
fromBytesMap[commands.getMonthDemandExport.id] = commands.getMonthDemandExport.fromBytes;
fromBytesMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.fromBytes;
fromBytesMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.fromBytes;
fromBytesMap[commands.getOperatorParameters.id] = commands.getOperatorParameters.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended.id] = commands.getOperatorParametersExtended.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended2.id] = commands.getOperatorParametersExtended2.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended4.id] = commands.getOperatorParametersExtended4.fromBytes;
fromBytesMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended.id] = commands.setOperatorParametersExtended.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended2.id] = commands.setOperatorParametersExtended2.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended4.id] = commands.setOperatorParametersExtended4.fromBytes;
