import * as React from 'react';

import { FluxProps } from '../../../common/flux-props';

import { Seat } from '../seat/seat.ui';
import { Plane } from '../plane/plane.ui';
import { GliderTime } from '../glider-time/glider-time.ui';
import { Note } from '../note/note.ui';

import { changePrimarySeat, changeSecondarySeat, changePlane, changeGliderTime, changeNote } from './entry.model'

export class Entry extends React.Component<FluxProps, {}> {

		render() {

				return (
						<tr>
								<td>
										<Seat
												state={this.primarySeatState.bind(this)}
												dispatch={this.primarySeatDispatch.bind(this)}
										/>
								</td>
								<td>
										<Seat
												state={this.secondarySeatState.bind(this)}
												dispatch={this.secondarySeatDispatch.bind(this)}
										/>
								</td>
								<td>
										<Plane
												state={this.planeState.bind(this)}
												dispatch={this.planeDispatch.bind(this)}
										/>
								</td>
								<td>
										<GliderTime
												state={this.gliderTimeState.bind(this)}
												dispatch={this.gliderTimeDispatch.bind(this)}
										/>
								</td>
								<td>
										<Note
												state={this.noteState.bind(this)}
												dispatch={this.noteDispatch.bind(this)}
										/>
								</td>
						</tr>
				);
		}

		private primarySeatState() {

				console.log('primarySeat', this.props.state().toJS());
				return this.props.state().primarySeat;
		}

		private primarySeatDispatch(action:any) {
				this.props.dispatch(changePrimarySeat(action));
		}
		
		private secondarySeatState() {
				return this.props.state().secondarySeat;
		}

		private secondarySeatDispatch(action:any) {
				this.props.dispatch(changeSecondarySeat(action));
		}

		private planeState() {
				return this.props.state().plane;
		}

		private planeDispatch(action:any) {
				this.props.dispatch(changePlane(action));
		}

		private gliderTimeState() {
				return this.props.state().gliderTime;
		}

		private gliderTimeDispatch(action:any) {
				this.props.dispatch(changeGliderTime(action));
		}

		private noteState() {
				return this.props.state().note;
		}

		private noteDispatch(action:any) {
				this.props.dispatch(changeNote(action));
		}		
}
