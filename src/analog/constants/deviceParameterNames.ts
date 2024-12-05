import * as deviceParameters from './deviceParameters.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(deviceParameters) as Record<number, string>;
