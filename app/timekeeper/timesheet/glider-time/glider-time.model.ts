import {Record} from 'immutable';

enum GliderTimePhase {
	none,
	flying,
	landed
}

interface GliderTimeState {
	phase: GliderTimePhase,
	takeoffTime: string,
	landTime: string,
	flyTime: string
}

const GliderTimeRecord = Record({
	phase: GliderTimePhase.none,
	takeoffTime: '',
	landTime: '',
	flyTime: ''
});

export const GliderTime = GliderTimeRecord;

const TAKEOFF = 'takeoff';
const LAND = 'land';
const CHANGE_TAKEOFF_TIME = 'change_takeoff_time';
const CHANGE_LAND_TIME = 'change_land_time';
const CHANGE_AIR_TIME = 'change_air_time';

function takeoff(time:string) {
	return {
		type: TAKEOFF,
		time
	}
}

function land(time:string) {
	return {
		type: LAND,
		time
	}
}

function changeTakeoffTime(time:string) {
	return {
		type: CHANGE_TAKEOFF_TIME,
		time
	}
}

function changeLandTime(time:string) {
	return {
		type: CHANGE_LAND_TIME,
		time
	}
}

function changeAirTime(time:string) {
	return {
		type: CHANGE_AIR_TIME,
		time
	}
}


export function gliderTimeReducer(state: any, action: any) {

	switch (action.type) {

	case TAKEOFF:

		state = state.set('phase', GliderTimePhase.flying);
		state = state.set('takeoffTime', action.time);

		return state;

	case LAND:

		state = state.set('phase', GliderTimePhase.landed);
		state = state.set('landTime', action.time);

		return state;

	default:

		return state;
		
	}
}
