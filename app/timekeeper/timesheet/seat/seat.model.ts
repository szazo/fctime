import {Record} from 'immutable';

import {Person, personReducer} from '../person/person.model';
import {Role, roleReducer} from '../role/role.model';

const SeatRecord = Record({
	person: new Person({}),
	role: new Role({})
});

export const Seat = SeatRecord;

const CHANGE_PERSON = 'change_person';
const CHANGE_ROLE = 'change_role';

function changePerson(action: any) {
	return {
		type: CHANGE_PERSON,
		action
	}
}

function changeRole(action: any) {
	return {
		type: CHANGE_ROLE,
		action
	}
}

export function seatReducer(state: any, action: any) {

	switch (action.type) {

	case CHANGE_PERSON:
		return state.update('person', personState => personReducer(personState, action.action));

	case CHANGE_ROLE:
		return state.update('role', roleState => roleReducer(roleState, action.action));

	default:
		return state;
	}
}
