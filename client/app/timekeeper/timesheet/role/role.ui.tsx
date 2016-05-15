import * as React from 'react';

import { Typeahead, TypeaheadSelection, TypeaheadSelectionType } from '../../../common/typeahead';
import { FluxProps } from '../../../common/flux-props';

import { RoleService } from '../../common/role-service';

import { clearRole, selectRole, RoleStateType } from './role.model';

export class Role extends React.Component<FluxProps, {}> {

		private roleService:RoleService;
		
		constructor() {
				super();

				this.roleService = new RoleService();
		}
		
		render() {

				return (
						<div>
								<Typeahead
										options={this.roleList()}
										labelKey="name"
										idKey="id"
										selected={this.selected()}
										onSelected={this.typeaheadSelected.bind(this)}
										allowNew={false}
								/>
						</div>
				);
		}

		private roleList() {
				return this.roleService.listRoles([]);
		}

		private typeaheadSelected(values:TypeaheadSelection[]) {

				if (values.length == 0) {
						this.props.dispatch(clearRole());
				}

				let value = values[0];
				switch (value.type) {
						case TypeaheadSelectionType.known:
								this.props.dispatch(selectRole(value.knownId));
								break;
				}
		}		

		private selected():TypeaheadSelection[] {

				let state = this.props.state();

				switch (state.type) {
						case RoleStateType.empty:
								return [];
						case RoleStateType.selected:
								return [TypeaheadSelection.known(state.id)];
				}
		}			
}
