/// <reference path="../../typings/uuid/UUID.d.ts" />


import {Component, Input, Output, Injectable, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {createStore, applyMiddleware, Store, compose} from 'redux';
import {v4} from 'node-uuid'; 
import {List, Record, Map} from 'immutable';
// import {devTools} from 'redux-devtools';
import { TYPEAHEAD_DIRECTIVES } from 'ng2-bootstrap';

// createStore = compose(
// 	devTools(),
// 	createStore
// );

enum PersonStateType {
	empty,
	unknown,
	known
}

interface PersonState {
	type: PersonStateType,
	knownPersonId: string,
	unknownPersonName: string
}

enum PlaneStateType {
	empty,
	unknown,
	known
}

interface PlaneState {
	type: PlaneStateType;
	knownPlaneId: string,
	unknownPlaneRegistration: string
}

// person management
const CREATE_PERSON = 'create_person';

// plane management
const CREATE_PLANE = 'create_plane';

// inside time
const CHANGE_TIMESHEET = 'change_timesheet';

// inside timesheet
const ADD_ENTRY = 'add_entry';
const CHANGE_ENTRY = 'change_entry';

// inside entry
const CHANGE_PRIMARY_SEAT = 'change_primary_seat';
const CHANGE_SECONDARY_SEAT = 'change_secondary_seat';
const CHANGE_PLANE = 'change_plane';
const CHANGE_GLIDER_TIME = 'change_glider_time';

// inside seat
const CHANGE_PERSON = 'change_person';
const CHANGE_ROLE = 'change_role';

// inside plane
const SELECT_KNOWN_PLANE = 'select_known_plane';
const ENTER_PLANE_REGISTRATION = 'enter_plane_registration';

// inside person
const CHANGE_NAME = 'change_name';
const CLEAR_PERSON = 'clear_person';
const SELECT_KNOWN_PERSON = 'select_known_person';

// inside role
const SELECT_ROLE = "select_role";

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
function createPlane(id:string, registration:string, type: string) {

	return {
		type: CREATE_PLANE,
		id,
		registration,
		planeType: type
	}
}

// plane actions
function selectKnownPlane(id:any) {
	return {
		type: SELECT_KNOWN_PLANE,
		id
	}
}

function enterPlaneRegistration(registration:string) {
	return {
		type: ENTER_PLANE_REGISTRATION,
		registration
	}
}

// role actions
function selectRole(id:any) {
	return {
		type: SELECT_ROLE,
		id
	}
}

// person actions

function changeName(name:string) {
	return {
		type: CHANGE_NAME,
		name
	}
}

function clearPerson() {
	return {
		type: CLEAR_PERSON
	}
}

function selectKnownPerson(id:any) {
	return {
		type: SELECT_KNOWN_PERSON,
		id
	}
}

function changeTimesheet(id:any, action:any) {
	return {
		type: CHANGE_TIMESHEET,
		id: id,
		action
	};
}

function changePerson(action: any) {
	return {
		type: CHANGE_PERSON,
		action
	}
}

function changeRole(action: any) {
	return {
		type: CHANGE_ROLE,
		action
	}
}

function changePrimarySeat(action: any) {
	return {
		type: CHANGE_PRIMARY_SEAT,
		action
	};
}

function changeSecondarySeat(action: any) {
	return {
		type: CHANGE_SECONDARY_SEAT,
		action
	};
}

function changePlane(action: any) {
	return {
		type: CHANGE_PLANE,
		action
	};
}

function changeGliderTime(action: any) {
	return {
		type: CHANGE_GLIDER_TIME,
		action
	};
}

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

const PersonRecord = Record({
	type: PersonStateType.empty,
	knownPersonId: '',
	unknownPersonName: ''
});

class Person extends PersonRecord {
	constructor(props) {
		super(props);
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

const RoleRecord = Record({
	id: 0
});

const Role = RoleRecord;


// class Role extends RoleRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const SeatRecord = Record({
	person: new Person({}),
	role: new Role({})
});

const Seat = SeatRecord;

// class Seat extends SeatRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const PlaneRecord = Record({
	type: 'known',
	knownPlaneId: 1
});

const Plane = PlaneRecord;

// class Plane extends PlaneRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const GliderTimeRecord = Record({
	state: 'flying',
	takeoffTime: '',
	landTime: '',
	flyTime: ''
});

const GliderTime = GliderTimeRecord;

// class GliderTime extends GliderTimeRecord {
// 	constructor (props) {
// 		super(props);
// 	}
// }

const EntryRecord = Record({
	id: '',
	primarySeat: new Seat({}),
	secondarySeat: new Seat({}),
	plane: new Plane({}),
	gliderTime: new GliderTime({})
});

const Entry = EntryRecord;

// class Entry extends EntryRecord {
// 	constructor(props) {
// 		super(props);
// 	}
// }

