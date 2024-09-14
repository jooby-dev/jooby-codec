import {START_BYTE, STOP_BYTE} from '../constants/frameAttributes.js';
import {TBytes} from '../types.js';


class FrameCollector {
    private frames: Array<TBytes> = [];

    private buffer: TBytes = [];

    constructor ( public frameBufferMaxSize: number = 256 ) {}

    process ( data: TBytes ): Array<TBytes> {
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
            if ( this.buffer?.length < 5 ) {
                // start byte + 2 crc byte + at least 1 byte content + stop byte
                // will found valid frame in sequence 7e017e52fffefffe51147e
                // treat STOP byte as START byte for the new frame
                this.buffer = [START_BYTE];
            } else {
                this.frames.push(this.buffer);
                this.reset();
            }

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
