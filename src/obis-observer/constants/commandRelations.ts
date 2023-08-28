import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';


export const requestByResponse = new Map();
export const responseByRequest = new Map();


requestByResponse.set(uplinkCommands.AddMeterProfileResponse, downlinkCommands.AddMeterProfile);
requestByResponse.set(uplinkCommands.AddObisProfileResponse, downlinkCommands.AddObisProfile);
requestByResponse.set(uplinkCommands.GetLorawanInfoResponse, downlinkCommands.GetLorawanInfo);
requestByResponse.set(uplinkCommands.GetMeterArchiveProfileResponse, downlinkCommands.GetMeterArchiveProfile);
requestByResponse.set(uplinkCommands.GetMeterDateResponse, downlinkCommands.GetMeterDate);
requestByResponse.set(uplinkCommands.GetMeterIdResponse, downlinkCommands.GetMeterId);
requestByResponse.set(uplinkCommands.GetMeterInfoResponse, downlinkCommands.GetMeterInfo);
requestByResponse.set(uplinkCommands.GetMeterProfileIdListResponse, downlinkCommands.GetMeterProfileIdList);
requestByResponse.set(uplinkCommands.GetObisContentByIdResponse, downlinkCommands.GetObisContentById);
requestByResponse.set(uplinkCommands.GetObisContentResponse, downlinkCommands.GetObisContent);
requestByResponse.set(uplinkCommands.GetObisIdListResponse, downlinkCommands.GetObisIdList);
requestByResponse.set(uplinkCommands.GetObisInfoResponse, downlinkCommands.GetObisInfo);
requestByResponse.set(uplinkCommands.GetObisProfileResponse, downlinkCommands.GetObisProfile);
requestByResponse.set(uplinkCommands.GetObserverCapabilitiesResponse, downlinkCommands.GetObserverCapabilities);
requestByResponse.set(uplinkCommands.GetObserverInfoResponse, downlinkCommands.GetObserverInfo);
requestByResponse.set(uplinkCommands.GetObserverSingleModeResponse, downlinkCommands.GetObserverSingleMode);
requestByResponse.set(uplinkCommands.GetObserverUptimeResponse, downlinkCommands.GetObserverUptime);
requestByResponse.set(uplinkCommands.GetReadoutStateResponse, downlinkCommands.GetReadoutState);
requestByResponse.set(uplinkCommands.ReadMeterArchiveResponse, downlinkCommands.ReadMeterArchive);
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

// invert keys with values
for ( const [key, value] of requestByResponse.entries() ) {
    responseByRequest.set(value, key);
}
