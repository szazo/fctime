import {Record} from 'immutable';

enum PlaneStateType {
	empty,
	unknown,
	known
}

interface PlaneState {
	type: PlaneStateType;
	knownPlaneId: string,
	unknownPlaneRegistration: string
}

const PlaneRecord = Record({
	type: PlaneStateType.empty,
	knownPlaneId: '',
	unknownPlaneRegistration: ''
});

export const Plane = PlaneRecord;

const SELECT_KNOWN_PLANE = 'select_known_plane';
const ENTER_PLANE_REGISTRATION = 'enter_plane_registration';

function selectKnownPlane(id:any) {
	return {
		type: SELECT_KNOWN_PLANE,
		id
	}
}

function enterPlaneRegistration(registration:string) {
	return {
		type: ENTER_PLANE_REGISTRATION,
		registration
	}
}

export function planeReducer(state: any, action: any) {

	switch (action.type) {

	case SELECT_KNOWN_PLANE:

		state = state.set('knownPlaneId', action.id);
		state = state.set('type', PlaneStateType.known);
		state = state.set('unknownPlaneRegistration', '');

		return state;

	case ENTER_PLANE_REGISTRATION:

		state = state.set('knownPlaneId', '');
		state = state.set('type', PlaneStateType.unknown);
		state = state.set('unknownPlaneRegistration', action.registration);

		return state;

	default:
		return state;
	}
}

