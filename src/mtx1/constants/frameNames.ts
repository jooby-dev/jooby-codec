import * as frameTypes from './frameTypes.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(frameTypes) as Record<number, string>;
