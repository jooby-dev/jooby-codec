/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


// constructor to constructor
export const requestByResponse = new Map();
export const responseByRequest = new Map();

// id to constructor
export const requestById = new Map(Object.values(downlinkCommands).map(command => [command.id, command]));
export const responseById = new Map(Object.values(uplinkCommands).map(command => [command.id, command]));


requestByResponse.set(uplinkCommands.GetArchiveStateResponse, downlinkCommands.GetArchiveState);
requestByResponse.set(uplinkCommands.GetLorawanInfoResponse, downlinkCommands.GetLorawanInfo);
requestByResponse.set(uplinkCommands.GetMeterDateResponse, downlinkCommands.GetMeterDate);
requestByResponse.set(uplinkCommands.GetMeterIdListResponse, downlinkCommands.GetMeterIdList);
requestByResponse.set(uplinkCommands.GetMeterIdResponse, downlinkCommands.GetMeterId);
requestByResponse.set(uplinkCommands.GetMeterInfoResponse, downlinkCommands.GetMeterInfo);
requestByResponse.set(uplinkCommands.GetMeterProfileIdListResponse, downlinkCommands.GetMeterProfileIdList);
requestByResponse.set(uplinkCommands.GetMeterProfileResponse, downlinkCommands.GetMeterProfile);
requestByResponse.set(uplinkCommands.GetMeterReadoutStateResponse, downlinkCommands.GetMeterReadoutState);
requestByResponse.set(uplinkCommands.GetObisContentByIdResponse, downlinkCommands.GetObisContentById);
requestByResponse.set(uplinkCommands.GetObisContentResponse, downlinkCommands.GetObisContent);
requestByResponse.set(uplinkCommands.GetObisIdListResponse, downlinkCommands.GetObisIdList);
requestByResponse.set(uplinkCommands.GetObisInfoResponse, downlinkCommands.GetObisInfo);
requestByResponse.set(uplinkCommands.GetObserverCapabilitiesResponse, downlinkCommands.GetObserverCapabilities);
requestByResponse.set(uplinkCommands.GetObserverInfoResponse, downlinkCommands.GetObserverInfo);
requestByResponse.set(uplinkCommands.GetObserverSingleModeResponse, downlinkCommands.GetObserverSingleMode);
requestByResponse.set(uplinkCommands.GetObserverUptimeResponse, downlinkCommands.GetObserverUptime);
requestByResponse.set(uplinkCommands.GetSerialPortResponse, downlinkCommands.GetSerialPort);
requestByResponse.set(uplinkCommands.GetSettingsMemoryResponse, downlinkCommands.GetSettingsMemory);
requestByResponse.set(uplinkCommands.ReadArchiveResponse, downlinkCommands.ReadArchive);
requestByResponse.set(uplinkCommands.ReadMeterArchiveResponse, downlinkCommands.ReadMeterArchive);
requestByResponse.set(uplinkCommands.ReadMeterArchiveWithDateResponse, downlinkCommands.ReadMeterArchiveWithDate);
requestByResponse.set(uplinkCommands.RebootResponse, downlinkCommands.Reboot);
requestByResponse.set(uplinkCommands.RemoveMeterProfileResponse, downlinkCommands.RemoveMeterProfile);
requestByResponse.set(uplinkCommands.RemoveMeterResponse, downlinkCommands.RemoveMeter);
requestByResponse.set(uplinkCommands.RemoveObisResponse, downlinkCommands.RemoveObis);
requestByResponse.set(uplinkCommands.ResetSettingsResponse, downlinkCommands.ResetSettings);
requestByResponse.set(uplinkCommands.SetLorawanActivationMethodResponse, downlinkCommands.SetLorawanActivationMethod);
requestByResponse.set(uplinkCommands.SetObserverSingleModeResponse, downlinkCommands.SetObserverSingleMode);
requestByResponse.set(uplinkCommands.SetSerialPortResponse, downlinkCommands.SetSerialPort);
requestByResponse.set(uplinkCommands.SetupMeterProfileResponse, downlinkCommands.SetupMeterProfile);
requestByResponse.set(uplinkCommands.SetupMeterResponse, downlinkCommands.SetupMeter);
requestByResponse.set(uplinkCommands.SetupObisResponse, downlinkCommands.SetupObis);
requestByResponse.set(uplinkCommands.UpdateImageVerifyResponse, downlinkCommands.UpdateImageVerify);
requestByResponse.set(uplinkCommands.UpdateImageWriteResponse, downlinkCommands.UpdateImageWrite);
requestByResponse.set(uplinkCommands.UpdateRunResponse, downlinkCommands.UpdateRun);

for ( const [response, request] of requestByResponse.entries() ) {
    // invert keys with values
    responseByRequest.set(request, response);
}
