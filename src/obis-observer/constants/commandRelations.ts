import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


export const requestByResponse = new Map();
export const responseByRequest = new Map();


requestByResponse.set(uplinkCommands.AddShortNameProfileResponse, downlinkCommands.AddShortNameProfile);
requestByResponse.set(uplinkCommands.GetArchiveProfileResponse, downlinkCommands.GetArchiveProfile);
requestByResponse.set(uplinkCommands.GetContentByObisResponse, downlinkCommands.GetContentByObis);
requestByResponse.set(uplinkCommands.GetContentByShortNameResponse, downlinkCommands.GetContentByShortName);
requestByResponse.set(uplinkCommands.GetShortNameInfoResponse, downlinkCommands.GetShortNameInfo);
requestByResponse.set(uplinkCommands.GetShortNameProfileResponse, downlinkCommands.GetShortNameProfile);
requestByResponse.set(uplinkCommands.GetShortNamesResponse, downlinkCommands.GetShortNames);
requestByResponse.set(uplinkCommands.ReadArchiveResponse, downlinkCommands.ReadArchive);
requestByResponse.set(uplinkCommands.RebootResponse, downlinkCommands.Reboot);
requestByResponse.set(uplinkCommands.RemoveShortNameProfileResponse, downlinkCommands.RemoveShortNameProfile);
requestByResponse.set(uplinkCommands.SetArchiveProfileResponse, downlinkCommands.SetArchiveProfile);
requestByResponse.set(uplinkCommands.SetSerialPortResponse, downlinkCommands.SetSerialPort);
requestByResponse.set(uplinkCommands.SetShortNameResponse, downlinkCommands.SetShortName);

// invert keys with values
for ( const [key, value] of requestByResponse.entries() ) {
    responseByRequest.set(value, key);
}
