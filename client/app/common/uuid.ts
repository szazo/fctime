import {v4} from 'node-uuid'; 

export class UUID {

	public static generate() {
		return v4();
	}
}
