import {Record} from 'immutable';

export enum PlaneStateType {
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
const CLEAR_PLANE = 'clear_plane';

export function selectKnownPlane(id:any) {
	return {
		type: SELECT_KNOWN_PLANE,
		id
	}
}

export function enterPlaneRegistration(registration:string) {
	return {
		type: ENTER_PLANE_REGISTRATION,
		registration
	}
}

export function clearPlane() {
	return {
		type: CLEAR_PLANE
	}
}

export function planeReducer(state: any, action: any) {

	switch (action.type) {

	case SELECT_KNOWN_PLANE:

		state = state
			.set('knownPlaneId', action.id)
			.set('type', PlaneStateType.known)
			.set('unknownPlaneRegistration', '');

		return state;

	case ENTER_PLANE_REGISTRATION:

		state = state
			.set('knownPlaneId', '')
			.set('type', PlaneStateType.unknown)
			.set('unknownPlaneRegistration', action.registration);

		return state;

	case CLEAR_PLANE:

		state = state
			.set('knownPlaneId', '')
			.set('type', PlaneStateType.empty)
			.set('unknownPlaneRegistration', '');

		return state;
		
	default:
		return state;
	}
}

