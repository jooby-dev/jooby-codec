import * as types from '../../types.js';
import {IDataSegment} from './binary/buffer.js';


const isSegmentCorrect = ( segment: IDataSegment ) => {
    if ( segment.segmentIndex === 0 || segment.segmentIndex > segment.segmentsNumber ) {
        return false;
    }

    return segment.segmentIndex === segment.segmentsNumber ? segment.isLast : !segment.isLast;
};


class DataSegmentsCollector {
    segments: Array<IDataSegment> = [];

    push ( segment: IDataSegment ): types.TBytes {
        if ( !isSegmentCorrect(segment)) {
            return [];
        }

        if ( this.segments.length !== 0 ) {
            if ( this.segments[0].segmentationSessionId !== segment.segmentationSessionId ) {
                this.clear();
            }
        }

        const index = this.segments.findIndex(value => value.segmentIndex >= segment.segmentIndex);

        if ( index === -1 ) {
            this.segments.push(segment);
        } else {
            if ( this.segments[index].segmentIndex === segment.segmentIndex ) {
                this.clear();

                return [];
            }

            this.segments.splice(index, 0, segment);
        }

        if ( this.segments.length === 0 || this.segments.length !== this.segments[0].segmentsNumber ) {
            return [];
        }

        if ( !this.segments[this.segments.length - 1].isLast ) {
            this.clear();

            return [];
        }

        let result: types.TBytes = [];
        this.segments.forEach(({data}) => {
            result = result.concat(data);
        });

        this.clear();

        return result;
    }

    clear () {
        this.segments = [];
    }
}

export default DataSegmentsCollector;
