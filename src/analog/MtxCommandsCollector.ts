import {IMtxCommand} from './CommandBinaryBuffer.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


const isSegmentCorrect = ( segment: IMtxCommand ) => {
    if ( segment.fragmentIndex === 0 || segment.fragmentIndex > segment.fragmentsNumber ) {
        return false;
    }

    return segment.fragmentIndex === segment.fragmentsNumber ? segment.last : !segment.last;
};


class MtxCommandsCollector {
    #segments: Array<IMtxCommand> = [];

    push ( segment: IMtxCommand ): Uint8Array {
        if ( !isSegmentCorrect(segment)) {
            return new Uint8Array();
        }

        if ( this.#segments.length !== 0 ) {
            if ( this.#segments[0].sequence !== segment.sequence ) {
                this.clear();
            }
        }

        const index = this.#segments.findIndex(value => value.fragmentIndex >= segment.fragmentIndex);

        if ( index === -1 ) {
            this.#segments.push(segment);
        } else {
            if ( this.#segments[index].fragmentIndex === segment.fragmentIndex ) {
                this.clear();

                return new Uint8Array();
            }

            this.#segments.splice(index, 0, segment);
        }

        if ( this.#segments.length === 0 || this.#segments.length !== this.#segments[0].fragmentsNumber ) {
            return new Uint8Array();
        }

        if ( !this.#segments[this.#segments.length - 1].last ) {
            this.clear();

            return new Uint8Array();
        }

        const result = this.#segments.map(({data}) => data);

        this.clear();

        return mergeUint8Arrays(...result);
    }

    clear () {
        this.#segments = [];
    }
}

export default MtxCommandsCollector;
