/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/obis-observer/message/downlink';
 * import * as downlinkCommands from 'jooby-codec/obis-observer/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.getMeterProfile.id,
 *         parameters: {requestId: 3, meterProfileId: 4}
 *     }
 * ];
 * const bytes = message.toBytes(commands);
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // output:
 * [102,2,3,4]
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // output:
 * '66 02 03 04'
 *
 * // decode message back from bytes
 * const parsedMessage = message.fromBytes(bytes);
 *
 * console.log('parsedMessage:', parsedMessage);
 * // output:
 * {
 *     commands: [
 *         {
 *             id: 102,
 *             name: 'getMeterProfile',
 *             headerSize: 2,
 *             bytes: [Array],
 *             parameters: [Object]
 *         }
 *     ],
 *     bytes: [102, 2, 3, 4]
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
toBytesMap[commands.getArchiveState.id] = commands.getArchiveState.toBytes;
toBytesMap[commands.getLorawanInfo.id] = commands.getLorawanInfo.toBytes;
toBytesMap[commands.getLorawanState.id] = commands.getLorawanState.toBytes;
toBytesMap[commands.getMeterDate.id] = commands.getMeterDate.toBytes;
toBytesMap[commands.getMeterId.id] = commands.getMeterId.toBytes;
toBytesMap[commands.getMeterIdList.id] = commands.getMeterIdList.toBytes;
toBytesMap[commands.getMeterInfo.id] = commands.getMeterInfo.toBytes;
toBytesMap[commands.getMeterProfile.id] = commands.getMeterProfile.toBytes;
toBytesMap[commands.getMeterProfileIdList.id] = commands.getMeterProfileIdList.toBytes;
toBytesMap[commands.getMeterReadoutState.id] = commands.getMeterReadoutState.toBytes;
toBytesMap[commands.getObisContent.id] = commands.getObisContent.toBytes;
toBytesMap[commands.getObisContentById.id] = commands.getObisContentById.toBytes;
toBytesMap[commands.getObisIdList.id] = commands.getObisIdList.toBytes;
toBytesMap[commands.getObisInfo.id] = commands.getObisInfo.toBytes;
toBytesMap[commands.getObserverCapabilities.id] = commands.getObserverCapabilities.toBytes;
toBytesMap[commands.getObserverInfo.id] = commands.getObserverInfo.toBytes;
toBytesMap[commands.getObserverSingleMode.id] = commands.getObserverSingleMode.toBytes;
toBytesMap[commands.getObserverUptime.id] = commands.getObserverUptime.toBytes;
toBytesMap[commands.getSerialPort.id] = commands.getSerialPort.toBytes;
toBytesMap[commands.getSettingsMemory.id] = commands.getSettingsMemory.toBytes;
toBytesMap[commands.readArchive.id] = commands.readArchive.toBytes;
toBytesMap[commands.readMeterArchive.id] = commands.readMeterArchive.toBytes;
toBytesMap[commands.readMeterArchiveWithDate.id] = commands.readMeterArchiveWithDate.toBytes;
toBytesMap[commands.reboot.id] = commands.reboot.toBytes;
toBytesMap[commands.removeMeter.id] = commands.removeMeter.toBytes;
toBytesMap[commands.removeMeterProfile.id] = commands.removeMeterProfile.toBytes;
toBytesMap[commands.removeObis.id] = commands.removeObis.toBytes;
toBytesMap[commands.resetSettings.id] = commands.resetSettings.toBytes;
toBytesMap[commands.setLorawanActivationMethod.id] = commands.setLorawanActivationMethod.toBytes;
toBytesMap[commands.setObserverSingleMode.id] = commands.setObserverSingleMode.toBytes;
toBytesMap[commands.setSerialPort.id] = commands.setSerialPort.toBytes;
toBytesMap[commands.setupMeter.id] = commands.setupMeter.toBytes;
toBytesMap[commands.setupMeterProfile.id] = commands.setupMeterProfile.toBytes;
toBytesMap[commands.setupObis.id] = commands.setupObis.toBytes;
toBytesMap[commands.updateImageVerify.id] = commands.updateImageVerify.toBytes;
toBytesMap[commands.updateImageWrite.id] = commands.updateImageWrite.toBytes;
toBytesMap[commands.updateRun.id] = commands.updateRun.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.getArchiveState.id] = commands.getArchiveState.fromBytes;
fromBytesMap[commands.getLorawanInfo.id] = commands.getLorawanInfo.fromBytes;
fromBytesMap[commands.getLorawanState.id] = commands.getLorawanState.fromBytes;
fromBytesMap[commands.getMeterDate.id] = commands.getMeterDate.fromBytes;
fromBytesMap[commands.getMeterId.id] = commands.getMeterId.fromBytes;
fromBytesMap[commands.getMeterIdList.id] = commands.getMeterIdList.fromBytes;
fromBytesMap[commands.getMeterInfo.id] = commands.getMeterInfo.fromBytes;
fromBytesMap[commands.getMeterProfile.id] = commands.getMeterProfile.fromBytes;
fromBytesMap[commands.getMeterProfileIdList.id] = commands.getMeterProfileIdList.fromBytes;
fromBytesMap[commands.getMeterReadoutState.id] = commands.getMeterReadoutState.fromBytes;
fromBytesMap[commands.getObisContent.id] = commands.getObisContent.fromBytes;
fromBytesMap[commands.getObisContentById.id] = commands.getObisContentById.fromBytes;
fromBytesMap[commands.getObisIdList.id] = commands.getObisIdList.fromBytes;
fromBytesMap[commands.getObisInfo.id] = commands.getObisInfo.fromBytes;
fromBytesMap[commands.getObserverCapabilities.id] = commands.getObserverCapabilities.fromBytes;
fromBytesMap[commands.getObserverInfo.id] = commands.getObserverInfo.fromBytes;
fromBytesMap[commands.getObserverSingleMode.id] = commands.getObserverSingleMode.fromBytes;
fromBytesMap[commands.getObserverUptime.id] = commands.getObserverUptime.fromBytes;
fromBytesMap[commands.getSerialPort.id] = commands.getSerialPort.fromBytes;
fromBytesMap[commands.getSettingsMemory.id] = commands.getSettingsMemory.fromBytes;
fromBytesMap[commands.readArchive.id] = commands.readArchive.fromBytes;
fromBytesMap[commands.readMeterArchive.id] = commands.readMeterArchive.fromBytes;
fromBytesMap[commands.readMeterArchiveWithDate.id] = commands.readMeterArchiveWithDate.fromBytes;
fromBytesMap[commands.reboot.id] = commands.reboot.fromBytes;
fromBytesMap[commands.removeMeter.id] = commands.removeMeter.fromBytes;
fromBytesMap[commands.removeMeterProfile.id] = commands.removeMeterProfile.fromBytes;
fromBytesMap[commands.removeObis.id] = commands.removeObis.fromBytes;
fromBytesMap[commands.resetSettings.id] = commands.resetSettings.fromBytes;
fromBytesMap[commands.setLorawanActivationMethod.id] = commands.setLorawanActivationMethod.fromBytes;
fromBytesMap[commands.setObserverSingleMode.id] = commands.setObserverSingleMode.fromBytes;
fromBytesMap[commands.setSerialPort.id] = commands.setSerialPort.fromBytes;
fromBytesMap[commands.setupMeter.id] = commands.setupMeter.fromBytes;
fromBytesMap[commands.setupMeterProfile.id] = commands.setupMeterProfile.fromBytes;
fromBytesMap[commands.setupObis.id] = commands.setupObis.fromBytes;
fromBytesMap[commands.updateImageVerify.id] = commands.updateImageVerify.fromBytes;
fromBytesMap[commands.updateImageWrite.id] = commands.updateImageWrite.fromBytes;
fromBytesMap[commands.updateRun.id] = commands.updateRun.fromBytes;

