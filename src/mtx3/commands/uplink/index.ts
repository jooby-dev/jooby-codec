/**
 * All uplink commands.
 *
 * @packageDocumentation
 */

// commands identical to MTX1
export * as activateRatePlan from '../../../mtx/commands/uplink/activateRatePlan.js';
export * as getBuildVersion from '../../../mtx/commands/uplink/getBuildVersion.js';
export * as getCorrectTime from '../../../mtx/commands/uplink/getCorrectTime.js';
export * as getDateTime from '../../../mtx/commands/uplink/getDateTime.js';
export * as getDayProfile from '../../../mtx/commands/uplink/getDayProfile.js';
export * as getDeviceId from '../../../mtx/commands/uplink/getDeviceId.js';
export * as getDeviceType from '../../../mtx/commands/uplink/getDeviceType.js';
export * as getEvents from '../../../mtx/commands/uplink/getEvents.js';
export * as getEventsCounters from '../../../mtx/commands/uplink/getEventsCounters.js';
export * as getEventStatus from '../../../mtx/commands/uplink/getEventStatus.js';
export * as getHalfhoursEnergies from '../../../mtx/commands/uplink/getHalfhoursEnergies.js';
export * as getMagneticFieldThreshold from '../../../mtx/commands/uplink/getMagneticFieldThreshold.js';
export * as getRatePlanInfo from '../../../mtx/commands/uplink/getRatePlanInfo.js';
export * as getSaldo from '../../../mtx/commands/uplink/getSaldo.js';
export * as getSaldoParameters from '../../../mtx/commands/uplink/getSaldoParameters.js';
export * as getSeasonProfile from '../../../mtx/commands/uplink/getSeasonProfile.js';
export * as getSpecialDay from '../../../mtx/commands/uplink/getSpecialDay.js';
export * as getVersion from '../../../mtx/commands/uplink/getVersion.js';
export * as prepareRatePlan from '../../../mtx/commands/uplink/prepareRatePlan.js';
export * as resetPowerMaxDay from '../../../mtx/commands/uplink/resetPowerMaxDay.js';
export * as resetPowerMaxMonth from '../../../mtx/commands/uplink/resetPowerMaxMonth.js';
export * as runTariffPlan from '../../../mtx/commands/uplink/runTariffPlan.js';
export * as setAccessKey from '../../../mtx/commands/uplink/setAccessKey.js';
export * as setCorrectDateTime from '../../../mtx/commands/uplink/setCorrectDateTime.js';
export * as setCorrectTime from '../../../mtx/commands/uplink/setCorrectTime.js';
export * as setDateTime from '../../../mtx/commands/uplink/setDateTime.js';
export * as setDayProfile from '../../../mtx/commands/uplink/setDayProfile.js';
export * as setDisplayParam from '../../../mtx/commands/uplink/setDisplayParam.js';
export * as setOperatorParameters from '../../../mtx/commands/uplink/setOperatorParameters.js';
export * as setSaldo from '../../../mtx/commands/uplink/setSaldo.js';
export * as setSaldoParameters from '../../../mtx/commands/uplink/setSaldoParameters.js';
export * as setSeasonProfile from '../../../mtx/commands/uplink/setSeasonProfile.js';
export * as setSpecialDay from '../../../mtx/commands/uplink/setSpecialDay.js';
export * as setSpecialOperation from '../../../mtx/commands/uplink/setSpecialOperation.js';
export * as turnRelayOff from '../../../mtx/commands/uplink/turnRelayOff.js';
export * as turnRelayOn from '../../../mtx/commands/uplink/turnRelayOn.js';


// commands different from MTX1
export * as getCriticalEvent from './getCriticalEvent.js';
export * as getCurrentStatusMeter from './getCurrentStatusMeter.js';
export * as getCurrentValues from './getCurrentValues.js';
export * as getDayDemand from './getDayDemand.js';
export * as getDayDemandExport from './getDayDemandExport.js';
export * as getDayMaxDemandExport from './getDayMaxDemandExport.js';
export * as getDisplayParam from './getDisplayParam.js';
export * as getEnergy from './getEnergy.js';
export * as getEnergyDayPrevious from './getEnergyDayPrevious.js';
export * as getEnergyExport from './getEnergyExport.js';
export * as getEnergyExportDayPrevious from './getEnergyExportDayPrevious.js';
export * as getExtendedCurrentValues from './getExtendedCurrentValues.js';
export * as getHalfHourDemand from './getHalfHourDemand.js';
export * as getHalfHourDemandExport from './getHalfHourDemandExport.js';
export * as getHalfHourDemandVare from './getHalfHourDemandVare.js';
export * as getHalfHourDemandVareExport from './getHalfHourDemandVareExport.js';
export * as getHalfHourDemandVari from './getHalfHourDemandVari.js';
export * as getHalfHourDemandVariExport from './getHalfHourDemandVariExport.js';
export * as getMonthDemand from './getMonthDemand.js';
export * as getMonthDemandExport from './getMonthDemandExport.js';
export * as getMonthMaxDemandExport from './getMonthMaxDemandExport.js';
export * as getOperatorParameters from './getOperatorParameters.js';
export * as getOperatorParametersExtended from './getOperatorParametersExtended.js';
export * as setOperatorParametersExtended from './setOperatorParametersExtended.js';
