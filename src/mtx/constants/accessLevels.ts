/**
 * Command access level.
 *
 * The `AccessLevel` field sets one of the 4 access levels.
 * For each access level the device determines the available set of commands and its encryption key for data encryption.
 *
 * @packageDocumentation
 */

/** no encryption is provided */
export const UNENCRYPTED = 0x00;

/** top security level */
export const ROOT = 0x01;

/** to set data */
export const READ_WRITE = 0x02;

/** to get data */
export const READ_ONLY = 0x03;
