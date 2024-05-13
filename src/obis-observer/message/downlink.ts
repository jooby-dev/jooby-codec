/**
 * SHOULD BE REWORKED!
 *
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx/message/downlink';
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
 * const bytes = message.toBytes(
 *     commands,
 *     {
 *         messageId,
 *         accessLevel: downlinkCommands.setDateTime.accessLevel,
 *         aesKey
 *     }
 * );
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // output:
 * [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132]
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // output:
 * '0a 13 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84'
 *
 *
 * const frameBytes = message.toFrame(
 *     bytes,
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
 * const parsedMessage = message.fromBytes(bytes, {aesKey});
 *
 * console.log('parsed message:', parsedMessage);
 * // output:
 * {
 *     messageId: 3,
 *     accessLevel: 3,
 *     commands: [
 *       {
 *         id: 8,
 *         name: 'setDateTime',
 *         headerSize: 2,
 *         bytes: [Array],
 *         parameters: [Object]
 *       }
 *     ],
 *     bytes: [
 *         3,  19, 237, 116,  10, 174,
 *        74, 186, 200,  66, 196,  27,
 *       231, 245,  13,  60,  40, 132
 *     ],
 *     lrc: { expected: 119, actual: 119 }
 * }
 *
 * // decode message back from frame
 * const parsedFrame = message.fromFrame(frameBytes, {aesKey});
 *
 * console.log('parsed frame:', parsedFrame);
 * // output:
 * {
 *     type: 80,
 *     destination: 43690,
 *     source: 65535,
 *     messageId: 10,
 *     accessLevel: 3,
 *     commands: [
 *       {
 *         id: 8,
 *         name: 'setDateTime',
 *         headerSize: 2,
 *         bytes: [Array],
 *         parameters: [Object]
 *       }
 *     ],
 *     bytes: [
 *        10,  19, 237, 116,  10, 174,
 *        74, 186, 200,  66, 196,  27,
 *       231, 245,  13,  60,  40, 132
 *     ],
 *     lrc: { expected: 119, actual: 119 },
 *     crc: 25019
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
