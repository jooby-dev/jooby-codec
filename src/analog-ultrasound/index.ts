/**
 * Analog ultrasound protocol.
 *
 * @packageDocumentation
 *
 * Nested in Analog [`usWaterMeterCommand`](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/USWaterMeterCommand.md).
 * Inner frame: [water frame](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/water-frame.md).
 */

export {ANALOG_ULTRASOUND as name} from '../constants/protocols.js';
export * as commands from './commands/index.js';
export * as message from './message/index.js';
export * as constants from './constants/index.js';
export * as utils from './utils/index.js';
