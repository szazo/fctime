import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {UUID} from '../../common/uuid';
import {FcStore} from '../../common/fc-store';
import {createTimesheet} from './timekeeper.model';

@Component({
  templateUrl: 'app/timekeeper/timekeeper/timesheet-list.template.html',
	directives: [ROUTER_DIRECTIVES]	
})
export class TimesheetListComponent {

	constructor(private store:FcStore) {
	}

	private itemTrackBy(index: number, obj: any) : any {
		return obj.id;
	}

	private createTimesheet() {
		let id = UUID.generate();
		this.store.dispatch(createTimesheet(id));		
	}

	private timesheets() {
		let state = this.store.getState();

		console.log(state.timesheets);
		return state.timesheets;
	}
}
