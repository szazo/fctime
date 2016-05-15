import {Record} from 'immutable';

const SELECT_ROLE = "select_role";
const CLEAR_ROLE = "clear_role";

export enum RoleStateType {
	empty,
	selected
}

const RoleRecord = Record({
	type: RoleStateType.empty,
	id: ''
});

export const Role = RoleRecord;

export function roleReducer(state: any, action: any) {
	switch (action.type) {

	case SELECT_ROLE:

		return new Role({type: RoleStateType.selected, id: action.id});

	case CLEAR_ROLE:

		return new Role({type: RoleStateType.empty, id: ''})
		
	default:
		return state;
	}
}

export function selectRole(id:any) {
	return {
		type: SELECT_ROLE,
		id
	}
}

export function clearRole() {
	return {
		type: CLEAR_ROLE
	}
}
