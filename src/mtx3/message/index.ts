/**
 * Main interface to build and parse device messages.
 *
 * @packageDocumentation
 *
 * Devices send and receive messages in the following format:
 *
 * <table>
 *     <tbody>
 *         <tr align="center">
 *             <td>command 1</td>
 *         </tr>
 *         <tr align="center">
 *             <td>command 2</td>
 *         </tr>
 *         <tr align="center">
 *             <td>...</td>
 *         </tr>
 *         <tr align="center">
 *             <td>command N</td>
 *         </tr>
 *     </tbody>
 * </table>
 */

export * as downlink from './downlink.js';
export * as uplink from './uplink.js';
