import {Record} from 'immutable';
import * as moment from 'moment';

import { Time } from '../../common/time';

export enum GliderTimePhase {
	none,
	flying,
	landed
}

export enum TimePhase {
	empty,
	valid,
	invalid
}

export interface TimeState {
	phase: TimePhase;
	text: string;
	time: Time;
	isValid:boolean;
	isInvalid:boolean;
	isEmpty:boolean;
}

export class TimeStateImpl implements TimeState {

	constructor(
		private currentPhase:TimePhase,
		private invalidText:string,
		private validTime:Time) {		
	}
	
	static invalid(invalidText:string) {
		return new TimeStateImpl(TimePhase.invalid, invalidText, Time.empty());
	}

	static valid(time:Time) {
		return new TimeStateImpl(TimePhase.valid, '', time);
	}

	static empty() {
		return new TimeStateImpl(TimePhase.empty, '', Time.empty());
	}

	get text() {
		switch (this.currentPhase) {
		case TimePhase.valid:
			return this.time.format();
		case TimePhase.invalid:
			return this.invalidText;
		case TimePhase.empty:
			return '';
		}
	}

	get phase() {
		return this.currentPhase;
	}

	get time() {
		if (this.isValid) {
			return this.validTime;
		}

		return Time.empty();
	}
	
	get isValid() {
		return this.currentPhase == TimePhase.valid;
	}

	get isEmpty() {
		return this.currentPhase == TimePhase.empty;
	}

	get isInvalid() {
		return this.currentPhase == TimePhase.invalid;
	}

}

// this is the record which can be saved as snapshot
const TimeRecord = Record({
	phase: TimePhase.empty,
	invalidText: '',
	hours: 0,
	minutes: 0,
})

export function recordToTimeState(timeRecord:any) {

	switch (timeRecord.phase) {
	case TimePhase.empty:
		return TimeStateImpl.empty();
	case TimePhase.valid:
		return TimeStateImpl.valid(Time.time(timeRecord.hours, timeRecord.minutes));
	case TimePhase.invalid:
		return TimeStateImpl.invalid(timeRecord.invalidText);
	}
}

function timeStateToRecord(timeState:TimeState) {

	switch (timeState.phase) {
	case TimePhase.empty:
		return new TimeRecord({phase:TimePhase.empty});
	case TimePhase.valid:
		return new TimeRecord({phase:TimePhase.valid, hours:timeState.time.hour, minutes: timeState.time.minute});
	case TimePhase.invalid:
		return new TimeRecord({phase:TimePhase.invalid, invalidText: timeState.text});
	}	
}

function stringToTimeState(timeText:string) {

	if (timeText.trim().length == 0) {
		return TimeStateImpl.empty();
	}

	let parsed = Time.parse(timeText);
	if (parsed.isValid()) {
		return TimeStateImpl.valid(parsed);
	}

	return TimeStateImpl.invalid(timeText);
}

const GliderTimeRecord = Record({
	phase: GliderTimePhase.none,
	takeoffTime: new TimeRecord(),
	landTime: new TimeRecord(),
	airTime: new TimeRecord()
});

export const GliderTime = GliderTimeRecord;

const TAKEOFF = 'takeoff';
const LAND = 'land';
const CHANGE_TAKEOFF_TIME = 'change_takeoff_time';
const CHANGE_LAND_TIME = 'change_land_time';
const CHANGE_AIR_TIME = 'change_air_time';

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

/**
 * Used by action creators for getting current time in
 * hour:minute format and also log real time.
 */
function createTime():{time:string, realTime:string} {
	let m = moment();
	let time = Time.now().format();
	let realTime = m.format();

	return {time: time, realTime: realTime};
}

export function changeTakeoffTime(time:string) {
	return {
		type: CHANGE_TAKEOFF_TIME,
		time
	}
}

export function changeLandTime(time:string) {
	return {
		type: CHANGE_LAND_TIME,
		time
	}
}

export function changeAirTime(time:string) {
	return {
		type: CHANGE_AIR_TIME,
		time
	}
}

function diffTimeStates(start:TimeState, end:TimeState) {

	if (!(start.isValid && end.isValid)) {
		return TimeStateImpl.empty();
	}

	let diff = end.time.diffFrom(start.time);
	return TimeStateImpl.valid(diff);
}

export function gliderTimeReducer(state: any, action: any) {

	switch (action.type) {

	case TAKEOFF: {
		let takeoffTime = stringToTimeState(action.time);
		
		state = state.set('phase', GliderTimePhase.flying);
		state = state.set('takeoffTime', timeStateToRecord(takeoffTime));

		return state;
	}
	case LAND: {

		let takeoffTime = recordToTimeState(state.takeoffTime);
		let landTime = stringToTimeState(action.time);
		let airTime = diffTimeStates(takeoffTime, landTime);
		
		state = state
			.set('phase', GliderTimePhase.landed)
			.set('landTime', timeStateToRecord(landTime))
			.set('airTime', timeStateToRecord(airTime));

		return state;
	}
	case CHANGE_TAKEOFF_TIME: {

		let takeoffTime = stringToTimeState(action.time);
		let landTime = recordToTimeState(state.landTime);
		let airTime = diffTimeStates(takeoffTime, landTime);

		return state
			.set('takeoffTime', timeStateToRecord(takeoffTime))
			.set('airTime', timeStateToRecord(airTime));
	}

	case CHANGE_LAND_TIME: {

		let takeoffTime = recordToTimeState(state.takeoffTime);
		let landTime = stringToTimeState(action.time);
		let airTime = diffTimeStates(takeoffTime, landTime);
		
		return state
			.set('landTime', timeStateToRecord(landTime))
			.set('airTime', timeStateToRecord(airTime));
	}
	case CHANGE_AIR_TIME: {

		let takeoffTime = recordToTimeState(state.takeoffTime);
		let airTime = stringToTimeState(action.time);

		if (airTime.isValid && takeoffTime.isValid) {
			// calculate the land time
			let landTime = TimeStateImpl.valid(takeoffTime.time.add(airTime.time));

			return state
				.set('landTime', timeStateToRecord(landTime))
				.set('airTime', timeStateToRecord(airTime));			
		}

		if (action.time.length == 0) {
			// empty, we fix it and calculate
			let landTime = recordToTimeState(state.landTime);
			let airTime = diffTimeStates(takeoffTime, landTime);

			return state
				.set('airTime', timeStateToRecord(airTime));			
		}

			// user entered invalid text, we leave it invalid
			return state.set('airTime', timeStateToRecord(airTime));
	}
	default:

		return state;
		
	}
}
