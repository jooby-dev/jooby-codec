import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObserverCapabilitiesResponseParameters command parameters
 */
interface IGetObserverCapabilitiesResponseParameters extends ICommandParameters {
    maxMeterProfilesNumber: number,
    maxMetersNumber: number,
    maxObisProfilesNumber: number,
    isMultiModeSupported: boolean
}


const COMMAND_ID = 0x04;

const examples: TCommandExampleList = [
    {
        name: 'get observer capabilities response',
        parameters: {
            requestId: 7,
            maxMeterProfilesNumber: 8,
            maxMetersNumber: 8,
            maxObisProfilesNumber: 255,
            isMultiModeSupported: true
        },
        hex: {
            header: '04',
            body: '07 08 08 ff 01'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObserverCapabilitiesResponse from 'jooby-codec/obis-observer/commands/uplink/GetObserverCapabilitiesResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x07, 07 08 08 ff 01
 * ]);
 * const command = GetObserverCapabilitiesResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     maxMeterProfilesNumber: 8,
 *     maxMetersNumber: 8,
 *     maxObisProfilesNumber: 255,
 *     isMultiModeSupported: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverCapabilities.md#response)
 */
class GetObserverCapabilitiesResponse extends Command {
    constructor ( public parameters: IGetObserverCapabilitiesResponseParameters ) {
        super();

        // real size - request id byte + software version 2 bytes + hardware version 2 bytes + device name string size byte + string bytes
        this.size = REQUEST_ID_SIZE + 4;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const maxMeterProfilesNumber = buffer.getUint8();
        const maxMetersNumber = buffer.getUint8();
        const maxObisProfilesNumber = buffer.getUint8();
        const isMultiModeSupported = buffer.getUint8() !== 0;

        return new GetObserverCapabilitiesResponse({
            requestId,
            maxMeterProfilesNumber,
            maxMetersNumber,
            maxObisProfilesNumber,
            isMultiModeSupported
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([
                this.parameters.requestId,
                this.parameters.maxMeterProfilesNumber,
                this.parameters.maxMetersNumber,
                this.parameters.maxObisProfilesNumber,
                this.parameters.isMultiModeSupported ? 1 : 0
            ])
        );
    }
}


export default GetObserverCapabilitiesResponse;
