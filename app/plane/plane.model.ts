const CREATE_PLANE = 'create_plane';

function createPlane(id:string, registration:string, type: string) {

	return {
		type: CREATE_PLANE,
		id,
		registration,
		planeType: type
	}
}
