import {Record} from 'immutable';
import * as moment from 'moment';

import { Time } from '../../common/time';

export enum GliderTimePhase {
	none,
	flying,
	landed
}

interface GliderTimeState {
	phase: GliderTimePhase,
	takeoffTime: Time,
	landTime: Time,
	airTime: Time
}

const GliderTimeRecord = Record({
	phase: GliderTimePhase.none,
	takeoffTime: Time.empty(),
	landTime: Time.empty(),
	airTime: Time.empty()
});

export const GliderTime = GliderTimeRecord;

const TAKEOFF = 'takeoff';
const LAND = 'land';
const CHANGE_TAKEOFF_TIME = 'change_takeoff_time';
const CHANGE_LAND_TIME = 'change_land_time';
const CHANGE_AIR_TIME = 'change_air_time';

function createTime():{time:Time, realTime:string} {
	let m = moment();
	let time = Time.fromMoment(m);
	let realTime = m.format();

	return {time: time, realTime: realTime};
}

export function takeoff() {

	let time = createTime();
	
	return {
		type: TAKEOFF,
		time: time.time,
		realTime: time.realTime
	}
}

export function land() {

	let time = createTime();
	
	return {
		type: LAND,
		time: time.time,
		realTime: time.realTime
	}
}

export function changeTakeoffTime(time:Time) {
	return {
		type: CHANGE_TAKEOFF_TIME,
		time
	}
}

export function changeLandTime(time:Time) {
	return {
		type: CHANGE_LAND_TIME,
		time
	}
}

export function changeAirTime(time:Time) {
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
