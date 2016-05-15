export enum RoleType {
	none,
	passenger,
	pic,
	instructor,
	student
}

export class RoleService {

	static roleList = [
		{ id: RoleType.passenger, name: 'Utas' },
		{ id: RoleType.pic, name: 'PIC' },
		{ id: RoleType.instructor, name: 'Oktató' },
		{ id: RoleType.student, name: 'Oktatás / ellenőrzés' }
	];

	public listRoles(filter:RoleType[]):{id: RoleType; name: string}[] {
		return RoleService.roleList;
	}
}
