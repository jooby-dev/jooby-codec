/**
 * A command is a part of a device message.
 *
 * @packageDocumentation
 *
 * Command format:
 *
 * <table>
 *     <tbody>
 *         <tr align="center">
 *             <td>command id</td>
 *         </tr>
 *         <tr align="center">
 *             <td>command data size</td>
 *         </tr>
 *         <tr align="center">
 *             <td>command data</td>
 *         </tr>
 *     </tbody>
 * </table>
 */

export * as downlink from './downlink/index.js';
export * as uplink from './uplink/index.js';
