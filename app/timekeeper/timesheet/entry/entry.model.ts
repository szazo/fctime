import {Record} from 'immutable';

import {Seat, seatReducer} from '../seat/seat.model';
import {Plane, planeReducer} from '../plane/plane.model';
import {GliderTime, gliderTimeReducer} from '../glider-time/glider-time.model';
import {Note, noteReducer} from '../note/note.model';

const CHANGE_PRIMARY_SEAT = 'change_primary_seat';
const CHANGE_SECONDARY_SEAT = 'change_secondary_seat';
const CHANGE_PLANE = 'change_plane';
const CHANGE_GLIDER_TIME = 'change_glider_time';
const CHANGE_NOTE = 'change_note';

const EntryRecord = Record({
	id: '',
	primarySeat: new Seat({}),
	secondarySeat: new Seat({}),
	plane: new Plane({}),
	gliderTime: new GliderTime({}),
	note: new Note({})
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

	case CHANGE_NOTE:
		return state.set('note', noteReducer(state.note, action.action));
		
	default:
		return state;
	}
}

export function changePrimarySeat(action: any) {
	return {
		type: CHANGE_PRIMARY_SEAT,
		action
	};
}

export function changeSecondarySeat(action: any) {
	return {
		type: CHANGE_SECONDARY_SEAT,
		action
	};
}

export function changePlane(action: any) {
	return {
		type: CHANGE_PLANE,
		action
	};
}

export function changeGliderTime(action: any) {
	return {
		type: CHANGE_GLIDER_TIME,
		action
	};
}

export function changeNote(action: any) {
	return {
		type: CHANGE_NOTE,
		action
	}
}
