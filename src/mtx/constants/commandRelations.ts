/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map();
export const responseById = new Map();


requestByResponse.set(uplinkCommands.ActivateRatePlanResponse, downlinkCommands.ActivateRatePlan);
requestByResponse.set(uplinkCommands.GetDateTimeResponse, downlinkCommands.GetDateTime);
requestByResponse.set(uplinkCommands.GetDisplayParamResponse, downlinkCommands.GetDisplayParam);
requestByResponse.set(uplinkCommands.GetOpParamsResponse, downlinkCommands.GetOpParams);
requestByResponse.set(uplinkCommands.GetRatePlanInfoResponse, downlinkCommands.GetRatePlanInfo);
requestByResponse.set(uplinkCommands.SetDisplayParamResponse, downlinkCommands.SetDisplayParam);
requestByResponse.set(uplinkCommands.SetOpParamsResponse, downlinkCommands.SetOpParams);
requestByResponse.set(uplinkCommands.TurnRelayOffResponse, downlinkCommands.TurnRelayOff);
requestByResponse.set(uplinkCommands.TurnRelayOnResponse, downlinkCommands.TurnRelayOn);

for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
    // fill id to constructor dictionaries
    responseById.set(response.id, response);
    requestById.set(request.id, request);
}