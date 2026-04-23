/**
 * A command is a part of a device message.
 *
 * @packageDocumentation
 *
 * Each command consists of header and optional data body.
 *
 * ### Command header
 *
 * <table>
 *     <thead>
 *         <tr>
 *             <th>7</th>
 *             <th>6</th>
 *             <th>5</th>
 *             <th>4</th>
 *             <th>3</th>
 *             <th>2</th>
 *             <th>1</th>
 *             <th>0</th>
 *         </tr>
 *     </thead>
 *     <tbody>
 *         <tr>
 *             <td colspan="8" align="center">command size (with this byte)</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command id (first byte)</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command id (second byte)</td>
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
