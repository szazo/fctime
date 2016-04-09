import {Injectable} from 'angular2/core';

import {FcStore} from '../common/fc-store';

@Injectable()
export class PersonService {

	constructor(private store: FcStore)
	{
	}

	public personList() {
		return this.store.state.persons.toArray();
	}

	public findById(id:any):any {
		var found = this.store.state.persons.toArray().find(x => x.id == id);

		return found;
	}

	// public findPerson(pattern:string) {
	// 	let persons = this.store.getState().persons;

	// 	let regex = new RegExp('.*' + pattern + '.*');
	// 	let found = persons.toArray().find(x => regex.test(x));

	// 	alert('found');
	// }
}
