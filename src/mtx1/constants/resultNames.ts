import * as resultCodes from './resultCodes.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(resultCodes) as Record<number, string>;
