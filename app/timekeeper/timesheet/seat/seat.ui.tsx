import * as React from 'react';

import { Person } from '../person/person.ui';
import { Role } from '../role/role.ui';
import { changePerson, changeRole } from './seat.model';

import { FluxProps } from '../../../common/flux-props';

export class Seat extends React.Component<FluxProps, {}> {

		render() {

				return (
						<div>
								<div style={{display:'inline-block'}}>
										<Person
												 state={this.mapPersonState.bind(this)}
												 dispatch={this.mapPersonDispatch.bind(this)}
										/>
								</div>
								
								<div style={{display: 'inline-block'}}>
										<Role
												state={this.mapRoleState.bind(this)}
												dispatch={this.mapRoleDispatch.bind(this)}
										/>
								</div>
						</div>
				);
		}

		private mapPersonState() {

				console.log('SEAT', this.props.state().toJS());
				
				return this.props.state().person;
		}

		private mapPersonDispatch(action:any) {

				this.props.dispatch(changePerson(action));
		}

		private mapRoleState() {
				return this.props.state().role;
		}

		private mapRoleDispatch(action:any) {
				this.props.dispatch(changeRole(action));
		}
}
