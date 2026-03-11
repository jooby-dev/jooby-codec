import * as subsystemIds from './subsystemIds.js';
import invertObject from '../../utils/invertObject.js';


export default invertObject(subsystemIds) as Record<number, string>;