nameMap[commands.getArchiveState.id] = commands.getArchiveState.name;
nameMap[commands.getLorawanInfo.id] = commands.getLorawanInfo.name;
nameMap[commands.getLorawanState.id] = commands.getLorawanState.name;
nameMap[commands.getMeterDate.id] = commands.getMeterDate.name;
nameMap[commands.getMeterId.id] = commands.getMeterId.name;
nameMap[commands.getMeterIdList.id] = commands.getMeterIdList.name;
nameMap[commands.getMeterInfo.id] = commands.getMeterInfo.name;
nameMap[commands.getMeterProfile.id] = commands.getMeterProfile.name;
nameMap[commands.getMeterProfileIdList.id] = commands.getMeterProfileIdList.name;
nameMap[commands.getMeterReadoutState.id] = commands.getMeterReadoutState.name;
nameMap[commands.getObisContent.id] = commands.getObisContent.name;
nameMap[commands.getObisContentById.id] = commands.getObisContentById.name;
nameMap[commands.getObisIdList.id] = commands.getObisIdList.name;
nameMap[commands.getObisInfo.id] = commands.getObisInfo.name;
nameMap[commands.getObserverCapabilities.id] = commands.getObserverCapabilities.name;
nameMap[commands.getObserverInfo.id] = commands.getObserverInfo.name;
nameMap[commands.getObserverSingleMode.id] = commands.getObserverSingleMode.name;
nameMap[commands.getObserverUptime.id] = commands.getObserverUptime.name;
nameMap[commands.getSerialPort.id] = commands.getSerialPort.name;
nameMap[commands.getSettingsMemory.id] = commands.getSettingsMemory.name;
nameMap[commands.readArchive.id] = commands.readArchive.name;
nameMap[commands.readMeterArchive.id] = commands.readMeterArchive.name;
nameMap[commands.readMeterArchiveWithDate.id] = commands.readMeterArchiveWithDate.name;
nameMap[commands.reboot.id] = commands.reboot.name;
nameMap[commands.removeMeter.id] = commands.removeMeter.name;
nameMap[commands.removeMeterProfile.id] = commands.removeMeterProfile.name;
nameMap[commands.removeObis.id] = commands.removeObis.name;
nameMap[commands.resetSettings.id] = commands.resetSettings.name;
nameMap[commands.setLorawanActivationMethod.id] = commands.setLorawanActivationMethod.name;
nameMap[commands.setObserverSingleMode.id] = commands.setObserverSingleMode.name;
nameMap[commands.setSerialPort.id] = commands.setSerialPort.name;
nameMap[commands.setupMeter.id] = commands.setupMeter.name;
nameMap[commands.setupMeterProfile.id] = commands.setupMeterProfile.name;
nameMap[commands.setupObis.id] = commands.setupObis.name;
nameMap[commands.updateImageVerify.id] = commands.updateImageVerify.name;
nameMap[commands.updateImageWrite.id] = commands.updateImageWrite.name;
nameMap[commands.updateRun.id] = commands.updateRun.name;
