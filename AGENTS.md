# jooby-codec

TypeScript ESM library (npm `jooby-codec`) that encodes and decodes Jooby device messages.

This file is the agent entry point. Cursor rules: `.cursor/rules/`.

This repo’s layout, `strict: false`, camelCase command files, `npm test`, and existing
`eslint-disable` / default exports are the source of truth. Do not reshape them to
generic Team / js-ts defaults (Makefile, kebab-case files, `strict: true`, testify).

## Role

Wire-format SSOT for the Jooby workspace. Sibling apps (`jooby-codec-adapters`, `jooby-rest-server`, `jooby-gui`) consume **published npm**, not `file:../jooby-codec`.

`jooby-docs` describes the wire; command `examples` are the hardware contract for tests. Do not “pretty” docs or strip TypeDoc examples as a drive-by.

Runtime dependency: **only `crypto-js`** (MTX AES-128-ECB, NoPadding). `TBytes` is `number[]` so Otto / QuickJS / TTN payload formatters can run the same logic.

## Layout

```
src/<protocol>/
  index.ts
  commands/{index.ts, downlink/, uplink/}
  constants/
  message/{index.ts, downlink.ts, uplink.ts, wrappers.ts?}
  utils/
```

`plc` adds `message/{modem,connection}/`. Root barrel (`src/index.ts`): `analog`, `analogUltrasound`, `mtx1`, `mtx3`, `obisObserver`, `utils`, `config`. **`plc` is not on the barrel.**

`src/` compiles with `include: src/**/*.ts`, so `dist/plc` exists. Wildcard `package.json` export `./*` can resolve it. Keep plc off the barrel and out of enumerated exports unless asked.

Low-level specs: [jooby-docs](https://github.com/jooby-dev/jooby-docs). API docs: TypeDoc (`npm run build:docs`). Generated HTML lives in `docs/` (gitignored) — do not put notes there.

## Protocols

| Namespace | Public | Message extras | Notes |
|---|---|---|---|
| analog | yes | LRC (XOR seed `0x55`) | Headers 1/2/3 bytes. `lastEvent` needs `{hardwareType}` on `fromBytes` / `toBytes` and on `message.fromBytes`. |
| analog-ultrasound | yes | `0xff 0xff` separators, no LRC | Nested in analog `usWaterMeterCommand.data`. Header BE (`size` + id); body LE. |
| mtx1 | yes | AES + LRC + pad-16 + `0x00` | Optional HDLC frame (`utils/frame` + MTX header). |
| mtx3 | yes | same as mtx1 | Overlay: re-export MTX1 when payload matches; native file when it differs. |
| obis-observer | yes | none | `[id, size, body]…`. Almost every command has `requestId`. |
| plc | no | frame → block → inner message | Can carry MTX. Pass `mtxType` (`mtx1` or `mtx3`) to `messageFromBlock` / `bytesFromMessage` (default `mtx1`). |

mtx-lora is **not** a namespace. Pipeline: MTX `message.toBytes` → analog `splitBytesToDataSegments` → analog `dataSegment` messages. See `mtx-lora.md`. `DataSegmentsCollector` / `splitBytesToDataSegments` are **deep imports**, not on `analog/utils/index.ts`.

## Command module

No classes. Each command file exports:

```ts
export const id, name, headerSize, examples
export const fromBytes = (body: TBytes, config?) => parameters  // body only
export const toBytes = (parameters?, config?) => TBytes         // header + body
```

Command ids are hardware-defined; do not invent sequential ids. File name === exported `name` (camelCase).

MTX also: `maxSize`, `accessLevel`, `isLoraOnly`. Optional `toJson` for DLMS names.

`examples` on the module are golden fixtures (hardware contract). Command tests roundtrip every example.

Ids live in `constants/{downlink,uplink}Ids.ts`. Names are `invertObject(ids)`.

## Adding a command

Checklist: `.cursor/rules/add-command.mdc`. In one change: module, folder `index.ts` re-export, id constant, **both** message maps, ≥1 `examples` entry. Matching uplink/downlink ids stay equal when both exist.

`tests/commands.consistency.test.ts` checks analog, analog-ultrasound, mtx1, mtx3, obis-observer, and plc.

## Invariants (do not “optimize” away)

- Explicit message maps (bundlers / NS JS engines)
- `number[]` + `BinaryBuffer` (not `Uint8Array` / `DataView`)
- `crypto-js` for MTX AES (not `node:crypto` / WebCrypto)
- Analog variable headers
- MTX3 overlay of MTX1
- Deep subpath exports are public API, including mtx-lora helpers
- `tsconfig` `strict: false` — do not flip in a feature PR
- Global `config.host.isLittleEndian` affects `BinaryBuffer` floats
- Keep existing `eslint-disable` and the `DataSegmentsCollector` default export

## Tests and tooling

- `npm test` = lint (`tsc` + eslint max-warnings 0) + **typedoc** + `jest --runInBand`
- Pre-commit hook runs full `npm test`
- Jest `rootDir` is `tests/`; `.js` imports map back to TS

## Known issues

See `.cursor/rules/known-issues.mdc`. Remaining defect: MTX `getToMessage` is an unimplemented TODO.
