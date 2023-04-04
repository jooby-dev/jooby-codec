import CommandBinaryBuffer from '../CommandBinaryBuffer.js';


export default class EventBase {
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    setBytes ( data: CommandBinaryBuffer ): void {
        throw new Error('not implemented');
    }
}
