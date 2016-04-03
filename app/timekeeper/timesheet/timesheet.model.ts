import {List,Record} from 'immutable';
import {Entry, entryReducer} from './entry/entry.model';

const ADD_ENTRY = 'add_entry';
const CHANGE_ENTRY = 'change_entry';

const TimesheetRecord = Record({
	id: '',
	date: '',
	place: '',
	items: List([])
});

export const Timesheet = TimesheetRecord;

function timesheetItemsReducer(state: any, action:any) {

	switch (action.type) {
	case ADD_ENTRY:
		{
		console.log('ADD_ENTRY', state.toJSON(), action);

		let entry = new Entry({id: action.id});

		let newEntries = state.items.push(entry);
		let newState = state.set('items', newEntries);

//			console.log('NEW ENTRY', entry.toJSON());
			
	  // let newState = state.updateIn('items', (items) => items.push(entry)); // 
		return newState;
		}
	case CHANGE_ENTRY:
		{
			let items = state.items;
			let newItems = items.update(items.findIndex(x => x.id == action.id), item => entryReducer(item, action.action));

			let newState =	state.set('items', newItems);
			
			// let sheets = state.timesheets;
			// sheets = sheets.update(sheets.findIndex(x=> x.id == action.id), timesheet => timesheetReducer(timesheet, action.action));

//			console.log('NEW TIMESHEET STATE', newState.toJSON());
			

			// console.log('ADD_ENTRY_AFTER', newState.toJSON());
			return newState;
		}
	default:
		return state;	
	}
}
