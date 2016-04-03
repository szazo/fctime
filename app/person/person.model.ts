import {Record} from 'immutable';

const CREATE_PERSON = 'create_person';

const PersonDataRecord = Record({
	id: '',
	name: '',
	club: 'Endresz',
	level: ''
});

const PersonData = PersonDataRecord;

function createPerson(id:string, name:string, club:string, level:string) {

	return {
		type: CREATE_PERSON,
		id,
		name,
		club,
		level
	}
}

function personManagementReducer(state: any, action: any) {

	let personData = new PersonData({
		id: action.id,
		name: action.name,
		club: action.club,
		level: action.level
	});

	let persons = state.persons.push(personData);
	let newState = state.set('persons', persons);

	console.debug('NEWSTATE', newState);

	return newState;
}
