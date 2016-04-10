/// <reference path="../../typings/uuid/UUID.d.ts" />


import {Component, Input, Output, Injectable, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, RouterLink, Router} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {createStore, applyMiddleware, Store, compose} from 'redux';
import {v4} from 'node-uuid'; 
import {List, Record, Map} from 'immutable';
// import {devTools} from 'redux-devtools';
import { TYPEAHEAD_DIRECTIVES } from 'ng2-bootstrap';
import moment from 'moment';
import { TimekeeperComponent } from '../timekeeper/timekeeper.component';

// createStore = compose(
// 	devTools(),
// 	createStore
// );

class uuid {
	public static generate() {
		return v4();
	}
}



// person management

// plane management
const CREATE_PLANE = 'create_plane';

// inside entry

// inside seat

// inside plane

// inside person

// inside role

// inside glider time

function addEntry(id:string) {
	return {
		type: ADD_ENTRY,
		id
	}
}

function createPerson(id:string, name:string, club:string, level:string) {

	return {
		type: CREATE_PERSON,
		id,
		name,
		club,
		level
	}
}

// plane management

// plane actions

// role actions
function selectRole(id:any) {
	return {
		type: SELECT_ROLE,
		id
	}
}

// glider time actions

// person actions




function changeEntry(id:any, action:any) {
	return {
		type: CHANGE_ENTRY,
		id: id,
		action
	};
}

function entry(state:any, action: any) {
	switch (action.type) {
	case CHANGE_NAME:
		return {
			id: state.id,
			name:action.name
		};
	default: {
		return state;
	}
	}
}


const PersonDataRecord = Record({
	id: '',
	name: '',
	club: 'Endresz',
	level: ''
});

const PersonData = PersonDataRecord;

const PlaneDataRecord = Record({
	id: '',
	registration: '',
	type: ''
});

const PlaneData = PlaneDataRecord;

/*
class PersonData extends PersonDataRecord {
	constructor(props) {
		super(props);
	}

}*/



// class Role extends RoleRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }


// class Seat extends SeatRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const PlaneRecord = Record({
	type: PlaneStateType.empty,
	knownPlaneId: '',
	unknownPlaneRegistration: ''
});

const Plane = PlaneRecord;

// class Plane extends PlaneRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }


// class GliderTime extends GliderTimeRecord {
// 	constructor (props) {
// 		super(props);
// 	}
// }


// class Entry extends EntryRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const TimesheetRecord = Record({
	id: '',
	date: '',
	place: '',
	items: List([])
});

const Timesheet = TimesheetRecord;

// class Timesheet extends TimesheetRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const RootRecord = Record({
	timesheets: List([]),
	persons: List([]),
	planes: List([])
});

const Root = RootRecord;

// class Root extends RootRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }






function timesheetReducer(state: any, action:any) {

	switch (action.type) {
	case ADD_ENTRY:
		{
		console.log('ADD_ENTRY', state.toJSON(), action);

		let entry = new Entry({id: action.id});

		let newEntries = state.items.push(entry);
		let newState = state.set('items', newEntries);

//			console.log('NEW ENTRY', entry.toJSON());
			
	  // let newState = state.updateIn('items', (items) => items.push(entry)); // 
		return newState;
		}
	case CHANGE_ENTRY:
		{
			let items = state.items;
			let newItems = items.update(items.findIndex(x => x.id == action.id), item => itemReducer(item, action.action));

			let newState =	state.set('items', newItems);
			
			// let sheets = state.timesheets;
			// sheets = sheets.update(sheets.findIndex(x=> x.id == action.id), timesheet => timesheetReducer(timesheet, action.action));

//			console.log('NEW TIMESHEET STATE', newState.toJSON());
			

			// console.log('ADD_ENTRY_AFTER', newState.toJSON());
			return newState;
		}
	default:
		return state;	
	}
}


function planeManagementReducer(state: any, action: any) {

	let planeData = new PlaneData({
		id: action.id,
		registration: action.registration,
		planeType: action.planeType
	});

	return state.set('planes', state.planes.push(planeData));
}





enum RoleType {
	none,
	passenger,
	pic,
	instructor,
	student
}

@Injectable()
class RoleService {

	static roleList = [
		{ id: RoleType.passenger, name: 'Utas' },
		{ id: RoleType.pic, name: 'PIC' },
		{ id: RoleType.instructor, name: 'Oktató' },
		{ id: RoleType.student, name: 'Oktatás / ellenőrzés' }
	];

	public list(filter:RoleType[]) {
		return RoleService.roleList;
	}
}

@Injectable()
class PlaneService {

	constructor(private store: FcStore) {
	}

	public createPlane(id:any, registration:string, type:string) {
		this.store.dispatch(createPlane(id, registration, type));
	}
	
