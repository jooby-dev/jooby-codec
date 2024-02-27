/**
 * Helper to create special branded types from primitives.
 *
 * https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
 */
export type BrandType<K, T> = K & {info?: T};

/**
 * Unsigned integer number (1 byte).
 *
 * @example
 * [0..255]
 */
export type TUint8 = BrandType<number, 'uint8'>;

/**
 * Unsigned integer number (2 bytes).
 *
 * @example
 * [0..65535]
 */
export type TUint16 = BrandType<number, 'uint16'>;

/**
 * Unsigned integer number (4 bytes).
 *
 * @example
 * [0..4294967295]
 */
export type TUint32 = BrandType<number, 'uint32'>;

/**
 * Signed integer number (1 byte).
 *
 * @example
 * [-128..127]
 */
export type TInt8 = BrandType<number, 'int8'>;

/**
 * Signed integer number (2 bytes).
 *
 * @example
 * [-32768..32767]
 */
export type TInt16 = BrandType<number, 'int16'>;

/**
 * Signed integer number (4 bytes).
 *
 * @example
 * [-2147483648..2147483647]
 */
export type TInt32 = BrandType<number, 'int32'>;

/**
 * Number of years after the year `2000` (1 byte).
 *
 * @example
 * value 24 corresponds to 2000 + 24 = 2024
 */
export type TYear2000 = BrandType<number, 'year'>;

/**
 * Month number (1 byte).
 *
 * @example
 * 1 - January ... 12 - December
 */
export type TMonth = BrandType<number, 'month'>;

/**
 * Month day number which starts from `1` (1 byte).
 */
export type TMonthDay = BrandType<number, 'monthDay'>;

/**
 * Week day number which starts from `1` (1 byte).
 *
 * @example
 * 1 - Sunday ... 7 - Saturday
 */
export type TWeekDay = BrandType<number, 'weekDay'>;
