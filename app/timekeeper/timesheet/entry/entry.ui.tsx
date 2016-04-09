import * as React from 'react';

import { Seat } from '../seat/seat.ui';
import { Plane } from '../plane/plane.ui';
import { GliderTime } from '../glider-time/glider-time.ui';
import { Note } from '../note/note.ui';

interface EntryProps {
		state: any;
}

export class Entry extends React.Component<EntryProps, {}> {

		render() {

				return (
						<tr>
								<td><Seat /></td>
								<td><Seat /></td>
								<td><Plane /></td>
								<td><GliderTime /></td>
								<td><Note /></td>
						</tr>
				);
		}

}
