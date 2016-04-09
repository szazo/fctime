import {List,Record} from 'immutable';

import {FcStore} from '../../common/fc-store';
import {Timesheet} from '../timesheet/timesheet.model';

const CHANGE_TIMESHEET = 'change_timesheet';
const CREATE_TIMESHEET = 'create_timesheet';

const TimekeeperRecord = Record({
	timesheets: List([])
});

export const TimekeeperState = TimekeeperRecord; 

function changeTimesheet(id:any, action:any) {
	return {
		type: CHANGE_TIMESHEET,
		id: id,
		action
	};
}

export function createTimesheet(id: any) {
	return {
		type: CREATE_TIMESHEET,
		id: id
	}
}

export function timekeeperReducer(state:any, action:any) {

	switch (action.type) {

	case CHANGE_TIMESHEET:

		throw new Error('Not impl');
		// let sheets = state.timesheets;
		// sheets = sheets.update(sheets.findIndex(x=> x.id == action.id), timesheet => timesheetReducer(timesheet, action.action));

		// console.debug('NEW ROOT STATE', sheets.toJSON());

		// return state.set('timesheets', sheets);

	case CREATE_TIMESHEET:

		let newTimesheets = state.timesheets.push(new Timesheet({id: action.id}));
		return state.set('timesheets', newTimesheets);


	}
	
}
