import EventId from './id.js';
import EventTime from './EventTime.js';

const map = new Map();

map.set(EventId.MAGNET_ON, EventTime);
map.set(EventId.MAGNET_OFF, EventTime);
map.set(EventId.ACTIVATE, EventTime);
map.set(EventId.DEACTIVATE, EventTime);
map.set(EventId.CAN_OFF, EventTime);
map.set(EventId.INSERT, EventTime);
map.set(EventId.REMOVE, EventTime);
map.set(EventId.COUNTER_OVER, EventTime);
map.set(EventId.EV_OPTOLOW, EventTime);
map.set(EventId.EV_OPTOFLASH, EventTime);
map.set(EventId.EV_REJOJN, EventTime);

export default map;
