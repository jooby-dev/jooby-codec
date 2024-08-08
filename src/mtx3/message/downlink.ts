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
 *     lrc: {received: 119, calculated: 119}
 * }
 *
 * // decode message back from frame
 * const parsedFrame = frame.fromBytes(frameBytes);
 *
 * console.log('parsedFrame:', parsedFrame);
 * // output:
 * {
 *     bytes: [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
 *     crc: {calculated: 47969, received: 47969},
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
 *         lrc: {received: 119, calculated: 119}
 *     }
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as mtx1Commands from '../../mtx/commands/downlink/index.js';
import * as wrappers from '../../mtx/message/wrappers.js';
import * as commands from '../commands/downlink/index.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// commands identical to MTX1
toBytesMap[mtx1Commands.activateRatePlan.id] = mtx1Commands.activateRatePlan.toBytes;
toBytesMap[mtx1Commands.getBuildVersion.id] = mtx1Commands.getBuildVersion.toBytes;
toBytesMap[mtx1Commands.getCorrectTime.id] = mtx1Commands.getCorrectTime.toBytes;
toBytesMap[mtx1Commands.getCurrentStatusMeter.id] = mtx1Commands.getCurrentStatusMeter.toBytes;
toBytesMap[mtx1Commands.getCurrentValues.id] = mtx1Commands.getCurrentValues.toBytes;
toBytesMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.toBytes;
toBytesMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.toBytes;
toBytesMap[mtx1Commands.getDayMaxDemand.id] = mtx1Commands.getDayMaxDemand.toBytes;
toBytesMap[mtx1Commands.getDayMaxDemandExport.id] = mtx1Commands.getDayMaxDemandExport.toBytes;
toBytesMap[mtx1Commands.getDayProfile.id] = mtx1Commands.getDayProfile.toBytes;
toBytesMap[mtx1Commands.getDeviceId.id] = mtx1Commands.getDeviceId.toBytes;
toBytesMap[mtx1Commands.getDeviceType.id] = mtx1Commands.getDeviceType.toBytes;
toBytesMap[mtx1Commands.getEvents.id] = mtx1Commands.getEvents.toBytes;
toBytesMap[mtx1Commands.getEventsCounters.id] = mtx1Commands.getEventsCounters.toBytes;
toBytesMap[mtx1Commands.getEventStatus.id] = mtx1Commands.getEventStatus.toBytes;
toBytesMap[mtx1Commands.getExtendedCurrentValues.id] = mtx1Commands.getExtendedCurrentValues.toBytes;
toBytesMap[mtx1Commands.getHalfHourDemand.id] = mtx1Commands.getHalfHourDemand.toBytes;
toBytesMap[mtx1Commands.getHalfHourDemandExport.id] = mtx1Commands.getHalfHourDemandExport.toBytes;
toBytesMap[mtx1Commands.getHalfhoursEnergies.id] = mtx1Commands.getHalfhoursEnergies.toBytes;
toBytesMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.toBytes;
toBytesMap[mtx1Commands.getMeterInfo.id] = mtx1Commands.getMeterInfo.toBytes;
toBytesMap[mtx1Commands.getMonthDemand.id] = mtx1Commands.getMonthDemand.toBytes;
toBytesMap[mtx1Commands.getMonthDemandExport.id] = mtx1Commands.getMonthDemandExport.toBytes;
toBytesMap[mtx1Commands.getMonthMaxDemand.id] = mtx1Commands.getMonthMaxDemand.toBytes;
toBytesMap[mtx1Commands.getMonthMaxDemandExport.id] = mtx1Commands.getMonthMaxDemandExport.toBytes;
toBytesMap[mtx1Commands.getOperatorParameters.id] = mtx1Commands.getOperatorParameters.toBytes;
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
toBytesMap[mtx1Commands.setOperatorParametersExtended3.id] = mtx1Commands.setOperatorParametersExtended3.toBytes;
toBytesMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.toBytes;
toBytesMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.toBytes;
toBytesMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.toBytes;
toBytesMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.toBytes;
toBytesMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.toBytes;
toBytesMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.toBytes;
toBytesMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.toBytes;

// commands different from MTX1
toBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.toBytes;
toBytesMap[commands.getDayDemand.id] = commands.getDayDemand.toBytes;
toBytesMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.toBytes;
toBytesMap[commands.getDemand.id] = commands.getDemand.toBytes;
toBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.toBytes;
toBytesMap[commands.getEnergy.id] = commands.getEnergy.toBytes;
toBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.toBytes;
toBytesMap[commands.getEnergyExport.id] = commands.getEnergyExport.toBytes;
toBytesMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.toBytes;
toBytesMap[commands.getHalfHourDemandChannel.id] = commands.getHalfHourDemandChannel.toBytes;
toBytesMap[commands.getHalfHourDemandVare.id] = commands.getHalfHourDemandVare.toBytes;
toBytesMap[commands.getHalfHourDemandVareExport.id] = commands.getHalfHourDemandVareExport.toBytes;
toBytesMap[commands.getHalfHourDemandVari.id] = commands.getHalfHourDemandVari.toBytes;
toBytesMap[commands.getHalfHourDemandVariExport.id] = commands.getHalfHourDemandVariExport.toBytes;
toBytesMap[commands.getOperatorParametersExtended.id] = commands.getOperatorParametersExtended.toBytes;
toBytesMap[commands.getOperatorParametersExtended2.id] = commands.getOperatorParametersExtended2.toBytes;
toBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.toBytes;
toBytesMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.toBytes;
toBytesMap[commands.setOperatorParametersExtended.id] = commands.setOperatorParametersExtended.toBytes;
toBytesMap[commands.setOperatorParametersExtended2.id] = commands.setOperatorParametersExtended2.toBytes;
toBytesMap[commands.setOperatorParametersExtended4.id] = commands.setOperatorParametersExtended4.toBytes;


// commands identical to MTX1
fromBytesMap[mtx1Commands.activateRatePlan.id] = mtx1Commands.activateRatePlan.fromBytes;
fromBytesMap[mtx1Commands.getBuildVersion.id] = mtx1Commands.getBuildVersion.fromBytes;
fromBytesMap[mtx1Commands.getCorrectTime.id] = mtx1Commands.getCorrectTime.fromBytes;
fromBytesMap[mtx1Commands.getCurrentStatusMeter.id] = mtx1Commands.getCurrentStatusMeter.fromBytes;
fromBytesMap[mtx1Commands.getCurrentValues.id] = mtx1Commands.getCurrentValues.fromBytes;
fromBytesMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.fromBytes;
fromBytesMap[mtx1Commands.getDayMaxDemand.id] = mtx1Commands.getDayMaxDemand.fromBytes;
fromBytesMap[mtx1Commands.getDayMaxDemandExport.id] = mtx1Commands.getDayMaxDemandExport.fromBytes;
fromBytesMap[mtx1Commands.getDayProfile.id] = mtx1Commands.getDayProfile.fromBytes;
fromBytesMap[mtx1Commands.getDeviceId.id] = mtx1Commands.getDeviceId.fromBytes;
fromBytesMap[mtx1Commands.getDeviceType.id] = mtx1Commands.getDeviceType.fromBytes;
fromBytesMap[mtx1Commands.getEvents.id] = mtx1Commands.getEvents.fromBytes;
fromBytesMap[mtx1Commands.getEventsCounters.id] = mtx1Commands.getEventsCounters.fromBytes;
fromBytesMap[mtx1Commands.getEventStatus.id] = mtx1Commands.getEventStatus.fromBytes;
fromBytesMap[mtx1Commands.getExtendedCurrentValues.id] = mtx1Commands.getExtendedCurrentValues.fromBytes;
fromBytesMap[mtx1Commands.getHalfHourDemand.id] = mtx1Commands.getHalfHourDemand.fromBytes;
fromBytesMap[mtx1Commands.getHalfHourDemandExport.id] = mtx1Commands.getHalfHourDemandExport.fromBytes;
fromBytesMap[mtx1Commands.getHalfhoursEnergies.id] = mtx1Commands.getHalfhoursEnergies.fromBytes;
fromBytesMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[mtx1Commands.getMeterInfo.id] = mtx1Commands.getMeterInfo.fromBytes;
fromBytesMap[mtx1Commands.getMonthDemand.id] = mtx1Commands.getMonthDemand.fromBytes;
fromBytesMap[mtx1Commands.getMonthDemandExport.id] = mtx1Commands.getMonthDemandExport.fromBytes;
fromBytesMap[mtx1Commands.getMonthMaxDemand.id] = mtx1Commands.getMonthMaxDemand.fromBytes;
fromBytesMap[mtx1Commands.getMonthMaxDemandExport.id] = mtx1Commands.getMonthMaxDemandExport.fromBytes;
fromBytesMap[mtx1Commands.getOperatorParameters.id] = mtx1Commands.getOperatorParameters.fromBytes;
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
fromBytesMap[mtx1Commands.setOperatorParametersExtended3.id] = mtx1Commands.setOperatorParametersExtended3.fromBytes;
fromBytesMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.fromBytes;
fromBytesMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.fromBytes;
fromBytesMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.fromBytes;
fromBytesMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.fromBytes;
fromBytesMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.fromBytes;
fromBytesMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.fromBytes;
fromBytesMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.fromBytes;

// commands different from MTX1
fromBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.fromBytes;
fromBytesMap[commands.getDayDemand.id] = commands.getDayDemand.fromBytes;
fromBytesMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.fromBytes;
fromBytesMap[commands.getDemand.id] = commands.getDemand.fromBytes;
fromBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.fromBytes;
fromBytesMap[commands.getEnergy.id] = commands.getEnergy.fromBytes;
fromBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.fromBytes;
fromBytesMap[commands.getEnergyExport.id] = commands.getEnergyExport.fromBytes;
fromBytesMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.fromBytes;
fromBytesMap[commands.getHalfHourDemandChannel.id] = commands.getHalfHourDemandChannel.fromBytes;
fromBytesMap[commands.getHalfHourDemandVare.id] = commands.getHalfHourDemandVare.fromBytes;
fromBytesMap[commands.getHalfHourDemandVareExport.id] = commands.getHalfHourDemandVareExport.fromBytes;
fromBytesMap[commands.getHalfHourDemandVari.id] = commands.getHalfHourDemandVari.fromBytes;
fromBytesMap[commands.getHalfHourDemandVariExport.id] = commands.getHalfHourDemandVariExport.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended.id] = commands.getOperatorParametersExtended.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended2.id] = commands.getOperatorParametersExtended2.fromBytes;
fromBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.fromBytes;
fromBytesMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended.id] = commands.setOperatorParametersExtended.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended2.id] = commands.setOperatorParametersExtended2.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended4.id] = commands.setOperatorParametersExtended4.fromBytes;


