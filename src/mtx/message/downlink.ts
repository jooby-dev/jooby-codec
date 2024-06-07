/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx/message/downlink';
 * import * as frame from 'jooby-codec/mtx/utils/frame.js';
 * import * as downlinkCommands from 'jooby-codec/mtx/commands/downlink';
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

import * as commands from '../commands/downlink/index.js';
import * as wrappers from './wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.toBytes;
toBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.toBytes;
toBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.toBytes;
toBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.toBytes;
toBytesMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.toBytes;
toBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.toBytes;
toBytesMap[commands.getDateTime.id] = commands.getDateTime.toBytes;
toBytesMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.toBytes;
toBytesMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.toBytes;
toBytesMap[commands.getDayMaxDemandPrevious.id] = commands.getDayMaxDemandPrevious.toBytes;
toBytesMap[commands.getDayProfile.id] = commands.getDayProfile.toBytes;
toBytesMap[commands.getDeviceId.id] = commands.getDeviceId.toBytes;
toBytesMap[commands.getDeviceType.id] = commands.getDeviceType.toBytes;
toBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.toBytes;
toBytesMap[commands.getEnergyCurrent.id] = commands.getEnergyCurrent.toBytes;
toBytesMap[commands.getEnergyDay.id] = commands.getEnergyDay.toBytes;
toBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.toBytes;
toBytesMap[commands.getEvents.id] = commands.getEvents.toBytes;
toBytesMap[commands.getEventsCounters.id] = commands.getEventsCounters.toBytes;
toBytesMap[commands.getEventStatus.id] = commands.getEventStatus.toBytes;
toBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.toBytes;
toBytesMap[commands.getExtendedCurrentValues2.id] = commands.getExtendedCurrentValues2.toBytes;
toBytesMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.toBytes;
toBytesMap[commands.getHalfHourDemandPrevious.id] = commands.getHalfHourDemandPrevious.toBytes;
toBytesMap[commands.getHalfhoursEnergies.id] = commands.getHalfhoursEnergies.toBytes;
toBytesMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.toBytes;
toBytesMap[commands.getMeterInfo.id] = commands.getMeterInfo.toBytes;
toBytesMap[commands.getMonthDemand.id] = commands.getMonthDemand.toBytes;
toBytesMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.toBytes;
toBytesMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.toBytes;
toBytesMap[commands.getOperatorParametersExtended3.id] = commands.getOperatorParametersExtended3.toBytes;
toBytesMap[commands.getOpParams.id] = commands.getOpParams.toBytes;
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
toBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.toBytes;
toBytesMap[commands.setOperatorParametersExtended3.id] = commands.setOperatorParametersExtended3.toBytes;
toBytesMap[commands.setOpParams.id] = commands.setOpParams.toBytes;
toBytesMap[commands.setSaldo.id] = commands.setSaldo.toBytes;
toBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.toBytes;
toBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.toBytes;
toBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.toBytes;
toBytesMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.toBytes;
toBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.toBytes;
toBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.activateRatePlan.id] = commands.activateRatePlan.fromBytes;
fromBytesMap[commands.getBuildVersion.id] = commands.getBuildVersion.fromBytes;
fromBytesMap[commands.getCorrectTime.id] = commands.getCorrectTime.fromBytes;
fromBytesMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.fromBytes;
fromBytesMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.fromBytes;
fromBytesMap[commands.getCurrentValues.id] = commands.getCurrentValues.fromBytes;
fromBytesMap[commands.getDateTime.id] = commands.getDateTime.fromBytes;
fromBytesMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.fromBytes;
fromBytesMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.fromBytes;
fromBytesMap[commands.getDayMaxDemandPrevious.id] = commands.getDayMaxDemandPrevious.fromBytes;
fromBytesMap[commands.getDayProfile.id] = commands.getDayProfile.fromBytes;
fromBytesMap[commands.getDeviceId.id] = commands.getDeviceId.fromBytes;
fromBytesMap[commands.getDeviceType.id] = commands.getDeviceType.fromBytes;
fromBytesMap[commands.getDisplayParam.id] = commands.getDisplayParam.fromBytes;
fromBytesMap[commands.getEnergyCurrent.id] = commands.getEnergyCurrent.fromBytes;
fromBytesMap[commands.getEnergyDay.id] = commands.getEnergyDay.fromBytes;
fromBytesMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.fromBytes;
fromBytesMap[commands.getEvents.id] = commands.getEvents.fromBytes;
fromBytesMap[commands.getEventsCounters.id] = commands.getEventsCounters.fromBytes;
fromBytesMap[commands.getEventStatus.id] = commands.getEventStatus.fromBytes;
fromBytesMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.fromBytes;
fromBytesMap[commands.getExtendedCurrentValues2.id] = commands.getExtendedCurrentValues2.fromBytes;
fromBytesMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.fromBytes;
fromBytesMap[commands.getHalfHourDemandPrevious.id] = commands.getHalfHourDemandPrevious.fromBytes;
fromBytesMap[commands.getHalfhoursEnergies.id] = commands.getHalfhoursEnergies.fromBytes;
fromBytesMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.fromBytes;
fromBytesMap[commands.getMeterInfo.id] = commands.getMeterInfo.fromBytes;
fromBytesMap[commands.getMonthDemand.id] = commands.getMonthDemand.fromBytes;
fromBytesMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.fromBytes;
fromBytesMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.fromBytes;
fromBytesMap[commands.getOperatorParametersExtended3.id] = commands.getOperatorParametersExtended3.fromBytes;
fromBytesMap[commands.getOpParams.id] = commands.getOpParams.fromBytes;
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
fromBytesMap[commands.setDisplayParam.id] = commands.setDisplayParam.fromBytes;
fromBytesMap[commands.setOperatorParametersExtended3.id] = commands.setOperatorParametersExtended3.fromBytes;
fromBytesMap[commands.setOpParams.id] = commands.setOpParams.fromBytes;
fromBytesMap[commands.setSaldo.id] = commands.setSaldo.fromBytes;
fromBytesMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.fromBytes;
fromBytesMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.fromBytes;
fromBytesMap[commands.setSpecialDay.id] = commands.setSpecialDay.fromBytes;
fromBytesMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.fromBytes;
fromBytesMap[commands.turnRelayOff.id] = commands.turnRelayOff.fromBytes;
fromBytesMap[commands.turnRelayOn.id] = commands.turnRelayOn.fromBytes;


