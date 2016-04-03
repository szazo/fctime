import {Record} from 'immutable';

const SELECT_ROLE = "select_role";

const RoleRecord = Record({
	id: 0
});

export const Role = RoleRecord;

export function roleReducer(state: any, action: any) {
	switch (action.type) {

	case SELECT_ROLE:

		return new Role({id: action.id});
		
	default:
		return state;
	}
}
