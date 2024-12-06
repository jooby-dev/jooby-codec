import * as screenIds from './screenIds.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(screenIds) as Record<number, string>;
