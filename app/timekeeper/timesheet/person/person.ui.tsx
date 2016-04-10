import * as React from 'react';
import { Typeahead, TypeaheadSelection, TypeaheadSelectionType } from '../../../common/typeahead';
import { FluxProps } from '../../../common/flux-props';
import { clearPerson, selectKnownPerson, enterName, PersonStateType } from './person.model';

export class Person extends React.Component<FluxProps, {}> {

		static contextTypes = {
				personService: React.PropTypes.object
		};
		
		render() {

				return (
						<div>

								<Typeahead
										options={this.personList()}
										labelKey="name"
										idKey="id"
										selected={this.selected()}
										onSelected={this.typeaheadSelected.bind(this)}
										allowNew={true}
								/>
						</div>
				);
		}

		private typeaheadSelected(values:TypeaheadSelection[]) {

				if (values.length == 0) {
						this.props.dispatch(clearPerson());
				}

				let value = values[0];
				switch (value.type) {
						case TypeaheadSelectionType.unknown:
								this.props.dispatch(enterName(value.unknownText));
								break;
						case TypeaheadSelectionType.known:
								this.props.dispatch(selectKnownPerson(value.knownId));
								break;
				}
		}

		private selected():TypeaheadSelection[] {

				let state = this.props.state();

				console.log('STATE', state.toJS());
				
				switch (state.type) {
						case PersonStateType.empty:
								return [];
						case PersonStateType.known:
								return [TypeaheadSelection.known(state.knownPersonId)];
						case PersonStateType.unknown:
								return [TypeaheadSelection.unknown(state.unknownPersonName)];
				}
		}

		private personList() {
				let context:any = this.context;
				return context.personService.personList();
		}
}
