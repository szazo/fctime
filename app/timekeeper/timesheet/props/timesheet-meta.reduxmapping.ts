import { TimesheetProps as BaseTimesheetProps } from './timesheet-props.ui';
import { connect } from 'react-redux';

function stateToProps(state: any, props: any) {

	let timesheet = state.timekeeper.timesheets.find((item) => item.id == props.params.id);
	let meta = timesheet.meta;
	return {
		date: meta.date,
		airport: meta.airport,
		timekeeper: meta.timekeeper,
		leader: meta.leader
	};
}

export const TimesheetMeta = connect(stateToProps)(BaseTimesheetProps);
