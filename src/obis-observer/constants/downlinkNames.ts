import * as downlinkIds from './downlinkIds.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(downlinkIds) as Record<number, string>;
