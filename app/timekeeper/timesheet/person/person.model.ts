import {Record} from 'immutable';

export enum PersonStateType {
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

const ENTER_NAME = 'enter_name';
const CLEAR_PERSON = 'clear_person';
const SELECT_KNOWN_PERSON = 'select_known_person';

export function enterName(name:string) {
	return {
		type: ENTER_NAME,
		name
	}
}

export function clearPerson() {
	return {
		type: CLEAR_PERSON
	}
}

export function selectKnownPerson(id:any) {
	return {
		type: SELECT_KNOWN_PERSON,
		id
	}
}

export const personReducer = (state: any, action: any) => {

		switch (action.type) {
		
	case ENTER_NAME:

		state = state
			.set('type', PersonStateType.unknown)
			.set('unknownPersonName', action.name)
			.set('knownPersonId', '');

		return state;
	case SELECT_KNOWN_PERSON:

		state = state
			.set('type', PersonStateType.known)
			.set('unknownPersonName', '')
			.set('knownPersonId', action.id);

		return state;

	case CLEAR_PERSON:

		state = state
			.set('type', PersonStateType.empty)
		  .set('unknownPersonName', '')
			.set('knownPersonId', '');

		return state;
		
	default:
		return state;
	}	
}
