// Protocol marker for a missing extended archive reading.
// Codecs expose missing readings as null; numeric 0 is a valid reading.
export const EMPTY_VALUE = 0xffffffff;

// Protocol marker for a missing legacy 24-bit archive reading.
export const LEGACY_EMPTY_VALUE = 0xffffff;
