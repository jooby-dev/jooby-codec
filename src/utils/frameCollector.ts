import * as Frame from './frame.js';
import {START_BYTE, STOP_BYTE} from '../constants/frameAttributes.js';


class FrameCollector {
    private frames: Array<Frame.IFrame> = [];

    private buffer: Array<number> = [];

    constructor ( public frameBufferMaxSize: number = 256 ) {
    }

    process ( data: Uint8Array | Array<number> ) : Array<Frame.IFrame> {
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
            this.frames.push(Frame.fromBytes(new Uint8Array(this.buffer)));
            this.reset();

            return;
        }

        if ( this.buffer.length === this.frameBufferMaxSize ) {
            this.reset();
        }
    }

    reset () {
        this.buffer = [];
    }
}

export default FrameCollector;
