export enum TagType {
	none,
	hangar,
	bonus
}

export class TagService {

	static tagList = [
		{ id: TagType.hangar, label: 'Hangárkör' },
		{ id: TagType.bonus, label: 'Bónusz Brigád' }
	];

	public listTags():{id: TagType; label: string}[] {
		return TagService.tagList;
	}
}
