import * as phaseIds from './phaseIds.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(phaseIds) as Record<number, string>;
