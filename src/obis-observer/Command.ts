import BaseCommand from '../Command.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


export {ICommandExample, TCommandExampleList, TJsonOptions, defaultJsonOptions} from '../Command.js';


/**
 * private
 */
abstract class Command extends BaseCommand {
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
}


export default Command;
