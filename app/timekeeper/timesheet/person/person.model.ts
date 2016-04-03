import {Record} from 'immutable';

enum PersonStateType {
	empty,
	unknown,
	known
}

interface PersonState {
	type: PersonStateType,
	knownPersonId: string,
	unknownPersonName: string
}

const PersonRecord = Record({
	type: PersonStateType.empty,
	knownPersonId: '',
	unknownPersonName: ''
});

export class Person extends PersonRecord {
	constructor(props) {
		super(props);
	}
}

const CHANGE_NAME = 'enter_name';
const CLEAR_PERSON = 'clear_person';
const SELECT_KNOWN_PERSON = 'select_known_person';

function enterName(name:string) {
	return {
		type: CHANGE_NAME,
		name
	}
}

function clearPerson() {
	return {
		type: CLEAR_PERSON
	}
}

function selectKnownPerson(id:any) {
	return {
		type: SELECT_KNOWN_PERSON,
		id
	}
}

export const personReducer = (state: any, action: any) => {

	switch (action.type) {
		
	case CHANGE_NAME:

		state = state.set('type', PersonStateType.unknown);
		state = state.set('unknownPersonName', action.name);
		state = state.set('knownPersonId', '');

		return state;
	case SELECT_KNOWN_PERSON:

		state = state.set('type', PersonStateType.known);
		state = state.set('unknownPersonName', '');
		state = state.set('knownPersonId', action.id);

		return state;
		
	default:
		return state;
	}	
}
