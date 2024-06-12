import {downlink as originalDownlink, uplink as originalUplink} from './index.js';
import getCommandsById from '../../utils/getCommandsById.js';


export const downlink = getCommandsById(originalDownlink);
export const uplink = getCommandsById(originalUplink);
