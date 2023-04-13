import invertObject from '../helpers/invertObject.js';


export const meterCommandIds = {
    DATA_DAY: 0x20, // REQ_ON_DEMAND_RES
    DATA_HOURS_DIF: 0x40,
    LAST_EVENTS: 0x60,
    DELTA_TIME: 0x80,
    ABS_HOURS_DIFF: 0xA0,
    ABS_DATA_DAY: 0xC0,
    GET_CURRENT: 0x07,
    TIME_2000: 0x09,
    EVENTS: 0x0A,
    GET_VERSION: 0x11,
    NEW_STATUS: 0x14, // GET_NEW_STATUS
    NEW_EVENT: 0x15,
    DATA_DAY_MC: 0x16,
    DATA_HOURS_MC: 0x17,
    GET_CURRENT_MC: 0x18,
    MTX_CMD: 0x1E
};

export const meterCommandNames = invertObject(meterCommandIds);

export const downlinkCommandIds = {
    REQ_ON_DEMAND_RES: 0x20, // DATA_DAY
    GET_STATUS: 0x01,
    SET_TIME_2000: 0x02,
    SET_PARAMETERS: 0x03,
    GET_PARAMETERS: 0x04,
    GET_ARCHIVE_HOURS: 0x05,
    GET_ARCHIVE_DAYS: 0x06,
    GET_LAST_DAY: 0x08,
    GET_ARCHIVE_EVENTS: 0x0B,
    CORRECT_TIME2000: 0x0C,
    GET_NEW_STATUS: 0x14, // NEW_STATUS
    SOFT_RESTART: 0x19,
    GET_ARCHIVE_HOURS_MC: 0x1A,
    GET_ARCHIVE_DAYS_MC: 0x1B,
    CLEAR_ACTIVE_CHANNEL: 0x1C,
    CLEAR_PARAMETERS: 0x1D,
    CMD_EX_GET_KEY: 0x011F,
    GET_LMIC_VERSION: 0x021F,
    GET_ABS_ARCHIVE_HOURS: 0x031F,
    GET_ABS_ARCHIVE_DAYS: 0x041F,
    GET_BATTERY_STATUS: 0x051F,
    GO_DEPASS_BATTERY: 0x061F,
    WATER_CMD: 0x071F,
    GET_COMPILE_TIME: 0x081F,
    ABS_HOURS_MC: 0x0A1F,
    ABS_DAY_MC: 0x0B1F,
    ABS_ARX_HOURS_MC: 0x0C1F,
    ABS_ARX_DAY_MC: 0x0D1F,
    ABS_CURRENT: 0x0E1F,
    ABS_CURRENT_MC: 0x0F1F
};

export const downlinkCommandNames = invertObject(downlinkCommandIds);
