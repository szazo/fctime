import * as React from 'react';
import { connect } from 'react-redux';
import { IDispatch } from 'redux';

import { UUID } from '../../common/uuid';
import { changeTimekeeper } from '../../app.model';
import { changeTimesheet } from '../timekeeper/timekeeper.model';
import { createEntry, changeEntry } from './timesheet.model';
import { Entry } from './entry/entry.ui';

interface EntryListProps {
		id: string;
		items: any[];

		onCreateEntryClick: () => void;
		onEntryChanged: (id:string, action:any) => void;
}

class EntryListView extends React.Component<EntryListProps, {}> {
		
		render() {

				return (
						<div>
						<table className="table table-striped table-hover">
						<thead>
						<tr>
						<th>Első ülés</th>
						<th>Második ülés</th>
						<th>Vitorla</th>
						<th>Vitorla idő</th>
						<th>Megjegyzés</th>
						</tr>
						</thead>
						<tbody>
						{
								this.props.items.map((item) => (
										<Entry
												key={item.id}
												state={() => item}
												dispatch={(event) => this.props.onEntryChanged(item.id, event)}
										/>
								))
						}
						</tbody>
						</table>
						<button className="btn btn-primary" onClick={this.props.onCreateEntryClick}>Új sor</button>
						</div>
				);
		}
}

const stateToProps = (state:any, props:any) => {

		let timesheet = state.timekeeper.timesheets.find((item) => item.id == props.params.id);

		return {
				items: timesheet.items
		};
}

const dispatchToProps = (dispatch: IDispatch, props:any) => ({
		onCreateEntryClick: () => {
				let id = UUID.generate();
				let timesheetId = props.params.id;

				dispatch(changeTimekeeper(changeTimesheet(timesheetId, createEntry(id))));
		},

		onEntryChanged: (id:string, action:any) => {

				
				let timesheetId = props.params.id;
				dispatch(changeTimekeeper(changeTimesheet(timesheetId, changeEntry(id, action))));
		}
})

export const EntryList = connect(stateToProps, dispatchToProps)(EntryListView);

