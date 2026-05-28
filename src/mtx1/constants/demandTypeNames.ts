import * as demandTypes from './demandTypes.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(demandTypes) as Record<number, string>;
