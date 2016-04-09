import * as React from 'react';

import { TimesheetList } from './timesheet-list.ui';

export class Timekeeper extends React.Component<{}, {}> {

		render(){
				return (
						<div>
								<h2>Időmérő</h2>
								<TimesheetList />
						</div>
				);
		}
}


