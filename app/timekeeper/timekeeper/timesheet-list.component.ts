import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {UUID} from '../../common/uuid';
import {State} from '../../common/fc-store';
import {createTimesheet} from './timekeeper.model';

@Component({
  templateUrl: 'app/timekeeper/timekeeper/timesheet-list.template.html',
	directives: [ROUTER_DIRECTIVES]	
})
export class TimesheetListComponent {

	@Input() state:any;
	@Output() action = new EventEmitter();
	
	private itemTrackBy(index: number, obj: any) : any {
		return obj.id;
	}

	private createTimesheet() {
		let id = UUID.generate();
		this.action.emit(createTimesheet(id));
	}

	private timesheets() {
		let state = this.state;

		console.log(state.timesheets);
		return state.timesheets;
	}
}
