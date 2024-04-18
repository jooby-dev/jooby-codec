import {IDataSegment} from './CommandBinaryBuffer.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


const isSegmentCorrect = ( segment: IDataSegment ) => {
    if ( segment.segmentIndex === 0 || segment.segmentIndex > segment.segmentsNumber ) {
        return false;
    }

    return segment.segmentIndex === segment.segmentsNumber ? segment.isLast : !segment.isLast;
};


class DataSegmentsCollector {
    #segments: Array<IDataSegment> = [];

    push ( segment: IDataSegment ): Uint8Array {
        if ( !isSegmentCorrect(segment)) {
            return new Uint8Array();
        }

        if ( this.#segments.length !== 0 ) {
            if ( this.#segments[0].segmentationSessionId !== segment.segmentationSessionId ) {
                this.clear();
            }
        }

        const index = this.#segments.findIndex(value => value.segmentIndex >= segment.segmentIndex);

        if ( index === -1 ) {
            this.#segments.push(segment);
        } else {
            if ( this.#segments[index].segmentIndex === segment.segmentIndex ) {
                this.clear();

                return new Uint8Array();
            }

            this.#segments.splice(index, 0, segment);
        }

        if ( this.#segments.length === 0 || this.#segments.length !== this.#segments[0].segmentsNumber ) {
            return new Uint8Array();
        }

        if ( !this.#segments[this.#segments.length - 1].isLast ) {
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

export default DataSegmentsCollector;
