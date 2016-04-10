/// <reference path="./react-bootstrap-typeahead" />

import * as React from 'react';

import * as ExternalLib from 'react-bootstrap-typeahead';

let ExternalTypeahead = ExternalLib.default;

export enum TypeaheadSelectionType {
		unknown,
		known
}

export class TypeaheadSelection {

		type: TypeaheadSelectionType;
		knownId: any;
		unknownText: string;

		public static known(id:any) {
				let selection:TypeaheadSelection = {
						type: TypeaheadSelectionType.known,
						knownId: id,
						unknownText: ''
				};

				return selection;
		}

		public static unknown(text:string) {
				let selection:TypeaheadSelection = {
						type: TypeaheadSelectionType.unknown,
						knownId: '',
						unknownText: text
				};

				return selection;
		}		
}

interface TypeaheadProps {
		options: any[],
		idKey: string,
		labelKey: string,
		allowNew?: boolean,
		multiple?: boolean,

		selected: TypeaheadSelection[];
		onSelected(items:TypeaheadSelection[]);
}

export class Typeahead extends React.Component<TypeaheadProps, {}> {

		constructor() {
				super();

				this.handleChange = this.handleChange.bind(this);
		}
		
		render() {
 				return <ExternalTypeahead
				allowNew={this.props.allowNew}
				multiple={this.props.multiple}
				options={this.props.options}										
				labelKey={this.props.labelKey}
				onChange={this.handleChange}
				placeHolder="Első ülés"
				selected={this.currentValues()}
				/>

		}

		private currentValues():Object[] {

				let selected:TypeaheadSelection[] = this.props.selected;

				if (!selected || selected.length == 0) {
						return [];
				}

				let values = selected.map((item:TypeaheadSelection) => {

						switch (item.type) {
								case TypeaheadSelectionType.known:
										return this.props.options.find((option) => option[this.props.idKey] == item.knownId);

								case TypeaheadSelectionType.unknown:
										let unknown = {};
										unknown[this.props.labelKey] = item.unknownText;
										return unknown;
						}
				});

				return values;
		}

		private handleChange(selected: any[]) {

				let resultItems = selected.map((item) => {
				
 						if (item.customOption) {

								return TypeaheadSelection.unknown(item[this.props.labelKey]);

						} else {

								return TypeaheadSelection.known(item[this.props.idKey]);
						}
				});

				this.props.onSelected(resultItems);
		}
}
