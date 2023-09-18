import * as result from './resultCodes.js';

export default {
    [result.FAILURE]: 'General failure',
    [result.UNKNOWN_COMMAND]: 'Unknown command',
    [result.FORMAT_ERROR]: 'Format error',
    [result.ASSIGN_STATIC_OBIS_ID]: 'Try to assign static obis id',
    [result.OBIS_ID_ALLOCATION_FAILED]: 'Obis id allocation failed',
    [result.OBIS_PROFILE_ALLOCATION_FAILED]: 'Obis profile allocation failed',
    [result.METER_ALLOCATION_FAILED]: 'Meter allocation failed',
    [result.METER_NOT_FOUND]: 'The meter not found',
    [result.METER_PROFILE_ALLOCATION_FAILED]: 'Meter profile allocation failed',
    [result.METER_PROFILE_NOT_FOUND]: 'The meter profile not found',
    [result.METER_PROFILE_EXISTS]: 'The meter profile already exists',
    [result.SINGLE_MODE]: 'The single/multi meter mode collision',
    [result.MULTI_MODE_UNSUPPORTED]: 'Multi meter mode are unsupported'
};
