import * as React from 'react';
import { connect } from 'react-redux';
import { IDispatch } from 'redux';

import { UUID } from '../../common/uuid';
import { createTimesheet } from './timekeeper.model';
import { changeTimekeeper } from '../../app.model';

interface TimesheetListItem {
		id: string;
		date: any;
		place: string;
}

interface TimesheetListProps {
		items: TimesheetListItem[];
		onCreateTimesheetClick: () => void;
}

class TimesheetListView extends React.Component<TimesheetListProps, {}> {

		render() {
				return (
						<div>
								<button className="btn btn-primary" onClick={this.props.onCreateTimesheetClick}>Új üzemnap</button>
								<table className="table table-striped table-hover">
										<tr>
												<th>Id</th>
												<th>Dátum</th>
												<th>Helyszín</th>
										</tr>
										{
												this.props.items.map((item:TimesheetListItem) => (
														<tr>
																<td>{item.id}</td>
																<td>{item.date}</td>
																<td>{item.place}</td>
														</tr>
												))

										}
								</table>
						</div>
				);
		}

		private createTimesheet() {
				alert('create');
		}
}

const stateToProps = (state:any) => {
		return {
				items: state.timekeeper.timesheets.map((timesheet) => ({
						id: timesheet.id,
						date: timesheet.date,
						place: timesheet.place,
				}))
		};
}

const dispatchToProps = (dispatch:IDispatch) => ({
		onCreateTimesheetClick: () => {
				let id = UUID.generate();
				dispatch(changeTimekeeper(createTimesheet(id)));
		}
});

export const TimesheetList = connect(
		stateToProps,
		dispatchToProps
)(TimesheetListView);
