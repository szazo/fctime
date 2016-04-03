import {Injectable} from 'angular2/core';
import {FcStore} from '../common/fc-store';

@Injectable()
export class PlaneService {

	constructor(private store: FcStore) {
	}

	public createPlane(id:any, registration:string, type:string) {
		this.store.dispatch(createPlane(id, registration, type));
	}
	
	public planeList() {
		return this.store.getState().planes.toArray();
	}

	public findById(id:any):any {
		var found = this.store.getState().planes.toArray().find(x => x.id == id);

		return found;
	}	
}
