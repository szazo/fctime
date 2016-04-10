import { List, Record } from 'immutable';

const CREATE_PLANE = 'create_plane';

export function createPlane(id:string, registration:string, type: string) {

	return {
		type: CREATE_PLANE,
		id,
		registration,
		planeType: type
	}
}

const PlaneRecord = Record({
	id: '',
	registration: '',
	type: ''
});


export const PlaneManagementState = Record({
	planes: List([])
})

export function planeManagementReducer(state: any, action: any) {

	switch (action.type) {
	case CREATE_PLANE:
		
		let planeData = new PlaneRecord({
			id: action.id,
			registration: action.registration,
			planeType: action.planeType
		});

		return state.set('planes', state.planes.push(planeData));

	default:
		return state;
	}
}
