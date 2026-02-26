import * as gsmBlockTypes from './gsmBlockTypes.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(gsmBlockTypes) as Record<number, string>;