nameMap[commands.activateRatePlan.id] = commands.activateRatePlan.name;
nameMap[commands.getBuildVersion.id] = commands.getBuildVersion.name;
nameMap[commands.getCorrectTime.id] = commands.getCorrectTime.name;
nameMap[commands.getCriticalEvent.id] = commands.getCriticalEvent.name;
nameMap[commands.getCurrentStatusMeter.id] = commands.getCurrentStatusMeter.name;
nameMap[commands.getCurrentValues.id] = commands.getCurrentValues.name;
nameMap[commands.getDateTime.id] = commands.getDateTime.name;
nameMap[commands.getDayMaxDemand.id] = commands.getDayMaxDemand.name;
nameMap[commands.getDayMaxDemandExport.id] = commands.getDayMaxDemandExport.name;
nameMap[commands.getDayMaxDemandPrevious.id] = commands.getDayMaxDemandPrevious.name;
nameMap[commands.getDayProfile.id] = commands.getDayProfile.name;
nameMap[commands.getDeviceId.id] = commands.getDeviceId.name;
nameMap[commands.getDeviceType.id] = commands.getDeviceType.name;
nameMap[commands.getDisplayParam.id] = commands.getDisplayParam.name;
nameMap[commands.getEnergyCurrent.id] = commands.getEnergyCurrent.name;
nameMap[commands.getEnergyDay.id] = commands.getEnergyDay.name;
nameMap[commands.getEnergyDayPrevious.id] = commands.getEnergyDayPrevious.name;
nameMap[commands.getEvents.id] = commands.getEvents.name;
nameMap[commands.getEventsCounters.id] = commands.getEventsCounters.name;
nameMap[commands.getEventStatus.id] = commands.getEventStatus.name;
nameMap[commands.getExtendedCurrentValues.id] = commands.getExtendedCurrentValues.name;
nameMap[commands.getExtendedCurrentValues2.id] = commands.getExtendedCurrentValues2.name;
nameMap[commands.getHalfHourDemand.id] = commands.getHalfHourDemand.name;
nameMap[commands.getHalfHourDemandPrevious.id] = commands.getHalfHourDemandPrevious.name;
nameMap[commands.getHalfhoursEnergies.id] = commands.getHalfhoursEnergies.name;
nameMap[commands.getMagneticFieldThreshold.id] = commands.getMagneticFieldThreshold.name;
nameMap[commands.getMeterInfo.id] = commands.getMeterInfo.name;
nameMap[commands.getMonthDemand.id] = commands.getMonthDemand.name;
nameMap[commands.getMonthMaxDemand.id] = commands.getMonthMaxDemand.name;
nameMap[commands.getMonthMaxDemandExport.id] = commands.getMonthMaxDemandExport.name;
nameMap[commands.getOperatorParametersExtended3.id] = commands.getOperatorParametersExtended3.name;
nameMap[commands.getOpParams.id] = commands.getOpParams.name;
nameMap[commands.getRatePlanInfo.id] = commands.getRatePlanInfo.name;
nameMap[commands.getSaldo.id] = commands.getSaldo.name;
nameMap[commands.getSaldoParameters.id] = commands.getSaldoParameters.name;
nameMap[commands.getSeasonProfile.id] = commands.getSeasonProfile.name;
nameMap[commands.getSpecialDay.id] = commands.getSpecialDay.name;
nameMap[commands.getVersion.id] = commands.getVersion.name;
nameMap[commands.prepareRatePlan.id] = commands.prepareRatePlan.name;
nameMap[commands.resetPowerMaxDay.id] = commands.resetPowerMaxDay.name;
nameMap[commands.resetPowerMaxMonth.id] = commands.resetPowerMaxMonth.name;
nameMap[commands.runTariffPlan.id] = commands.runTariffPlan.name;
nameMap[commands.setAccessKey.id] = commands.setAccessKey.name;
nameMap[commands.setCorrectDateTime.id] = commands.setCorrectDateTime.name;
nameMap[commands.setCorrectTime.id] = commands.setCorrectTime.name;
nameMap[commands.setDateTime.id] = commands.setDateTime.name;
nameMap[commands.setDayProfile.id] = commands.setDayProfile.name;
nameMap[commands.setDisplayParam.id] = commands.setDisplayParam.name;
nameMap[commands.setOperatorParametersExtended3.id] = commands.setOperatorParametersExtended3.name;
nameMap[commands.setOpParams.id] = commands.setOpParams.name;
nameMap[commands.setSaldo.id] = commands.setSaldo.name;
nameMap[commands.setSaldoParameters.id] = commands.setSaldoParameters.name;
nameMap[commands.setSeasonProfile.id] = commands.setSeasonProfile.name;
nameMap[commands.setSpecialDay.id] = commands.setSpecialDay.name;
nameMap[commands.setSpecialOperation.id] = commands.setSpecialOperation.name;
nameMap[commands.turnRelayOff.id] = commands.turnRelayOff.name;
nameMap[commands.turnRelayOn.id] = commands.turnRelayOn.name;
