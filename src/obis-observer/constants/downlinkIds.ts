export const getObserverInfo = 0x01; // 1
export const getObserverCapabilities = 0x03; // 3
export const getObserverUptime = 0x05; // 5
export const getSerialPort = 0x07; // 7
export const setSerialPort = 0x09; // 9
export const setObserverSingleMode = 0x0b; // 11
export const getObserverSingleMode = 0x0d; // 13
export const getArchiveState = 0x0f; // 15
export const readMeterArchive = 0x11; // 17
export const readMeterArchiveWithDate = 0x13; // 19
export const readArchive = 0x15; // 21
export const getLorawanInfo = 0x20; // 32
export const getLorawanState = 0x22; // 34
export const setLorawanActivationMethod = 0x24; // 36
export const reboot = 0x26; // 38
export const updateImageWrite = 0x30; // 48
export const updateImageVerify = 0x32; // 50
export const updateRun = 0x34; // 52
export const getObisIdList = 0x40; // 64
export const setupObis = 0x42; // 66
export const removeObis = 0x44; // 68
export const getObisInfo = 0x46; // 70
export const getObisContent = 0x4e; // 78
export const getObisContentById = 0x50; // 80
export const setupMeterProfile = 0x60; // 96
export const removeMeterProfile = 0x62; // 98
export const getMeterProfileIdList = 0x64; // 100
export const getMeterProfile = 0x66; // 102
export const setupMeter = 0x70; // 112
export const removeMeter = 0x72; // 114
export const getMeterIdList = 0x74; // 116
export const getMeterId = 0x76; // 118
export const getMeterInfo = 0x78; // 120
export const getMeterDate = 0x7a; // 122
export const getMeterReadoutState = 0x81; // 129
export const getSettingsMemory = 0x90; // 144
export const resetSettings = 0x92; // 146