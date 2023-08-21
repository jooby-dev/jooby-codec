import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


export const requestByResponse = new Map();
export const responseByRequest = new Map();


requestByResponse.set(uplinkCommands.AddObisProfileResponse, downlinkCommands.AddObisProfile);
requestByResponse.set(uplinkCommands.GetArchiveProfileResponse, downlinkCommands.GetArchiveProfile);
requestByResponse.set(uplinkCommands.GetObisContentResponse, downlinkCommands.GetObisContent);
requestByResponse.set(uplinkCommands.GetObisContentByIdResponse, downlinkCommands.GetObisContentById);
requestByResponse.set(uplinkCommands.GetDeviceInfoResponse, downlinkCommands.GetDeviceInfo);
requestByResponse.set(uplinkCommands.GetLorawanInfoResponse, downlinkCommands.GetLorawanInfo);
requestByResponse.set(uplinkCommands.GetObisInfoResponse, downlinkCommands.GetObisInfo);
requestByResponse.set(uplinkCommands.GetObisProfileResponse, downlinkCommands.GetObisProfile);
requestByResponse.set(uplinkCommands.GetObisIdListResponse, downlinkCommands.GetObisIdList);
requestByResponse.set(uplinkCommands.ReadArchiveResponse, downlinkCommands.ReadArchive);
requestByResponse.set(uplinkCommands.RebootResponse, downlinkCommands.Reboot);
requestByResponse.set(uplinkCommands.RemoveObisProfileResponse, downlinkCommands.RemoveObisProfile);
requestByResponse.set(uplinkCommands.SetArchiveProfileResponse, downlinkCommands.SetArchiveProfile);
requestByResponse.set(uplinkCommands.SetSerialPortResponse, downlinkCommands.SetSerialPort);
requestByResponse.set(uplinkCommands.SetObisIdResponse, downlinkCommands.SetObisId);

// invert keys with values
for ( const [key, value] of requestByResponse.entries() ) {
    responseByRequest.set(value, key);
}
