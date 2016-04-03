import {Record,List} from 'immutable';

import {Timesheet} from './timekeeper/timesheet/timesheet.model';
import {Timekeeper, timekeeperReducer} from './timekeeper/timekeeper.model';

const CHANGE_TIMEKEEPER = 'change_timekeeper';

export function changeTimekeeper(action:any) {
	return {
		type: CHANGE_TIMEKEEPER,
		action
	}
}

const RootRecord = Record({
	timesheets: List([]),
	persons: List([]),
	planes: List([])
});

const Root = RootRecord;

const initialState = new Root({
	timesheets: List([new Timesheet({id: 'timesheet1'})]),
	persons: List([])
});

export function rootReducer(state: any, action: any) {

	if (state == undefined) {

		return initialState;
	}

	switch(action.type) {
	case CHANGE_TIMEKEEPER: {

		return timekeeperReducer(state, action.action);
	}
	// case CREATE_PERSON:

	// 	return personManagementReducer(state, action);

	// case CREATE_PLANE:

	// 	return planeManagementReducer(state, action);
		
	default:
		return state;
	}
}
