import EventBase from './EventBase.js';
import CommandBinaryBuffer from '../CommandBinaryBuffer.js';


interface IEventTimeParameters {
    time: number
}


class EventTime implements EventBase {
    constructor ( public parameters: IEventTimeParameters ) {
    }

    static fromBytes ( data: CommandBinaryBuffer ): EventTime {
        const time = data.getUint8();

        return new EventTime({time});
    }

    setBytes ( data: CommandBinaryBuffer ): void {
        data.setUint8(this.parameters.time);
    }
}


export default EventTime;
