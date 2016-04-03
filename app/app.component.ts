import {Component, ChangeDetectionStrategy,OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {FcStore} from './common/fc-store';
import {PersonService} from './person/person-service';
import {PlaneService} from './plane/plane-service';
import {TimekeeperComponent} from './timekeeper/timekeeper/timekeeper.component';
import {rootReducer} from './app.model';

@Component({
	selector: 'fc-app',
	templateUrl: 'app/app.html',
	providers: [FcStore, PersonService, PlaneService],
	directives: [ROUTER_DIRECTIVES],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@RouteConfig([
	{
		path: '/timekeeper/...',
		name: 'Timekeeper',
		component: TimekeeperComponent,
		useAsDefault: true
	}
])
export class AppComponent implements OnInit {

	static timesheetId = 'timesheet1';
	
	constructor(
		private store:FcStore,
		private planeService:PlaneService) {

		console.log(this.localStorageSpace());
	}

	public ngOnInit() {
		this.store.load(rootReducer);
	}

	private localStorageSpace(){
    var allStrings = '';
    for(var key in window.localStorage){
      if(window.localStorage.hasOwnProperty(key)){
        allStrings += window.localStorage[key];
      }
    }
    return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
  }

	/*
	private createDummyPlanes() {
		
		this.planeService.createPlane(this.uuid(), 'HA-5560', 'R22');
		this.planeService.createPlane(this.uuid(), 'HA-5524', 'Astir CS');
		this.planeService.createPlane(this.uuid(), 'HA-5065', 'KA-7');
	}

	private createDummyPersons() {

		this.dispatch(createPerson(this.uuid(), 'Oláh Attila', 'Endresz', 'C'));
		this.dispatch(createPerson(this.uuid(), 'Bagó Tomi', 'Endresz', 'C'));
		this.dispatch(createPerson(this.uuid(), 'Juhász Dani', 'Endresz', 'C'));
		this.dispatch(createPerson(this.uuid(), 'Sall Pisti', 'Endresz', 'C'));
		this.dispatch(createPerson(this.uuid(), 'Tóth Balázs', 'Endresz', 'C'));
		
		console.log('record', typeof(PersonDataRecord));
		console.log(this.store.getState().toJSON());
//		this.store.dispatch(createPerson())

	}*/

	private dispatch(action:any) {
		this.store.dispatch(action);
	}

	/*
	private timesheetState() {

		let state = this.store.getState();

		let timesheet = state.timesheets.find(x => x.id == AppComponent2.timesheetId);

		return timesheet;
	}

	private timesheetAction(action) {

		this.store.dispatch(changeTimesheet(AppComponent2.timesheetId, action));
	}*/
}
