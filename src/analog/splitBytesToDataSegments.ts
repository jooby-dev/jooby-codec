import DataSegmentBase from './commands/DataSegmentBase.js';


export interface IDataSegmentSplitOptions {
    segmentationSessionId: number,
    maxSegmentSize: number
}


const MAX_SEGMENTS_IN_SESSION = 7;


export const splitBytesToDataSegments = ( bytes: Uint8Array, {segmentationSessionId, maxSegmentSize}: IDataSegmentSplitOptions ): Array<DataSegmentBase> => {
    const segmentsNumber = Math.ceil(bytes.length / maxSegmentSize);
    const segments = [];
    let segmentIndex = 0;
    let position = 0;

    if ( segmentsNumber > MAX_SEGMENTS_IN_SESSION ) {
        throw new Error(`Message is too big for one segmentation session. Length: ${bytes.length}, maxSegmentSize: ${maxSegmentSize}`);
    }

    while ( position < bytes.length ) {
        const segment = new DataSegmentBase({
            segmentationSessionId,
            segmentIndex,
            segmentsNumber,
            isLast: false,
            data: bytes.slice(position, position + maxSegmentSize)
        });

        position += maxSegmentSize;
        segmentIndex++;

        segments.push(segment);
    }

    if ( segments.length !== 0 ) {
        segments[segments.length - 1].parameters.isLast = true;
    }

    return segments;
};
