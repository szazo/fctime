import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { IDispatch } from 'redux';

import { UUID } from '../../common/uuid';
import { createTimesheet } from './timekeeper.model';
import { changeTimekeeper } from '../../app.model';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { ButtonToolbar, Button } from 'react-bootstrap';

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

				let linkFormatter = (item:any) => {

						let path = 'timekeeper/timesheet/' + item;
						return <Link to={path}>{item}</Link>;
				}
		
				return (
						<div>
								<ButtonToolbar>
										<Button bsStyle="primary" onClick={this.props.onCreateTimesheetClick}>Új üzemnap</Button>
								</ButtonToolbar>

								<BootstrapTable data={this.props.items} search striped>
										<TableHeaderColumn isKey dataField="id" dataFormat={linkFormatter}>Azonosító</TableHeaderColumn>
										<TableHeaderColumn dataField="date" dataSort>Dátum</TableHeaderColumn>
										<TableHeaderColumn dataField="place" dataSort>Helyszín</TableHeaderColumn>
								</BootstrapTable>
								
								{/* <table className="table table-striped table-hover">
								<tbody>
								<tr>
								<th>Id</th>
								<th>Dátum</th>
								<th>Helyszín</th>
								</tr>
								{
								this.props.items.map((item:TimesheetListItem) => (
								<tr key={item.id}>
								<td><Link to={'timekeeper/timesheet/' + item.id}>{item.id}</Link></td>
								<td>{item.date}</td>
								<td>{item.place}</td>
								</tr>
								))

								}
								</tbody>
								</table> */}
						</div>
				);
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
