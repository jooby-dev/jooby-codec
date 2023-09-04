import {IHexFormatOptions} from '../config.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getHexFromNumber from '../utils/getHexFromNumber.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';


export interface ICommandExample {
    name: string,
    parameters?: object,
    hardwareType?: number,
    hex: {
        header: string,
        body: string
    }
}

export type TCommandExampleList = Array<ICommandExample>;


export const COMMAND_HEADER_SIZE = 2;


/**
 * private
 */
abstract class Command {
    static id: number;

    static directionType: unknown;

    static title: string;

    static examples: TCommandExampleList;

    static hasParameters = false;


    parameters: unknown;

    /** whole command body size (without header) */
    size = 0;


    /** Get command ID in hex format. */
    static getId () {
        return getHexFromNumber(this.id);
    }

    /** Get command parameters. */
    getParameters () {
        return this.parameters;
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        throw new Error('not implemented!');
    }

    toHex ( options: IHexFormatOptions = {} ) {
        return getHexFromBytes(this.toBytes(), options);
    }

    toBase64 () {
        return getBase64FromBytes(this.toBytes());
    }

    /**
     * Returns the command in JSON format.
     *
     * @returns JSON string contains current parameters
     */
    toJson () {
        return JSON.stringify(this.getParameters());
    }
}


export default Command;
