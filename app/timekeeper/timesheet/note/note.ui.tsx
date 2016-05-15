import * as React from 'react';

import { Typeahead, TypeaheadSelection, TypeaheadSelectionType } from '../../../common/typeahead';
import { FluxProps } from '../../../common/flux-props';

import { TagService } from '../../common/tag-service';
import { updateTags, TagType, Tag } from './note.model';

export class Note extends React.Component<FluxProps, {}> {

		private tagService:TagService;
		
		constructor() {
				super();

				this.tagService = new TagService();
		}
		
		render() {

				return (
						<div>
								<Typeahead
										options={this.tagList()}
										labelKey="label"
										idKey="id"
										selected={this.selected()}
										onSelected={this.typeaheadSelected.bind(this)}
										allowNew={true}
										multiple={true}
								/>							
						</div>
				);
		}

		private tagList() {
				return this.tagService.listTags();
		}

		private typeaheadSelected(values:TypeaheadSelection[]) {

				if (values.length == 0) {
						this.props.dispatch(updateTags([]));
				}

				let tags:Tag[] = values.map((value) => {

						switch (value.type) {
								case TypeaheadSelectionType.known:
										return { type:TagType.known, id:value.knownId }
								case TypeaheadSelectionType.unknown:
										return { type:TagType.unknown, unknownLabel:value.unknownText }
						}						
				});

				this.props.dispatch(updateTags(tags));
		}		

		private selected():TypeaheadSelection[] {

			  let state = this.props.state();
				
				let selected = state.tags.map((tag) => {

						switch (tag.type) {
								case TagType.known:
										return TypeaheadSelection.known(tag.id);
								case TagType.unknown:
										return TypeaheadSelection.unknown(tag.unknownLabel);
						}

				});

				console.log('SELECTED', selected);
				return selected;
		}					
}
