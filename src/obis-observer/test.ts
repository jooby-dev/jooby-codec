/* eslint-disable */
process.env.TZ = 'UTC';
import assert from 'node:assert/strict';

// import * as commands from './obis-observer/commands/index.js';
// import * as utils from './utils/index.js';
// import * as constants from './obis-observer/constants/index.js';
// import CommandBinaryBuffer from './obis-observer/CommandBinaryBuffer.js';
// import SetShortName from './obis-observer/commands/downlink/SetShortName.js';
// import SetShortNameResponse from './obis-observer/commands/uplink/SetShortNameResponse.js';

// const cmd = new SetShortNameResponse({
//     shortName: 44,
//     resultCode: 0
// });
// console.log(cmd.toHex());

// const cmdhex = SetShortNameResponse.fromBytes(utils.getBytesFromHex(cmd.toHex().substring(2)));
// console.log(cmd.parameters)

// import SetParameter from './commands/downlink/SetParameter.js';

// const parameters = {id: constants.deviceParameters.ABSOLUTE_DATA, data: {value: 2023, meterValue: 204, pulseCoefficient: 100}};
// const command = new SetParameter(parameters);
// console.log(command.toHex());

// // const message = fromHex('03 0b 1d 00 00 00 01 a2 80 00 00 00 1f 03 03 1e 00 01 63');

// // console.log(message.commands.map(cmd => cmd.command.parameters));

// console.log(getDateFromSeconds(734045840).toLocaleString('lt').toString().replace(/-/g, '.') + ' GMT');
// console.log(getSecondsFromDate(new Date('2023-07-27 00:00:00')));


// const commandBody = new Uint8Array([
//     0x2e, 0x6a, 0x0c, 0x01, 0x64, 0xb9, 0xf3, 0x14, 0x80, 0x01
// ]);
// const buffer = new CommandBinaryBuffer(5);
// const value = 12;
// buffer.setExtendedValue(value);
// const array = buffer.getBytesToOffset();

// const oneByteExtended = '0b' + (parseInt('0x' + array[0].toString(16), 16)).toString(2).padStart(8, '0');
// let twoByteExtended;
// try {
//     twoByteExtended = '0b' + (parseInt('0x' + array[0].toString(16) + array[1].toString(16), 16)).toString(2).padStart(16, '0');
// } catch (_) {}

// console.log({value}, '0x' + utils.getHexFromBytes(buffer.getBytesToOffset()).split(' ').join(''));
// console.log(`\`0b${value.toString(2).padStart(8, '0')}\`<br>with extended bits:<br>\`${oneByteExtended}\``);

// if ( twoByteExtended ) {
//     console.log(`\`0b${value.toString(2).padStart(16, '0')}\`<br>with extended bits:<br>\`${twoByteExtended}\``);
// }




// const cmd = new GetArchiveDaysMCResponse({
//     startTime: 743731200,
//     days: 2,
//     channelList: [
//         {
//             index: 1,
//             dayList: [123, 345]
//         },
//         {
//             index: 2,
//             dayList: [455, 890]
//         },
//         {
//             index: 3,
//             dayList: [334, 412]
//         },
//         {
//             index: 4,
//             dayList: [221, 786]
//         }
//     ]
// });
// console.log(cmd.toHex());

// const ExAbsCurrentMC = commands.uplink.ExAbsCurrentMC;

// const commandFromHex = ExAbsCurrentMC.fromBytes(utils.getBytesFromHex(ExAbsCurrentMC.examples[0].hex.body));
// console.log(commandFromHex);


// const DownlinkCommand = commands.downlink['SetParameter'];

// DownlinkCommand.examples.forEach(example => {
//     console.log(example.name);
//     const parameters = example.parameters;
//     if ( parameters ) {
//         // @ts-ignore
//         const command = new DownlinkCommand(parameters);
//         console.log(`fromParameters ${example.name}`, command.toHex());
//         const commandFromHex = DownlinkCommand.fromBytes(utils.getBytesFromHex(example.hex.body));
//         console.log(`fromHex ${example.name}`, commandFromHex.toHex());

//         assert.strictEqual(command.toHex(), commandFromHex.toHex());
//         assert.deepStrictEqual(command.parameters, commandFromHex.parameters);
//     }
// });

// const UplinkCommand = commands.uplink['GetLmicVersion'];

// UplinkCommand.examples.forEach(example => {
//     console.log(example.name);
//     const parameters = example.parameters;
//     if ( parameters ) {
//         // @ts-ignore
//         const command = new UplinkCommand(parameters);
//         console.log(`fromParameters ${example.name}`, command.toHex());
//         const commandFromHex = UplinkCommand.fromBytes(utils.getBytesFromHex(example.hex.body));
//         console.log(`fromHex ${example.name}`, commandFromHex.toHex());

//         assert.strictEqual(command.toHex(), commandFromHex.toHex());
//         assert.deepStrictEqual(command.parameters, commandFromHex.parameters);
//     }
// });
