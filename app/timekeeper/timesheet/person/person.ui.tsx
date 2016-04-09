/// <reference path="react-autocomplete.d.ts" />

import * as React from 'react';
import Typeahead  from 'react-bootstrap-typeahead'
//import { Typeahead } from 'react-typeahead';

interface PersonProps {
		state: any;
		
}

export class Person extends React.Component<{}, {}> {

		static contextTypes = {
				personService: React.PropTypes.object
		};

		
		private selected:any;
		
		render() {

				console.log(this.personList());
				
				return (
						<div>
								<Typeahead
										options={this.personList()}										
										labelKey="name"
										selected={this.selected}
								/>

						</div>
				);
		}

		private personList() {
				let context:any = this.context;
				return context.personService.personList();
		}
}
