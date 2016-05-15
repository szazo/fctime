import { Record, List } from 'immutable';

const UPDATE_TAGS = 'update_tags';

export enum TagType {
	known,
	unknown
}

export interface Tag {
	type: TagType;
	id?: any,
	unknownLabel?: string
}

export const Note = Record({
	tags: []
})

export function noteReducer(state:any, action:any) {

	switch (action.type) {
	case UPDATE_TAGS:
		return state.set('tags', action.tags);
	default:
		return state;
	}

}

export function updateTags(tags: Tag[]) {
	return {
		type: UPDATE_TAGS,
		tags
	}
}
