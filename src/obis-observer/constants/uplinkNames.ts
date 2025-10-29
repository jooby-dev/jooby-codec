import * as uplinkIds from './uplinkIds.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(uplinkIds) as Record<number, string>;
