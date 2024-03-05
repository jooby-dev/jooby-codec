import * as header from './header.js';
import BaseCommand from '../Command.js';


export {ICommandExample, TCommandExampleList, TJsonOptions, defaultJsonOptions} from '../Command.js';

export interface ICommandBinary {
    header: Uint8Array,
    body?: Uint8Array,
    bytes: Uint8Array
}


/**
 * private
 */
abstract class Command extends BaseCommand {
    /** additional/environment parameters */
    config: unknown;

    /**
     * Build binary representation of commands header, body and complete buffer.
     *
     * @param id command id
     * @param commandData optional command binary data
     * @returns commands header, body and complete buffer binary representation
     */
    static toBinary ( id: number, commandData?: Uint8Array ): ICommandBinary {
        const commandLength = commandData?.length ?? 0;
        const headerData = header.toBytes(id, commandLength);

        if ( commandData && commandLength ) {
            return {
                header: headerData,
                body: commandData,
                bytes: new Uint8Array([...headerData, ...commandData])
            };
        }

        // simple command without body
        return {
            header: headerData,
            bytes: headerData
        };
    }

    // eslint-disable-next-line class-methods-use-this
    toBinary (): ICommandBinary {
        throw new Error('not implemented!');
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return this.toBinary().bytes;
    }
}


export default Command;
