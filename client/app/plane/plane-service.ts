import { IDispatch } from 'redux';
import { createPlane } from './plane.model';

export class PlaneService {

	constructor(
		private state: () => any,
		private dispatch: IDispatch) {
	}

	public createPlane(id:any, registration:string, type:string) {
		this.dispatch(createPlane(id, registration, type));
	}
	
	public planeList() {
		return this.state().planes.toArray();
	}

	public findById(id:any):any {
		var found = this.state().planes.toArray().find(x => x.id == id);

		return found;
	}	
}
