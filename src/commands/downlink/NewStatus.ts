import Command from '../../Command.js';


const COMMAND_ID = 0x14;
const COMMAND_TITLE = 'NEW_STATUS';


class NewStatus extends Command {
    constructor () {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = false;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static fromBytes ( _data: Uint8Array ) {
        return new NewStatus();
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID, new Uint8Array());
    }
}


export default NewStatus;