// commands identical to MTX1
nameMap[mtx1Commands.activateRatePlan.id] = mtx1Commands.activateRatePlan.name;
nameMap[mtx1Commands.getBuildVersion.id] = mtx1Commands.getBuildVersion.name;
nameMap[mtx1Commands.getCorrectTime.id] = mtx1Commands.getCorrectTime.name;
nameMap[mtx1Commands.getCurrentStatusMeter.id] = mtx1Commands.getCurrentStatusMeter.name;
nameMap[mtx1Commands.getCurrentValues.id] = mtx1Commands.getCurrentValues.name;
nameMap[mtx1Commands.getDateTime.id] = mtx1Commands.getDateTime.name;
nameMap[mtx1Commands.getDayMaxDemand.id] = mtx1Commands.getDayMaxDemand.name;
nameMap[mtx1Commands.getDayMaxDemandExport.id] = mtx1Commands.getDayMaxDemandExport.name;
nameMap[mtx1Commands.getDayProfile.id] = mtx1Commands.getDayProfile.name;
nameMap[mtx1Commands.getDeviceId.id] = mtx1Commands.getDeviceId.name;
nameMap[mtx1Commands.getDeviceType.id] = mtx1Commands.getDeviceType.name;
nameMap[mtx1Commands.getEvents.id] = mtx1Commands.getEvents.name;
nameMap[mtx1Commands.getEventsCounters.id] = mtx1Commands.getEventsCounters.name;
nameMap[mtx1Commands.getEventStatus.id] = mtx1Commands.getEventStatus.name;
nameMap[mtx1Commands.getExtendedCurrentValues.id] = mtx1Commands.getExtendedCurrentValues.name;
nameMap[mtx1Commands.getHalfHourDemand.id] = mtx1Commands.getHalfHourDemand.name;
nameMap[mtx1Commands.getHalfHourDemandExport.id] = mtx1Commands.getHalfHourDemandExport.name;
nameMap[mtx1Commands.getHalfhoursEnergies.id] = mtx1Commands.getHalfhoursEnergies.name;
nameMap[mtx1Commands.getMagneticFieldThreshold.id] = mtx1Commands.getMagneticFieldThreshold.name;
nameMap[mtx1Commands.getMeterInfo.id] = mtx1Commands.getMeterInfo.name;
nameMap[mtx1Commands.getMonthDemand.id] = mtx1Commands.getMonthDemand.name;
nameMap[mtx1Commands.getMonthDemandExport.id] = mtx1Commands.getMonthDemandExport.name;
nameMap[mtx1Commands.getMonthMaxDemand.id] = mtx1Commands.getMonthMaxDemand.name;
nameMap[mtx1Commands.getMonthMaxDemandExport.id] = mtx1Commands.getMonthMaxDemandExport.name;
nameMap[mtx1Commands.getOperatorParameters.id] = mtx1Commands.getOperatorParameters.name;
nameMap[mtx1Commands.getOperatorParametersExtended3.id] = mtx1Commands.getOperatorParametersExtended3.name;
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
nameMap[mtx1Commands.setOperatorParametersExtended3.id] = mtx1Commands.setOperatorParametersExtended3.name;
nameMap[mtx1Commands.setSaldo.id] = mtx1Commands.setSaldo.name;
nameMap[mtx1Commands.setSaldoParameters.id] = mtx1Commands.setSaldoParameters.name;
nameMap[mtx1Commands.setSeasonProfile.id] = mtx1Commands.setSeasonProfile.name;
nameMap[mtx1Commands.setSpecialDay.id] = mtx1Commands.setSpecialDay.name;
nameMap[mtx1Commands.setSpecialOperation.id] = mtx1Commands.setSpecialOperation.name;
nameMap[mtx1Commands.turnRelayOff.id] = mtx1Commands.turnRelayOff.name;
nameMap[mtx1Commands.turnRelayOn.id] = mtx1Commands.turnRelayOn.name;

