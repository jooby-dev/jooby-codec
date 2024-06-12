import {downlink, uplink} from '../commands/index.js';
import getCommandsById from '../../utils/getCommandsById.js';


export const downlinkById = getCommandsById(downlink);
export const uplinkById = getCommandsById(uplink);
