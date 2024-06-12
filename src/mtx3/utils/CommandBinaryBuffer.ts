/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../../types.js';
import MtxBinaryBuffer, {ICommandBinaryBuffer as IMtxCommandBinaryBuffer} from '../../mtx/utils/CommandBinaryBuffer.js';
//import * as bitSet from '../../utils/bitSet.js';


export interface ICommandBinaryBuffer extends IMtxCommandBinaryBuffer {
    // instance methods
    // getFrameHeader (): IFrameHeader,
    // setFrameHeader ( frameHeader: IFrameHeader ),
}

function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
    MtxBinaryBuffer.call(this, dataOrLength, isLittleEndian);
}

// extending
CommandBinaryBuffer.prototype = Object.create(MtxBinaryBuffer.prototype);
CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;


// CommandBinaryBuffer.prototype.getFrameHeader = function (): IFrameHeader {
//     return {
//         type: this.getUint8(),
//         destination: this.getUint16(),
//         source: this.getUint16()
//     };
// };

// CommandBinaryBuffer.prototype.setFrameHeader = function ( {
//     type = defaultFrameHeader.type,
//     destination = defaultFrameHeader.destination,
//     source = defaultFrameHeader.source
// }: IFrameHeader ) {
//     this.setUint8(type);
//     this.setUint16(destination);
//     this.setUint16(source);
// };


export default CommandBinaryBuffer;