const TimesheetRecord = Record({
	id: '',
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

function planeReducer(state: any, action: any) {
	return state;
}

function gliderTimeReducer(state: any, action: any) {
	return state;
}

function roleReducer(state: any, action: any) {
	switch (action.type) {

	case SELECT_ROLE:

		return action.id;
		
	default:
		return state;
	}
}

const personReducer = (state: any, action: any) => {

	switch (action.type) {
		
	case CHANGE_NAME:

		state = state.set('type', PersonStateType.unknown);
		state = state.set('unknownPersonName', action.name);
		state = state.set('knownPersonId', '');

		return state;
	case SELECT_KNOWN_PERSON:

		state = state.set('type', PersonStateType.known);
		state = state.set('unknownPersonName', '');
		state = state.set('knownPersonId', action.id);

		return state;
		
	default:
		return state;
	}	
}

function seatReducer(state: any, action: any) {

	switch (action.type) {

	case CHANGE_PERSON:
		return state.update('person', personState => personReducer(personState, action.action));

	case CHANGE_ROLE:
		return state.update('role', roleState => roleReducer(roleState, action.action));

	default:
		return state;
	}
}

function itemReducer(state:any, action: any) {


	console.log('itemReducer', action, state.toJSON());
	
	switch (action.type) {

	case CHANGE_PRIMARY_SEAT:
		return state.set('primarySeat', seatReducer(state.primarySeat, action.action));

	case CHANGE_SECONDARY_SEAT:
		return state.set('secondarySeat', seatReducer(state.secondarySeat, action.action));	

	case CHANGE_PLANE:
		return state.set('plane', planeReducer(state.plane, action.action));

	case CHANGE_GLIDER_TIME:
		return state.set('gliderTime', gliderTimeReducer(state.gliderTime, action.action));
		
	default:
		return state;
	}
}

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
			console.log('CHANGE_ENTRY', state.toJSON(), action);

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

function personManagementReducer(state: any, action: any) {

	let personData = new PersonData({
		id: action.id,
		name: action.name,
		club: action.club,
		level: action.level
	});

	let persons = state.persons.push(personData);
	let newState = state.set('persons', persons);

	console.debug('NEWSTATE', newState);

	return newState;
}

function planeManagementReducer(state: any, action: any) {

	let planeData = new PlaneData({
		id: action.id,
		registration: action.registration,
		planeType: action.planeType
	});

	return state.set('planes', state.planes.push(planeData));
}

const initialState = new Root({
	timesheets: List([new Timesheet({id: 'timesheet1'})]),
	persons: List([])
});

function rootReducer(state: any, action: any) {

	if (state == undefined) {

		return initialState;
	}

	switch(action.type) {
	case CHANGE_TIMESHEET:

		let sheets = state.timesheets;
		sheets = sheets.update(sheets.findIndex(x=> x.id == action.id), timesheet => timesheetReducer(timesheet, action.action));

		console.debug('NEW ROOT STATE', sheets.toJSON());

		return state.set('timesheets', sheets);

	case CREATE_PERSON:

		return personManagementReducer(state, action);

	case CREATE_PLANE:

		return planeManagementReducer(state, action);
		
	default:
		return state;
	}
}

const middleware = store => next => action => {

	console.debug('action:', action);

	next(action);
}

@Injectable()
class FcStore {

	private store:Store;
	
	constructor() {
		this.store = createStore(rootReducer, applyMiddleware(middleware));
	}

	public dispatch(action: any): any {
		return this.store.dispatch(action);
	}

	public getState(): any {
		return this.store.getState();
	}	
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
    <div>GliderTime</div>
`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GliderTimeComponent {

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
      [value]="planeRegistration()">
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
      [value]="personName()"
   > 
`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, TYPEAHEAD_DIRECTIVES ]
})
export class PersonComponent {

	private selected:string = '';
	
	@Input() state:PersonState;
	@Output() action:EventEmitter<any> = new EventEmitter<any>();

	constructor(private personService:PersonService) {
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
	
	private personName():string {

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
    <select #roleSelect (change)="roleSelected(roleSelect.value)">
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
		selector: 'fc-entry',
		template:
		`
      <fc-seat [state]="state.primarySeat" [allowedRoles]="primarySeatRoles()" (action)="primarySeatAction($event)"></fc-seat>
      <fc-seat [state]="state.secondarySeat" [allowedRoles]="secondarySeatRoles()" (action)="secondarySeatAction($event)"></fc-seat>
      <fc-plane [state]="state.plane" (action)="planeAction($event)"></fc-plane>
      <fc-glider-time [state]="state.gliderTime" (action)="gliderTimeAction($event)"></fc-glider-time>
    `,
		directives: [SeatComponent, PlaneComponent, GliderTimeComponent],
		changeDetection: ChangeDetectionStrategy.OnPush
	})
export class EntryComponent2 {

	@Input() state:any;
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
    <div>Timesheet
      <div *ngFor="#entry of state.items" *ngForTrackBy="itemTrackBy">
        <fc-entry [state]="entry" (action)="entryAction(entry, $event)"></fc-entry>
      </div>
    </div>
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
	
	private tmp:number = 0;

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

		this.tmp++;
		//		var id = generate();

		this.action.emit(addEntry(this.tmp.toString()));
		
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
	selector: 'fc-app',
	template: `
    <div>
      <fc-timesheet [state]="timesheetState()" (action)="timesheetAction($event)"></fc-timesheet>
    </div>
  `,
	providers: [FcStore, PersonService, RoleService, PlaneService],
	directives: [TimesheetComponent2],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent2 {

	static timesheetId = 'timesheet1';
	
	constructor(
		private store:FcStore,
		private planeService:PlaneService) {

		this.createDummyPersons();
		this.createDummyPlanes();
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