// commands different from MTX1
nameMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.name;
nameMap[commands.getDayDemand.id] = commands.getDayDemand.name;
nameMap[commands.getDayDemandExport.id] = commands.getDayDemandExport.name;
nameMap[commands.getDemand.id] = commands.getDemand.name;
nameMap[commands.getDisplayParam.id] = commands.getDisplayParam.name;
nameMap[commands.getEnergy.id] = commands.getEnergy.name;
nameMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.name;
nameMap[commands.getEnergyExport.id] = commands.getEnergyExport.name;
nameMap[commands.getEnergyExportDayPrevious.id] = commands.getEnergyExportDayPrevious.name;
nameMap[commands.getHalfHourDemandChannel.id] = commands.getHalfHourDemandChannel.name;
nameMap[commands.getHalfHourDemandVare.id] = commands.getHalfHourDemandVare.name;
nameMap[commands.getHalfHourDemandVareExport.id] = commands.getHalfHourDemandVareExport.name;
nameMap[commands.getHalfHourDemandVari.id] = commands.getHalfHourDemandVari.name;
nameMap[commands.getHalfHourDemandVariExport.id] = commands.getHalfHourDemandVariExport.name;
nameMap[commands.getOperatorParametersExtended.id] = commands.getOperatorParametersExtended.name;
nameMap[commands.getOperatorParametersExtended2.id] = commands.getOperatorParametersExtended2.name;
nameMap[commands.setDisplayParam.id] = commands.setDisplayParam.name;
nameMap[commands.setOperatorParameters.id] = commands.setOperatorParameters.name;
nameMap[commands.setOperatorParametersExtended.id] = commands.setOperatorParametersExtended.name;
nameMap[commands.setOperatorParametersExtended2.id] = commands.setOperatorParametersExtended2.name;
nameMap[commands.setOperatorParametersExtended4.id] = commands.setOperatorParametersExtended4.name;
