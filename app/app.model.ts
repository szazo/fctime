import {Record,List} from 'immutable';

import {State, FcStore} from './common/fc-store';
import {Timesheet} from './timekeeper/timesheet/timesheet.model';
import {TimekeeperState, timekeeperReducer} from './timekeeper/timekeeper/timekeeper.model';

const CHANGE_TIMEKEEPER = 'change_timekeeper';

export function changeTimekeeper(action:any) {
	return {
		type: CHANGE_TIMEKEEPER,
		action
	}
}

const RootRecord = Record({
	timekeeper: List([]),
	persons: List([]),
	planes: List([])
});

const Root = RootRecord;

const initialState = new Root({
	timekeeper: new TimekeeperState(),
	persons: List([])
});

export function rootReducer(state: any, action: any) {

	if (state == undefined) {

		return initialState;
	}

	switch(action.type) {
	case CHANGE_TIMEKEEPER: {

		return state.set('timekeeper', timekeeperReducer(state.timekeeper, action.action));
	}
	// case CREATE_PERSON:

	// 	return personManagementReducer(state, action);

	// case CREATE_PLANE:

	// 	return planeManagementReducer(state, action);
		
	default:
		return state;
	}
}

export class TimekeeperStore extends State {

	constructor(private store:FcStore) {
		super();
	}
	
	get state():any {
		return this.store.state.timekeeper;
	}
	
	dispatch(action:any) {
		this.store.dispatch(changeTimekeeper(action));
	}
}
