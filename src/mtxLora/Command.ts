import Command, {TJsonOptions, defaultJsonOptions} from '../mtx/Command.js';

export default Command;
export * from '../mtx/Command.js';

export interface IDlmsJsonOptions extends TJsonOptions {
    dlms: boolean
}

export const defaultDlmsJsonOptions = {
    ...defaultJsonOptions,
    dlms: false
};
