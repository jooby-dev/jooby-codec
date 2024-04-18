import {START_BYTE, STOP_BYTE} from '../constants/frameAttributes.js';
import {TBytes} from '../types.js';
import * as Frame from './frame.js';


class FrameCollector {
    private frames: Array<Frame.IFrame> = [];

    private buffer: Array<number> = [];

    constructor ( public dataBits: Frame.TDataBits = 8, public frameBufferMaxSize: number = 256 ) {}

    process ( data: TBytes ) : Array<Frame.IFrame> {
        data.forEach(value => this.processByte(value));

        const result = this.frames;
        this.frames = [];

        return result;
    }

    processByte ( value: number ) {
        const byte = value & 0xff;

        if ( this.buffer.length === 0 ) {
            if ( byte === START_BYTE ) {
                this.buffer = [START_BYTE];
            }

            return;
        }

        this.buffer.push(byte);

        if ( byte === STOP_BYTE ) {
            this.frames.push(Frame.fromBytes(this.buffer, this.dataBits));
            this.reset();

            return;
        }

        if ( this.buffer.length === this.frameBufferMaxSize ) {
            this.reset();
        }
    }

    isEmpty () {
        return this.buffer.length === 0;
    }

    reset () {
        this.buffer = [];
    }
}

export default FrameCollector;
