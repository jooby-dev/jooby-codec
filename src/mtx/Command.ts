import Command, {TJsonOptions, defaultJsonOptions} from '../Command.js';

export default Command;
export {ICommandExample, TCommandExampleList, TJsonOptions, defaultJsonOptions} from '../Command.js';

export const COMMAND_HEADER_SIZE = 2;

export interface IDlmsJsonOptions extends TJsonOptions {
    dlms: boolean
}

export const defaultDlmsJsonOptions = {
    ...defaultJsonOptions,
    dlms: false
};