	public planeList() {
		return this.store.getState().planes.toArray();
	}

	public findById(id:any):any {
		var found = this.store.getState().planes.toArray().find(x => x.id == id);

		return found;
	}	
}

@Injectable()
class PersonService {

	constructor(private store: FcStore)
	{
	}

	public personList() {
		return this.store.getState().persons.toArray();
	}

	public findById(id:any):any {
		var found = this.store.getState().persons.toArray().find(x => x.id == id);

		return found;
	}

	// public findPerson(pattern:string) {
	// 	let persons = this.store.getState().persons;

	// 	let regex = new RegExp('.*' + pattern + '.*');
	// 	let found = persons.toArray().find(x => regex.test(x));

	// 	alert('found');
	// }
}

@Component({
	selector: 'fc-glider-time',
	template: `
    <div>

      <div *ngIf="isNone()">
        <button class="takeoff-button" (click)="takeoff()">Felszállás</button>
      </div>
      <div *ngIf="isFlying() || isLanded()">
        <input type="text" [value]="takeoffTime()" size="6">
      </div>

      <div *ngIf="isFlying()">
        <button class="land-button" (click)="land()">Leszállt</button>
      </div>
      <div *ngIf="isLanded()">
        <input type="text" [value]="landTime()" size="6">
      </div>

      <div *ngIf="isFlying()" class="flying-air-time">
        {{flyingAirTime()}}
      </div>
      <div *ngIf="isLanded()">
        <input type="text" [value]="airTime()" size="6">
      </div>
    </div>
`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GliderTimeComponent {

	@Input() state:GliderTimeState;
	@Output() action = new EventEmitter();

	constructor() {
	}
	
	private takeoff() {

		let currentTime = moment().format();		
		this.action.emit(takeoff(currentTime));
		
	}

	private land() {

		let currentTime = moment().format();
		this.action.emit(land(currentTime));
	}

	private takeoffTime():string {
		return this.state.takeoffTime;
	}

	private landTime():string {
		return this.state.landTime;
	}

	private flyingAirTime():string {

		return this.airTime();
	}

	private airTime() {

    var takeoff = moment(this.state.takeoffTime);
    var land = moment(this.state.landTime);
    var diff = land.diff(takeoff, 'minutes');
		
		return diff.toString();
	}

	private isNone():boolean {
		return this.state.phase == GliderTimePhase.none;
	}

	private isFlying():boolean {
		return this.state.phase == GliderTimePhase.flying;
	}
	
	private isLanded():boolean {
		return this.state.phase == GliderTimePhase.landed;
	}
}

@Component({
	selector: 'fc-plane',
	template: `
    <input
      #registration
      [typeahead]="typeaheadList()"
      [(ngModel)]="selected"
      [typeaheadOptionField]="'registration'"
      (typeaheadOnSelect)="typeaheadSelected($event.item)"
      (change)="enterRegistration(registration.value)"
   >
`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [ TYPEAHEAD_DIRECTIVES ]
})
export class PlaneComponent {

	// not used but necessary for the typeahead component
	private selected:string = '';

	@Input() state:PlaneState;
	@Output() action:EventEmitter<any> = new EventEmitter<any>();

	constructor(private planeService:PlaneService) {
	}

	private typeaheadList() {

		return this.planeService.planeList();
	}

	private typeaheadSelected(item:any) {
		this.action.emit(selectKnownPlane(item.id));
	}

	private enterRegistration(registration:string) {
		this.action.emit(enterPlaneRegistration(registration));
	}

	private ngOnInit() {
		this.selected = this.planeRegistration();
	}

	private planeRegistration() {

		switch (this.state.type) {

		case PlaneStateType.empty:
			return '';

		case PlaneStateType.known:
			return this.planeService.findById(this.state.knownPlaneId).registration;

		case PlaneStateType.unknown:

			return this.state.unknownPlaneRegistration;
		}
	}
}

interface Action {
}

@Component({
	selector: 'fc-person',
	template: `
    <input 
      #name
      [typeahead]="typeaheadList()" 
      [(ngModel)]="selected" 
      [typeaheadOptionField]="'name'"
      (typeaheadOnSelect)="typeaheadSelected($event.item)"
      (change)="changeName(name.value)"
   > 
`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, TYPEAHEAD_DIRECTIVES ]
})
export class PersonComponent {

	private selected = '';
	
	@Input() state:PersonState;
	@Output() action:EventEmitter<any> = new EventEmitter<any>();

	constructor(private personService:PersonService) {
//		this.selected = '';
	}
	
	private typeaheadList() {
		return this.personService.personList();
	}

	private typeaheadSelected(item) {
		this.action.emit(selectKnownPerson(item.id));
	}

	private changeName(name:string) {

		if (name.trim().length == 0) {
			this.action.emit(clearPerson());
		}

		this.action.emit(changeName(name));
	}

	private ngOnInit() {
		this.selected = this.getPersonName();
	}

	private getPersonName():string {

		console.error('CURRENT', this.state.type);
		
		switch (this.state.type)  {

		case PersonStateType.empty:
			return '';

		case PersonStateType.unknown:
			return this.state.unknownPersonName;

		case PersonStateType.known:

			let person = this.personService.findById(this.state.knownPersonId);

			return person.name;
		};
	}
}

@Component({
	selector: 'fc-role',
	template: `
    <select #roleSelect [ngModel]="selected()" (change)="roleSelected(roleSelect.value)">
      <option *ngFor="#role of allowedRoles" value="{{role.id}}">{{role.name}}</option>
    </select>
`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent {

	@Input() state;
	@Input() allowedRoles;
	
	@Output() action = new EventEmitter();

	private roleSelected(id:any) {
		this.action.emit(selectRole(id));
	}

	private selected():string {

		return this.state.id;
	}
}

@Component({
	selector: 'fc-seat',
	template: `
    <fc-person [state]="personState()" (action)="personAction($event)"></fc-person>
    <fc-role [state]="roleState()" [allowedRoles]="allowedRoles" (action)="roleAction($event)"></fc-role>
  `,
	directives: [PersonComponent, RoleComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatComponent {

	@Input() state;
	@Input() allowedRoles;
	
	@Output() action = new EventEmitter();

	private personState() {
		return this.state.person;
	}

	private personAction(action) {
		this.action.emit(changePerson(action));
	}

	private roleState() {
		return this.state.role;
	}

	private roleAction(action) {
		this.action.emit(changeRole(action));
	}
}

@Component(
	{
		selector: '[fc-entry]',
		template:
		`
      <td>
       <fc-seat [state]="state.primarySeat" [allowedRoles]="primarySeatRoles()" (action)="primarySeatAction($event)"></fc-seat>
      </td>
      <td>
      <fc-seat [state]="state.secondarySeat" [allowedRoles]="secondarySeatRoles()" (action)="secondarySeatAction($event)"></fc-seat>
      </td>
      <td>
      <fc-plane [state]="state.plane" (action)="planeAction($event)"></fc-plane>
      </td>
      <td>
      <fc-glider-time [state]="state.gliderTime" (action)="gliderTimeAction($event)"></fc-glider-time>
      </td>
    `,
		directives: [SeatComponent, PlaneComponent, GliderTimeComponent],
		changeDetection: ChangeDetectionStrategy.OnPush
	})
export class EntryComponent2 {

	@Input('fc-entry') state:any;
	@Output() action = new EventEmitter();

	constructor(private roleService:RoleService) {
	}
	
	private primarySeatRoles() {
		return this.roleService.list([]);
	}

	private secondarySeatRoles() {
		return this.roleService.list([]);
	}
	
	private primarySeatAction(action) {
		this.action.emit(changePrimarySeat(action));
	}

	private secondarySeatAction(action) {
		this.action.emit(changeSecondarySeat(action));
	}

	private planeAction(action) {
		this.action.emit(changePlane(action));
	}

	private gliderTimeAction(action) {
		this.action.emit(changeGliderTime(action));
	}
}

@Component({
  selector: 'fc-timesheet',
  template: `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Első ülés</th>
          <th>Második ülés</th>
          <th>Vitorla</th>
          <th>Vitorla idő</th>
        </tr>
      </thead>
      <tr *ngFor="#entry of state.items" *ngForTrackBy="itemTrackBy" [fc-entry]="entry" (action)="entryAction(entry, $event)">
      </tr>
    </table>
    <div>
      <button (click)="add()">Add</button>
    </div>
`,
	providers: [FcStore],
	directives: [EntryComponent2],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetComponent2 {

	@Input() state;
	@Output() action = new EventEmitter();
	
	private entryAction(entry, action) {

		this.action.emit(changeEntry(entry.id, action));
	}

	private itemTrackBy(index: number, obj: any) : any {
		return index;
	}

	private entries() {

		var entries = this.state.items;

		return entries;
		
// 		var timesheet = this.state.timesheets;

// 		console.log('timesheet', timesheet);
		
// 		var thItems = this.store.getState().ui.items.toArray().map((item) => {
// 			return { state: item, action: (ac) => {
// 				var entryAction = changeEntry(item.id, ac);
// //				console.log('entryAction', entryAction);
// 				this.store.dispatch(entryAction);
// 			}};
// 		});

// 		console.log(theItems);

// 		return theItems;
	}

  private add() {

		let id = uuid.generate();
		//		var id = generate();

		this.action.emit(addEntry(id));
		
    // a felhasznalo rakattintott a hozzaadasra
		// ezt az akaratot kell eltarolnunk

		// vegul addig gyujtjuk az action-oket, amig azok egy helyes
		// allapotot allitanak elo, ezt fogjuk merge-elni a fo allapotba,
		// addig az egesz csak egy atmeneti, ez egy kulonallo funkcio

		// ez az action kivalthat tovabbi action-oket, kulonbozo scope-okban
		// es ez az ami tovabbmegy, attol fuggoen, hogy mi a helyes, de
		// ami a lenyeg, az a felhasznalo action-je, ez mar belso rendszer action

    // a kovetkezo, hogy hogyan taroljuk a causal lancot, ami az allapothoz
		// juttatott, eleg csak a root-okat tarolni, es esetleg a root-ok
		// kozti osszefuggest? itt igazabol csak az kell, hogy a felhasznalo
		// milyen allapotot latott, amikor csinalta es kell az action-nek
		// egy id
		
		//this.dispatcher.dispatch('timesheet', 'add', {id: 'id'});
		
//    this.timesheetStore.addEntry();
  }
}

@Component({
	template: `
   <button class="btn btn-primary" (click)="createTimesheet()">Új üzemnap</button>
   <table class="table table-striped table-hover">
     <tr>
       <th>Id</th>
       <th>Dátum</th>
       <th>Helyszín</th>
     </tr>
     <tr *ngFor="#item of timesheets()" *ngForTrackBy="itemTrackBy">
       <td><a [routerLink]="['Timesheet', {id: item.id}]">{{ item.id }}</a></td>
       <td></td>
       <td></td>
     </tr>
<!--     <tr *ngFor="#item of state" *ngForTrackBy="itemTrackBy" [fc-timesheet2]="item" (action)="timesheetAction(item, $event)">-->
   </table>
   <div>ez a lista</div>
`,
	directives: [ROUTER_DIRECTIVES]
})
export class TimesheetsComponent {

	constructor(private store:FcStore) {
	}

	private itemTrackBy(index: number, obj: any) : any {
		return obj.id;
	}

	private createTimesheet() {
		let id = uuid.generate();
		//		this.action.emit(createTimesheet(id));
		this.store.dispatch(createTimesheet(id));		
	}

	private timesheets() {
		let state = this.store.getState();

		console.log(state.timesheets);
		return state.timesheets;
	}

	/*
	private timesheetState() {

		let state = this.store.getState();

		let timesheet = state.timesheets.find(x => x.id == AppComponent2.timesheetId);

		return timesheet;
	}

	private timesheetAction(action) {

		this.store.dispatch(changeTimesheet(AppComponent2.timesheetId, action));
	}	*/
}

@Component({
	template: `
   <div>ez egy a lista</div>
`
})
export class TimesheetComponent3 {

}

@Component({
	selector: 'fc-app',
	templateUrl: 'app/app.html',
	providers: [ActionLog, FcStore, PersonService, RoleService, PlaneService],
	directives: [TimesheetComponent2, ROUTER_DIRECTIVES],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@RouteConfig([
	{
		path: '/timekeeper/...',
		name: 'Timekeeper',
		component: TimekeeperComponent,
		useAsDefault: true
	},
	{path: '/timesheets', name: "Timesheets", component: TimesheetsComponent},
	{path: '/timesheets/:id', name: "Timesheet", component: TimesheetComponent3}
])
export class AppComponent2 {

	static timesheetId = 'timesheet1';
	
	constructor(
		private actionLog:ActionLog,
		private store:FcStore,
		private planeService:PlaneService,
	  private router:Router) {

		console.log(this.localStorageSpace());
		
		this.load();
	}

	private timesheetsSelected() {
		this.router.navigate( ['Timesheets', {   } ])
		alert('timesheets');
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

	private load() {

//		this.actionLog.clear();
		this.actionLog.load();
		if (this.actionLog.actions().length > 0) {

			console.log('we have data, loading...');
			
			// we have data
			this.actionLog.disable();
			
			let actions = this.actionLog.actions();
			for (var i in actions) {
				var action = actions[i].action;
				this.store.dispatch(action);
			}

			this.actionLog.enable();			
		} else {

			console.log('we have no data, create new');
			
			// we have no data
			this.createDummyPersons();
			this.createDummyPlanes();			
		}
	}

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

	}

	private dispatch(action:any) {
		this.store.dispatch(action);
	}

	private uuid() {
		return v4();
	}

	private timesheetState() {

		let state = this.store.getState();

		let timesheet = state.timesheets.find(x => x.id == AppComponent2.timesheetId);

		return timesheet;
	}

	private timesheetAction(action) {

		this.store.dispatch(changeTimesheet(AppComponent2.timesheetId, action));
	}
}

