/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map();
export const responseById = new Map();


requestByResponse.set(uplinkCommands.AddShortNameProfileResponse, downlinkCommands.AddShortNameProfile);
requestByResponse.set(uplinkCommands.GetArchiveProfileResponse, downlinkCommands.GetArchiveProfile);
requestByResponse.set(uplinkCommands.GetContentByObisResponse, downlinkCommands.GetContentByObis);
requestByResponse.set(uplinkCommands.GetContentByShortNameResponse, downlinkCommands.GetContentByShortName);
requestByResponse.set(uplinkCommands.GetDeviceInfoResponse, downlinkCommands.GetDeviceInfo);
requestByResponse.set(uplinkCommands.GetLorawanInfoResponse, downlinkCommands.GetLorawanInfo);
requestByResponse.set(uplinkCommands.GetShortNameInfoResponse, downlinkCommands.GetShortNameInfo);
requestByResponse.set(uplinkCommands.GetShortNameProfileResponse, downlinkCommands.GetShortNameProfile);
requestByResponse.set(uplinkCommands.GetShortNamesResponse, downlinkCommands.GetShortNames);
requestByResponse.set(uplinkCommands.ReadArchiveResponse, downlinkCommands.ReadArchive);
requestByResponse.set(uplinkCommands.RebootResponse, downlinkCommands.Reboot);
requestByResponse.set(uplinkCommands.RemoveShortNameProfileResponse, downlinkCommands.RemoveShortNameProfile);
requestByResponse.set(uplinkCommands.SetArchiveProfileResponse, downlinkCommands.SetArchiveProfile);
requestByResponse.set(uplinkCommands.SetSerialPortResponse, downlinkCommands.SetSerialPort);
requestByResponse.set(uplinkCommands.SetShortNameResponse, downlinkCommands.SetShortName);

for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
    // fill id to constructor dictionaries
    responseById.set(response.id, response);
    requestById.set(request.id, request);
}
