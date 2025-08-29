/**
 * All uplink commands.
 *
 * @packageDocumentation
 */

// commands identical to MTX1
export * as activateRatePlan from '../../../mtx1/commands/uplink/activateRatePlan.js';
export * as getBuildVersion from '../../../mtx1/commands/uplink/getBuildVersion.js';
export * as getCorrectTime from '../../../mtx1/commands/uplink/getCorrectTime.js';
export * as getDateTime from '../../../mtx1/commands/uplink/getDateTime.js';
export * as getDayEnergies from '../../../mtx1/commands/uplink/getDayEnergies.js';
export * as getDayProfile from '../../../mtx1/commands/uplink/getDayProfile.js';
export * as getDeviceId from '../../../mtx1/commands/uplink/getDeviceId.js';
export * as getDeviceType from '../../../mtx1/commands/uplink/getDeviceType.js';
export * as getEvents from '../../../mtx1/commands/uplink/getEvents.js';
export * as getEventsCounters from '../../../mtx1/commands/uplink/getEventsCounters.js';
export * as getEventStatus from '../../../mtx1/commands/uplink/getEventStatus.js';
export * as getMagneticFieldThreshold from '../../../mtx1/commands/uplink/getMagneticFieldThreshold.js';
export * as getMeterInfo from '../../../mtx1/commands/uplink/getMeterInfo.js';
export * as getOperatorParametersExtended3 from '../../../mtx1/commands/uplink/getOperatorParametersExtended3.js';
export * as getRatePlanInfo from '../../../mtx1/commands/uplink/getRatePlanInfo.js';
export * as getSaldo from '../../../mtx1/commands/uplink/getSaldo.js';
export * as getSaldoParameters from '../../../mtx1/commands/uplink/getSaldoParameters.js';
export * as getSeasonProfile from '../../../mtx1/commands/uplink/getSeasonProfile.js';
export * as getSpecialDay from '../../../mtx1/commands/uplink/getSpecialDay.js';
export * as getVersion from '../../../mtx1/commands/uplink/getVersion.js';
export * as prepareRatePlan from '../../../mtx1/commands/uplink/prepareRatePlan.js';
export * as resetPowerMaxDay from '../../../mtx1/commands/uplink/resetPowerMaxDay.js';
export * as resetPowerMaxMonth from '../../../mtx1/commands/uplink/resetPowerMaxMonth.js';
export * as runTariffPlan from '../../../mtx1/commands/uplink/runTariffPlan.js';
export * as setAccessKey from '../../../mtx1/commands/uplink/setAccessKey.js';
export * as setCorrectDateTime from '../../../mtx1/commands/uplink/setCorrectDateTime.js';
export * as setCorrectTime from '../../../mtx1/commands/uplink/setCorrectTime.js';
export * as setDateTime from '../../../mtx1/commands/uplink/setDateTime.js';
export * as setDayProfile from '../../../mtx1/commands/uplink/setDayProfile.js';
export * as setDisplayParam from '../../../mtx1/commands/uplink/setDisplayParam.js';
export * as setOperatorParameters from '../../../mtx1/commands/uplink/setOperatorParameters.js';
export * as setOperatorParametersExtended3 from '../../../mtx1/commands/uplink/setOperatorParametersExtended3.js';
export * as setSaldo from '../../../mtx1/commands/uplink/setSaldo.js';
export * as setSaldoParameters from '../../../mtx1/commands/uplink/setSaldoParameters.js';
export * as setSeasonProfile from '../../../mtx1/commands/uplink/setSeasonProfile.js';
export * as setSpecialDay from '../../../mtx1/commands/uplink/setSpecialDay.js';
export * as setSpecialOperation from '../../../mtx1/commands/uplink/setSpecialOperation.js';
export * as turnRelayOff from '../../../mtx1/commands/uplink/turnRelayOff.js';
export * as turnRelayOn from '../../../mtx1/commands/uplink/turnRelayOn.js';


// commands different from MTX1
export * as errorResponse from './errorResponse.js';
export * as getCriticalEvent from './getCriticalEvent.js';
export * as getCurrentStatusMeter from './getCurrentStatusMeter.js';
export * as getCurrentValues from './getCurrentValues.js';
export * as getDayDemand from './getDayDemand.js';
export * as getDayDemandExport from './getDayDemandExport.js';
export * as getDayMaxDemand from './getDayMaxDemand.js';
export * as getDayMaxDemandExport from './getDayMaxDemandExport.js';
export * as getDemand from './getDemand.js';
export * as getDisplayParam from './getDisplayParam.js';
export * as getEnergy from './getEnergy.js';
export * as getEnergyDayPrevious from './getEnergyDayPrevious.js';
export * as getEnergyExport from './getEnergyExport.js';
export * as getEnergyExportDayPrevious from './getEnergyExportDayPrevious.js';
export * as getExtendedCurrentValues from './getExtendedCurrentValues.js';
export * as getHalfHourDemand from './getHalfHourDemand.js';
export * as getHalfHourDemandChannel from './getHalfHourDemandChannel.js';
export * as getHalfHourDemandExport from './getHalfHourDemandExport.js';
export * as getHalfHourDemandVare from './getHalfHourDemandVare.js';
export * as getHalfHourDemandVareExport from './getHalfHourDemandVareExport.js';
export * as getHalfHourDemandVari from './getHalfHourDemandVari.js';
export * as getHalfHourDemandVariExport from './getHalfHourDemandVariExport.js';
export * as getHalfHourEnergies from './getHalfHourEnergies.js';
export * as getMonthDemand from './getMonthDemand.js';
export * as getMonthDemandExport from './getMonthDemandExport.js';
export * as getMonthMaxDemand from './getMonthMaxDemand.js';
export * as getMonthMaxDemandExport from './getMonthMaxDemandExport.js';
export * as getOperatorParameters from './getOperatorParameters.js';
export * as getOperatorParametersExtended from './getOperatorParametersExtended.js';
export * as getOperatorParametersExtended2 from './getOperatorParametersExtended2.js';
export * as getOperatorParametersExtended4 from './getOperatorParametersExtended4.js';
export * as setOperatorParametersExtended from './setOperatorParametersExtended.js';
export * as setOperatorParametersExtended2 from './setOperatorParametersExtended2.js';
export * as setOperatorParametersExtended4 from './setOperatorParametersExtended4.js';
