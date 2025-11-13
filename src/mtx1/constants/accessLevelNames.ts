import * as accessLevels from './accessLevels.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(accessLevels) as Record<number, string>;
