/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map(Object.values(downlinkCommands).map(command => [command.id, command]));
export const responseById = new Map(Object.values(uplinkCommands).map(command => [command.id, command]));


requestByResponse.set(uplinkCommands.MtxCommand, downlinkCommands.MtxCommand);


for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
}
