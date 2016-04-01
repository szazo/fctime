/// <reference path="../../typings/uuid/UUID.d.ts" />


import {Component, Input, Output, Injectable, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {createStore, applyMiddleware, Store, compose} from 'redux';
import {v4} from 'node-uuid'; 
import {List, Record, Map} from 'immutable';
// import {devTools} from 'redux-devtools';
import { TYPEAHEAD_DIRECTIVES } from 'ng2-bootstrap';
import moment from 'moment';

// createStore = compose(
// 	devTools(),
// 	createStore
// );

class uuid {
	public static generate() {
		return v4();
	}
}

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

// inside glider time
const TAKEOFF = 'takeoff';
const LAND = 'land';
const CHANGE_TAKEOFF_TIME = 'change_takeoff_time';
const CHANGE_LAND_TIME = 'change_land_time';
const CHANGE_AIR_TIME = 'change_air_time';

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

// glider time actions
function takeoff(time:string) {
	return {
		type: TAKEOFF,
		time
	}
}

function land(time:string) {
	return {
		type: LAND,
		time
	}
}

function changeTakeoffTime(time:string) {
	return {
		type: CHANGE_TAKEOFF_TIME,
		time
	}
}

function changeLandTime(time:string) {
	return {
		type: CHANGE_LAND_TIME,
		time
	}
}

function changeAirTime(time:string) {
	return {
		type: CHANGE_AIR_TIME,
		time
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

enum GliderTimePhase {
	none,
	flying,
	landed
}

interface GliderTimeState {
	phase: GliderTimePhase,
	takeoffTime: string,
	landTime: string,
	flyTime: string
}

const GliderTimeRecord = Record({
	phase: GliderTimePhase.none,
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

	switch (action.type) {

	case SELECT_KNOWN_PLANE:

		state = state.set('knownPlaneId', action.id);
		state = state.set('type', PlaneStateType.known);
		state = state.set('unknownPlaneRegistration', '');

		return state;

	case ENTER_PLANE_REGISTRATION:

		state = state.set('knownPlaneId', '');
		state = state.set('type', PlaneStateType.unknown);
		state = state.set('unknownPlaneRegistration', action.registration);

		return state;

	default:
		return state;
	}
}

function roleReducer(state: any, action: any) {
	switch (action.type) {

	case SELECT_ROLE:

		return new Role({id: action.id});
		
	default:
		return state;
	}
}

function gliderTimeReducer(state: any, action: any) {

	switch (action.type) {

	case TAKEOFF:

		state = state.set('phase', GliderTimePhase.flying);
		state = state.set('takeoffTime', action.time);

		return state;

	case LAND:

		state = state.set('phase', GliderTimePhase.landed);
		state = state.set('landTime', action.time);

		return state;

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

class ActionLogItem {
	id: string;
	action:any;
}

@Injectable()
class ActionLog {

	private logItems:ActionLogItem[] = [];
	private isEnabled:boolean = true;

	public clear() {
    window.localStorage.removeItem('fc-actions');
		this.logItems = [];
	}
	
	public load() {
		let read = window.localStorage.getItem('fc-actions');

		if (read) {
			this.logItems = JSON.parse(read);
		} else {
			this.logItems = [];
		}

		//console.log('loaded items', this.logItems);
	}

	public actions():ActionLogItem[] {
		return this.logItems;
	}
	
	public middleware = store => next => action => {
		next(action);

		if (this.isEnabled) {
			this.add(action, null);
		}
	}

	public enable() {
		this.isEnabled = true;
	}

	public disable() {
		this.isEnabled = false;
	}

	private add(action:any, nextState:any)
	{
		var logItem = new ActionLogItem();
		logItem.id = v4();
		logItem.action = action;

		this.store(logItem);
	}

	private store(logItem:ActionLogItem) {

		this.logItems.push(logItem);
		
		var json = JSON.stringify(this.logItems);

//		console.log('storing json', json);
		
		window.localStorage.setItem('fc-actions', json);
//		logItem.toJSON();
	}	
}

@Injectable()
class FcStore {

	private store:Store;
	
	constructor(private actionLog:ActionLog) {

		actionLog.load();
		
		this.store = createStore(
			rootReducer,
			applyMiddleware(middleware, actionLog.middleware)
		);
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
   <div>ez a lista</div>
`
})
export class TimesheetsComponent {
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
	{path: '/alma', name: "Timesheets", component: TimesheetsComponent},
	{path: '/day/:id', name: "Timesheet", component: TimesheetComponent3}
])
export class AppComponent2 {

	static timesheetId = 'timesheet1';
	
	constructor(
		private actionLog:ActionLog,
		private store:FcStore,
		private planeService:PlaneService) {

		console.log(this.localStorageSpace());
		
		this.load();
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

