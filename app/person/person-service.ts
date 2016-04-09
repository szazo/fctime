import { IStore } from 'redux';

export class PersonService {

	constructor(private store: IStore<any>)
	{
	}

	public personList() {
		return this.store.getState().persons.toArray();
	}

	public findById(id:any):any {
		var found = this.store.getState().persons.toArray().find(x => x.id == id);

		return found;
	}

	// public findPerson(pattern:string) {
	// 	let persons = this.store.getState().persons;

	// 	let regex = new RegExp('.*' + pattern + '.*');
	// 	let found = persons.toArray().find(x => regex.test(x));

	// 	alert('found');
	// }
}
