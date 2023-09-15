/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map();
export const responseById = new Map();


requestByResponse.set(uplinkCommands.AddMeterProfileResponse, downlinkCommands.AddMeterProfile);
requestByResponse.set(uplinkCommands.AddObisProfileResponse, downlinkCommands.AddObisProfile);
requestByResponse.set(uplinkCommands.GetArchiveStateResponse, downlinkCommands.GetArchiveState);
requestByResponse.set(uplinkCommands.GetLorawanInfoResponse, downlinkCommands.GetLorawanInfo);
requestByResponse.set(uplinkCommands.GetMeterArchiveProfileResponse, downlinkCommands.GetMeterArchiveProfile);
requestByResponse.set(uplinkCommands.GetMeterDateResponse, downlinkCommands.GetMeterDate);
requestByResponse.set(uplinkCommands.GetMeterIdListResponse, downlinkCommands.GetMeterIdList);
requestByResponse.set(uplinkCommands.GetMeterIdResponse, downlinkCommands.GetMeterId);
requestByResponse.set(uplinkCommands.GetMeterInfoResponse, downlinkCommands.GetMeterInfo);
requestByResponse.set(uplinkCommands.GetMeterProfileIdListResponse, downlinkCommands.GetMeterProfileIdList);
requestByResponse.set(uplinkCommands.GetMeterReadoutStateResponse, downlinkCommands.GetMeterReadoutState);
requestByResponse.set(uplinkCommands.GetObisContentByIdResponse, downlinkCommands.GetObisContentById);
requestByResponse.set(uplinkCommands.GetObisContentResponse, downlinkCommands.GetObisContent);
requestByResponse.set(uplinkCommands.GetObisIdListResponse, downlinkCommands.GetObisIdList);
requestByResponse.set(uplinkCommands.GetObisInfoListResponse, downlinkCommands.GetObisInfoList);
requestByResponse.set(uplinkCommands.GetObisInfoResponse, downlinkCommands.GetObisInfo);
requestByResponse.set(uplinkCommands.GetObisProfileResponse, downlinkCommands.GetObisProfile);
requestByResponse.set(uplinkCommands.GetObserverCapabilitiesResponse, downlinkCommands.GetObserverCapabilities);
requestByResponse.set(uplinkCommands.GetObserverInfoResponse, downlinkCommands.GetObserverInfo);
requestByResponse.set(uplinkCommands.GetObserverSingleModeResponse, downlinkCommands.GetObserverSingleMode);
requestByResponse.set(uplinkCommands.GetObserverUptimeResponse, downlinkCommands.GetObserverUptime);
requestByResponse.set(uplinkCommands.ReadMeterArchiveResponse, downlinkCommands.ReadMeterArchive);
requestByResponse.set(uplinkCommands.ReadMeterArchiveWithDateResponse, downlinkCommands.ReadMeterArchiveWithDate);
requestByResponse.set(uplinkCommands.RebootResponse, downlinkCommands.Reboot);
requestByResponse.set(uplinkCommands.RemoveMeterProfileResponse, downlinkCommands.RemoveMeterProfile);
requestByResponse.set(uplinkCommands.RemoveMeterResponse, downlinkCommands.RemoveMeter);
requestByResponse.set(uplinkCommands.RemoveObisProfileResponse, downlinkCommands.RemoveObisProfile);
requestByResponse.set(uplinkCommands.SetLorawanActivationMethodResponse, downlinkCommands.SetLorawanActivationMethod);
requestByResponse.set(uplinkCommands.SetMeterArchiveProfileResponse, downlinkCommands.SetMeterArchiveProfile);
requestByResponse.set(uplinkCommands.SetObisIdResponse, downlinkCommands.SetObisId);
requestByResponse.set(uplinkCommands.SetObserverSingleModeResponse, downlinkCommands.SetObserverSingleMode);
requestByResponse.set(uplinkCommands.SetSerialPortResponse, downlinkCommands.SetSerialPort);
requestByResponse.set(uplinkCommands.SetupMeterResponse, downlinkCommands.SetupMeter);
requestByResponse.set(uplinkCommands.UpdateImageVerifyResponse, downlinkCommands.UpdateImageVerify);
requestByResponse.set(uplinkCommands.UpdateImageWriteResponse, downlinkCommands.UpdateImageWrite);
requestByResponse.set(uplinkCommands.UpdateRunResponse, downlinkCommands.UpdateRun);

for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
    // fill id to constructor dictionaries
    responseById.set(response.id, response);
    requestById.set(request.id, request);
}
