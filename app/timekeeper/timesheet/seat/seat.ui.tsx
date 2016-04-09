import * as React from 'react';

import { Person } from '../person/person.ui';
import { Role } from '../role/role.ui';

interface SeatProps {
		state: any;
		
}

export class Seat extends React.Component<{}, {}> {

		render() {

				return (
						<div>
								<div><Person /></div>
								<div><Role /></div>
						</div>
				);
		}

}
