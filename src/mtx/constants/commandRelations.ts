/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map(Object.values(downlinkCommands).map(command => [command.id, command]));
export const responseById = new Map(Object.values(uplinkCommands).map(command => [command.id, command]));


requestByResponse.set(uplinkCommands.ActivateRatePlanResponse, downlinkCommands.ActivateRatePlan);
requestByResponse.set(uplinkCommands.GetDateTimeResponse, downlinkCommands.GetDateTime);
requestByResponse.set(uplinkCommands.GetDayProfileResponse, downlinkCommands.GetDayProfile);
requestByResponse.set(uplinkCommands.GetDeviceIdResponse, downlinkCommands.GetDeviceId);
requestByResponse.set(uplinkCommands.GetDeviceTypeResponse, downlinkCommands.GetDeviceType);
requestByResponse.set(uplinkCommands.GetDisplayParamResponse, downlinkCommands.GetDisplayParam);
requestByResponse.set(uplinkCommands.GetOpParamsResponse, downlinkCommands.GetOpParams);
requestByResponse.set(uplinkCommands.GetRatePlanInfoResponse, downlinkCommands.GetRatePlanInfo);
requestByResponse.set(uplinkCommands.GetSeasonProfileResponse, downlinkCommands.GetSeasonProfile);
requestByResponse.set(uplinkCommands.GetSpecialDayResponse, downlinkCommands.GetSpecialDay);
requestByResponse.set(uplinkCommands.PrepareRatePlanResponse, downlinkCommands.PrepareRatePlan);
requestByResponse.set(uplinkCommands.RunTariffPlanResponse, downlinkCommands.RunTariffPlan);
requestByResponse.set(uplinkCommands.SetAccessKeyResponse, downlinkCommands.SetAccessKey);
requestByResponse.set(uplinkCommands.SetCorrectDateTimeResponse, downlinkCommands.SetCorrectDateTime);
requestByResponse.set(uplinkCommands.SetDateTimeResponse, downlinkCommands.SetDateTime);
requestByResponse.set(uplinkCommands.SetDayProfileResponse, downlinkCommands.SetDayProfile);
requestByResponse.set(uplinkCommands.SetDisplayParamResponse, downlinkCommands.SetDisplayParam);
requestByResponse.set(uplinkCommands.SetOpParamsResponse, downlinkCommands.SetOpParams);
requestByResponse.set(uplinkCommands.SetSeasonProfileResponse, downlinkCommands.SetSeasonProfile);
requestByResponse.set(uplinkCommands.SetSpecialDayResponse, downlinkCommands.SetSpecialDay);
requestByResponse.set(uplinkCommands.TurnRelayOffResponse, downlinkCommands.TurnRelayOff);
requestByResponse.set(uplinkCommands.TurnRelayOnResponse, downlinkCommands.TurnRelayOn);


for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
}
