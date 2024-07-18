import {
    IDlmsJsonOptions as BaseIDlmsJsonOptions,
    defaultDlmsJsonOptions as baseDefaultDlmsJsonOptions
} from '../../mtx/utils/command.js';


export interface IDlmsJsonOptions extends BaseIDlmsJsonOptions {
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

export const defaultDlmsJsonOptions = {
    ...baseDefaultDlmsJsonOptions,
    isGreen: false
};
