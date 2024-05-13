/**
 * SHOULD BE REWORKED!
 *
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
toBytesMap[commands.setObserverSingleMode.id] = commands.setObserverSingleMode.toBytes;
toBytesMap[commands.setSerialPort.id] = commands.setSerialPort.toBytes;
toBytesMap[commands.setupMeterProfile.id] = commands.setupMeterProfile.toBytes;
toBytesMap[commands.setupMeter.id] = commands.setupMeter.toBytes;
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
fromBytesMap[commands.setObserverSingleMode.id] = commands.setObserverSingleMode.fromBytes;
fromBytesMap[commands.setSerialPort.id] = commands.setSerialPort.fromBytes;
fromBytesMap[commands.setupMeterProfile.id] = commands.setupMeterProfile.fromBytes;
fromBytesMap[commands.setupMeter.id] = commands.setupMeter.fromBytes;
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
nameMap[commands.setObserverSingleMode.id] = commands.setObserverSingleMode.name;
nameMap[commands.setSerialPort.id] = commands.setSerialPort.name;
nameMap[commands.setupMeterProfile.id] = commands.setupMeterProfile.name;
nameMap[commands.setupMeter.id] = commands.setupMeter.name;
nameMap[commands.setupObis.id] = commands.setupObis.name;
nameMap[commands.updateImageVerify.id] = commands.updateImageVerify.name;
nameMap[commands.updateImageWrite.id] = commands.updateImageWrite.name;
nameMap[commands.updateRun.id] = commands.updateRun.name;
