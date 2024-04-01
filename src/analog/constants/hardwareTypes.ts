/**
 * Gas RM based on CPU STM32L15x (no longer in production).
 *
 * Models:
 * Jooby RM GM-E
 * Jooby RM GM-M
 */
export const GASI1 = 1;

/**
 * Gas RM based on CPU STM32L05x (no longer in production).
 *
 * Models:
 * Jooby RM GM-E
 */
export const GASI2 = 2;

/**
 * Gas RM based on CPU STM32L05x.
 *
 * Models:
 * Jooby RM GM-E
 * Jooby RM GM-M
 * Jooby RM GM-S
 * Jooby RM GM-E_ext
 * Jooby RM GM-M_ext
 * Jooby EPHIR RMS LoRaWAN GMSG10 105 EU
 */
export const GASI3 = 3;

/**
 * RM for Novator based on CPU STM32WLE5.
 * 2 channels
 *
 * Models:
 * Jooby RM O-WM-N
 * Jooby Aquaris RMS LoRaWAN WONO10 203 EU
 */
export const NOVATOR = 4;

/**
 * RM with 2 pulse input ports based on CPU STM32L051 (no longer in production).
 * 2 channels
 */
export const IMP2EU = 5;

/**
 * RM with 4 ports, EU868. Based on CPU STM32WLE5.
 * 4 channels
 *
 * Models:
 * Jooby RM 4PI
 * Jooby OMNI RM LoRaWAN 4PI 200 EU
 * Jooby OMNI RM LoRaWAN 4PI 202 EU
 */
export const IMP4EU = 6;

/**
 * RM installed inside MTX meters.
 * Based on STM32L051, STM32L071 (no longer in production) and STM32WLE5.
 */
export const MTXLORA = 7;

/**
 * RM with 2 ports for the Asian region, AS923 (no longer in production).
 *
 * 2 channels
 */
export const IMP2AS = 8;

/**
 * RM with 2 ports for the Indian region, IN865 (no longer in production).
 *
 * 2 channels
 */
export const IMP2IN = 9;

/**
 * RM with 4 ports for the Indian region, IN865 (no longer in production).
 *
 * 4 channels
 */
export const IMP4IN = 10;

/**
 * Single-port module with supply 220V. Class C. Based on CPU STM32WLE5.
 * 1 channel
 *
 * Models:
 * Jooby ELECTRA RM LoRaWAN 1PI 100 EU
 */
export const ELIMP = 11;

/**
 * Gas RM based on CPU STM32WLE5.
 *
 * Models:
 * Jooby RM GM-E
 * Jooby EPHIR RMS LoRaWAN GMEL10 100 EU
 * Jooby RM GM-M
 * Jooby EPHIR RMS LoRaWAN GMME10 103 EU
 * Jooby RM GM-E_ext
 * Jooby EPHIR RMS LoRaWAN GMEL10 102 EU
 * Jooby EPHIR RMS LoRaWAN GMEL10 106 EU
 * Jooby RM GM-M_ext
 * Jooby EPHIR RMS LoRaWAN GMME10 104 EU
 * Jooby EPHIR RMS LoRaWAN GMME10 107 EU
 */
export const GASIC = 12;

/**
 * RM with 4 ports for the Asian region, AS923.
 * 4 channels
 *
 * Models:
 * Jooby RM 4PI
 * Jooby OMNI RM LoRaWAN 4PI 200 AS
 * Jooby OMNI RM LoRaWAN 4PI 202 AS
 */
export const IMP4AS = 15;

/**
 * NBIOT GAS module based on CPU STM32WLE5.
 * 1 channel
 *
 */
export const NBIOT = 24;
