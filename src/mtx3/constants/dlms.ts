import {
    IDlmsJsonOptions as BaseIDlmsJsonOptions,
    defaultDlmsJsonOptions as baseDefaultDlmsJsonOptions
} from '../../mtx1/utils/command.js';


export interface IJsonOptions extends BaseIDlmsJsonOptions {
    /**
     * Indicates if the meter is of `G`-type (Green).
     *
     * | Value   | Meter type |
     * | ------- | ---------- |
     * | `true`  | `G`        |
     * | `false` | `R`        |
     */
    isGreen: boolean;
}

export const defaultJsonOptions: IJsonOptions = {
    ...baseDefaultDlmsJsonOptions,
    isGreen: false
};
