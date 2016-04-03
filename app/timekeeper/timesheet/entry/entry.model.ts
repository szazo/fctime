import {Record} from 'immutable';

import {Seat, seatReducer} from '../seat/seat.model';
import {Plane, planeReducer} from '../plane/plane.model';
import {GliderTime, gliderTimeReducer} from '../glider-time/glider-time.model';

const CHANGE_PRIMARY_SEAT = 'change_primary_seat';
const CHANGE_SECONDARY_SEAT = 'change_secondary_seat';
const CHANGE_PLANE = 'change_plane';
const CHANGE_GLIDER_TIME = 'change_glider_time';

const EntryRecord = Record({
	id: '',
	primarySeat: new Seat({}),
	secondarySeat: new Seat({}),
	plane: new Plane({}),
	gliderTime: new GliderTime({})
});

export const Entry = EntryRecord;

export function entryReducer(state:any, action: any) {

	switch (action.type) {

	case CHANGE_PRIMARY_SEAT:
		return state.set('primarySeat', seatReducer(state.primarySeat, action.action));

	case CHANGE_SECONDARY_SEAT:
		return state.set('secondarySeat', seatReducer(state.secondarySeat, action.action));	

	case CHANGE_PLANE:
		return state.set('plane', planeReducer(state.plane, action.action));

	case CHANGE_GLIDER_TIME:
		return state.set('gliderTime', gliderTimeReducer(state.gliderTime, action.action));
		
	default:
		return state;
	}
}
