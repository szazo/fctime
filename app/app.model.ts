import {Record,List} from 'immutable';

import { State, FcStore } from './common/fc-store';
import { Timesheet } from './timekeeper/timesheet/timesheet.model';
import { TimekeeperState, timekeeperReducer } from './timekeeper/timekeeper/timekeeper.model';
import { PersonManagement, personManagementReducer } from './person/person.model';
import { PlaneManagementState, planeManagementReducer } from './plane/plane.model';

const CHANGE_TIMEKEEPER = 'change_timekeeper';
const MANAGE_PERSONS = 'manage_persons';
const MANAGE_PLANES = 'manage_planes';

export function changeTimekeeper(action:any) {
	return {
		type: CHANGE_TIMEKEEPER,
		action
	}
}

export function managePersons(action:any) {
	return {
		type: MANAGE_PERSONS,
		action
	}
}

export function managePlanes(action:any) {
	return {
		type: MANAGE_PLANES,
		action
	}
}

export const RootRecord = Record({
	timekeeper: new TimekeeperState(),
	persons: new PersonManagement(),
	planes: new PlaneManagementState()
});

const Root = RootRecord;

const initialState = new Root({});

export function rootReducer(state: any, action: any) {

	console.log('root', action);
	
	if (state == undefined) {

		return initialState;
	}

	switch(action.type) {
	case CHANGE_TIMEKEEPER:

		state = state.set('timekeeper', timekeeperReducer(state.timekeeper, action.action));
		console.log('NEW TIMEKEEPER STATE', state.toJS());

		return state;

	case MANAGE_PERSONS:

		return state.set('persons', personManagementReducer(state.persons, action.action));

	case MANAGE_PLANES:
		
		return state.set('planes', planeManagementReducer(state.planes, action.action));
		
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
