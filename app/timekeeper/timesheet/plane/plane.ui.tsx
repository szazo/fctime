import * as React from 'react';

import { Typeahead, TypeaheadSelection, TypeaheadSelectionType } from '../../../common/typeahead';
import { FluxProps } from '../../../common/flux-props';

import { clearPlane, selectKnownPlane, enterPlaneRegistration, PlaneStateType } from './plane.model';

export class Plane extends React.Component<FluxProps, {}> {

		static contextTypes = {
				planeService: React.PropTypes.object
		};
		
		render() {

				return (
						<div>
								<Typeahead
										options={this.planeList()}
										labelKey="registration"
										idKey="id"
										selected={this.selected()}
										onSelected={this.typeaheadSelected.bind(this)}
										allowNew={true}
								/>
						</div>						
				);
		}

		private planeList() {
				let context:any = this.context;
				return context.planeService.planeList();				
		}

		private typeaheadSelected(values:TypeaheadSelection[]) {

				if (values.length == 0) {
						this.props.dispatch(clearPlane());
				}

				let value = values[0];
				switch (value.type) {
						case TypeaheadSelectionType.unknown:
								this.props.dispatch(enterPlaneRegistration(value.unknownText));
								break;
						case TypeaheadSelectionType.known:
								this.props.dispatch(selectKnownPlane(value.knownId));
								break;
				}
		}

		private selected():TypeaheadSelection[] {

				let state = this.props.state();

				switch (state.type) {
						case PlaneStateType.empty:
								return [];
						case PlaneStateType.known:
								return [TypeaheadSelection.known(state.knownPlaneId)];
						case PlaneStateType.unknown:
								return [TypeaheadSelection.unknown(state.unknownPlaneRegistration)];
				}
		}	
}
