import * as channelTypes from './channelTypes.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(channelTypes) as Record<number, string>;
