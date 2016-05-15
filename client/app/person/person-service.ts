import { IDispatch } from 'redux';

import { UUID } from '../common/uuid';
import { createPerson } from './person.model';

export class PersonService {

	constructor(
		private state: () => any,
		private dispatch: IDispatch) {
	}

	public createPerson(name:string, club:string, level:string) {
		this.dispatch(createPerson(UUID.generate(), name, club, level));
	}

	public personList() {
		return this.state().persons.toArray();
	}

	public findById(id:any):any {
		var found = this.state().persons.toArray().find(x => x.id == id);

		return found;
	}

}
