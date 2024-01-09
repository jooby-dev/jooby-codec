/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map(Object.values(downlinkCommands).map(command => [command.id, command]));
export const responseById = new Map(Object.values(uplinkCommands).map(command => [command.id, command]));


requestByResponse.set(uplinkCommands.CorrectTime2000Response, downlinkCommands.CorrectTime2000);
requestByResponse.set(uplinkCommands.Current, downlinkCommands.GetCurrent);
requestByResponse.set(uplinkCommands.CurrentMC, downlinkCommands.GetCurrentMC);
requestByResponse.set(uplinkCommands.ExAbsCurrentMC, downlinkCommands.GetExAbsCurrentMC);
requestByResponse.set(uplinkCommands.GetArchiveDaysMCResponse, downlinkCommands.GetArchiveDaysMC);
requestByResponse.set(uplinkCommands.GetArchiveDaysResponse, downlinkCommands.GetArchiveDays);
requestByResponse.set(uplinkCommands.GetArchiveEventsResponse, downlinkCommands.GetArchiveEvents);
requestByResponse.set(uplinkCommands.GetArchiveHoursMCResponse, downlinkCommands.GetArchiveHoursMC);
requestByResponse.set(uplinkCommands.GetBatteryStatusResponse, downlinkCommands.GetBatteryStatus);
requestByResponse.set(uplinkCommands.GetExAbsArchiveDaysMCResponse, downlinkCommands.GetExAbsArchiveDaysMC);
requestByResponse.set(uplinkCommands.GetExAbsArchiveHoursMCResponse, downlinkCommands.GetExAbsArchiveHoursMC);
requestByResponse.set(uplinkCommands.GetLmicInfoResponse, downlinkCommands.GetLmicInfo);
requestByResponse.set(uplinkCommands.GetParameterResponse, downlinkCommands.GetParameter);
requestByResponse.set(uplinkCommands.MtxCommand, downlinkCommands.MtxCommand);
requestByResponse.set(uplinkCommands.SetParameterResponse, downlinkCommands.SetParameter);
requestByResponse.set(uplinkCommands.SetTime2000Response, downlinkCommands.SetTime2000);
requestByResponse.set(uplinkCommands.SoftRestartResponse, downlinkCommands.SoftRestart);
requestByResponse.set(uplinkCommands.Status, downlinkCommands.GetStatus);
requestByResponse.set(uplinkCommands.Time2000, downlinkCommands.GetTime2000);
requestByResponse.set(uplinkCommands.UpdateRunResponse, downlinkCommands.UpdateRun);
requestByResponse.set(uplinkCommands.VerifyImageResponse, downlinkCommands.VerifyImage);
requestByResponse.set(uplinkCommands.WriteImageResponse, downlinkCommands.WriteImage);

for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
}
