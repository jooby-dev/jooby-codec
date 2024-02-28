import {IHexFormatOptions} from '../config.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getHexFromNumber from '../utils/getHexFromNumber.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


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
    size: number = 0;


    /** Get command ID in hex format. */
    static getId () {
        return getHexFromNumber(this.id);
    }

    /**
     * Parse body without header.
     *
     * @param data command in binary form
     *
     * @returns command instance
     */
    // static fromBytes ( data: Uint8Array ): Command {
    //     throw new Error('not implemented!');
    // }

    // static fromHex ( data: string ): Command {
    //     return this.fromBytes(getBytesFromHex(data));
    // }

    // static fromBytes ( data: Uint8Array, commandsById: any ): any {
    //     const headerData = header.fromBytes(data);

    //     if ( headerData.headerSize + headerData.commandSize < data.length ) {
    //         throw new Error(
    //             `Wrong header. Header size: ${headerData.headerSize}, command size: ${headerData.commandSize}, buffer size: ${data.length}.`
    //         );
    //     }

    //     const command = commandsById[headerData.commandId];

    //     if ( !command ) {
    //         throw new Error(
    //             `Unsupported command with id: ${headerData.commandId}.`
    //         );
    //     }

    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //     return command.fromBytes(
    //         data.slice(headerData.headerSize, headerData.headerSize + headerData.commandSize)
    //     );
    // }

    /**
     * Build header with body.
     *
     * @param id command id
     * @param commandData optional command binary data
     * @returns merged data
     */
    static toBytes ( id: number, commandData?: Uint8Array ): Uint8Array {
        const commandLength = commandData?.length ?? 0;
        const headerData = new Uint8Array([id, commandLength]);

        if ( commandData && commandLength ) {
            return mergeUint8Arrays(headerData, commandData);
        }

        // simple command without body
        return headerData;
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
