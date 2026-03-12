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
 *             <td>command data (optional)</td>
 *         </tr>
 *     </tbody>
 * </table>
 */

import * as downlink from './downlink/index.js';
import * as uplink from './uplink/index.js';
import getCommandsById from '../../utils/getCommandsById.js';


export {downlink, uplink};

export const downlinkById = getCommandsById(downlink);
export const uplinkById = getCommandsById(uplink);
