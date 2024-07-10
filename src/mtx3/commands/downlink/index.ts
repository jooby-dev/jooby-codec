/**
 * All downlink commands.
 *
 * @packageDocumentation
 */

// commands identical to MTX1
export * as activateRatePlan from '../../../mtx/commands/downlink/activateRatePlan.js';
export * as getBuildVersion from '../../../mtx/commands/downlink/getBuildVersion.js';
export * as getCorrectTime from '../../../mtx/commands/downlink/getCorrectTime.js';
export * as getCurrentStatusMeter from '../../../mtx/commands/downlink/getCurrentStatusMeter.js';
export * as getCurrentValues from '../../../mtx/commands/downlink/getCurrentValues.js';
export * as getDateTime from '../../../mtx/commands/downlink/getDateTime.js';
export * as getDayMaxDemandExport from '../../../mtx/commands/downlink/getDayMaxDemandExport.js';
export * as getDayProfile from '../../../mtx/commands/downlink/getDayProfile.js';
export * as getDeviceId from '../../../mtx/commands/downlink/getDeviceId.js';
export * as getDeviceType from '../../../mtx/commands/downlink/getDeviceType.js';
export * as getEvents from '../../../mtx/commands/downlink/getEvents.js';
export * as getEventsCounters from '../../../mtx/commands/downlink/getEventsCounters.js';
export * as getEventStatus from '../../../mtx/commands/downlink/getEventStatus.js';
export * as getExtendedCurrentValues from '../../../mtx/commands/downlink/getExtendedCurrentValues.js';
export * as getHalfHourDemand from '../../../mtx/commands/downlink/getHalfHourDemand.js';
export * as getHalfhoursEnergies from '../../../mtx/commands/downlink/getHalfhoursEnergies.js';
export * as getMagneticFieldThreshold from '../../../mtx/commands/downlink/getMagneticFieldThreshold.js';
export * as getMonthDemand from '../../../mtx/commands/downlink/getMonthDemand.js';
export * as getOperatorParameters from '../../../mtx/commands/downlink/getOperatorParameters.js';
export * as getRatePlanInfo from '../../../mtx/commands/downlink/getRatePlanInfo.js';
export * as getSaldo from '../../../mtx/commands/downlink/getSaldo.js';
export * as getSaldoParameters from '../../../mtx/commands/downlink/getSaldoParameters.js';
export * as getSeasonProfile from '../../../mtx/commands/downlink/getSeasonProfile.js';
export * as getSpecialDay from '../../../mtx/commands/downlink/getSpecialDay.js';
export * as getVersion from '../../../mtx/commands/downlink/getVersion.js';
export * as prepareRatePlan from '../../../mtx/commands/downlink/prepareRatePlan.js';
export * as resetPowerMaxDay from '../../../mtx/commands/downlink/resetPowerMaxDay.js';
export * as resetPowerMaxMonth from '../../../mtx/commands/downlink/resetPowerMaxMonth.js';
export * as runTariffPlan from '../../../mtx/commands/downlink/runTariffPlan.js';
export * as setAccessKey from '../../../mtx/commands/downlink/setAccessKey.js';
export * as setCorrectDateTime from '../../../mtx/commands/downlink/setCorrectDateTime.js';
export * as setCorrectTime from '../../../mtx/commands/downlink/setCorrectTime.js';
export * as setDateTime from '../../../mtx/commands/downlink/setDateTime.js';
export * as setDayProfile from '../../../mtx/commands/downlink/setDayProfile.js';
export * as setSaldo from '../../../mtx/commands/downlink/setSaldo.js';
export * as setSaldoParameters from '../../../mtx/commands/downlink/setSaldoParameters.js';
export * as setSeasonProfile from '../../../mtx/commands/downlink/setSeasonProfile.js';
export * as setSpecialDay from '../../../mtx/commands/downlink/setSpecialDay.js';
export * as setSpecialOperation from '../../../mtx/commands/downlink/setSpecialOperation.js';
export * as turnRelayOff from '../../../mtx/commands/downlink/turnRelayOff.js';
export * as turnRelayOn from '../../../mtx/commands/downlink/turnRelayOn.js';


// commands different from MTX1
export * as getCriticalEvent from './getCriticalEvent.js';
export * as getDayDemand from './getDayDemand.js';
export * as getDayDemandExport from './getDayDemandExport.js';
export * as getDisplayParam from './getDisplayParam.js';
export * as getEnergy from './getEnergy.js';
export * as getEnergyDayPrevious from './getEnergyDayPrevious.js';
export * as getEnergyExport from './getEnergyExport.js';
export * as getHalfHourDemandVare from './getHalfHourDemandVare.js';
export * as getHalfHourDemandVari from './getHalfHourDemandVari.js';
export * as getOperatorParametersExtended from './getOperatorParametersExtended.js';
export * as setDisplayParam from './setDisplayParam.js';
export * as setOperatorParameters from './setOperatorParameters.js';
export * as setOperatorParametersExtended from './setOperatorParametersExtended.js';
