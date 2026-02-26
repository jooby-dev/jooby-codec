import * as gsmAccessTypes from './gsmAccessTypes.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(gsmAccessTypes) as Record<number, string>;
