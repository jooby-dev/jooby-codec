/**
 * A command is a part of a device message.
 *
 * @packageDocumentation
 *
 * Each command consists of header and optional data body.
 *
 * There can be 3 types of headers in commands.
 *
 * ### Command with a one-byte header
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
 *             <td colspan="3" align="center">command id</td>
 *             <td colspan="5" align="center">command data size</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command data</td>
 *         </tr>
 *     </tbody>
 * </table>
 *
 * ### Command with a two-bytes header
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
 *             <td>0</td>
 *             <td>0</td>
 *             <td>0</td>
 *             <td colspan="5" align="center">command id</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command data size</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command data</td>
 *         </tr>
 *     </tbody>
 * </table>
 *
 * ### Command with a three-bytes header
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
 *             <td colspan="8" align="center"><code>0x1f</code></td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command id</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command data size</td>
 *         </tr>
 *         <tr>
 *             <td colspan="8" align="center">command data</td>
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
