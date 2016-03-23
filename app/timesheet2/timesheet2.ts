/// <reference path="../../typings/uuid/UUID.d.ts" />


import {Component, Input, Output, Injectable, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {createStore, applyMiddleware, Store, compose} from 'redux';
import {v4} from 'node-uuid'; 
import {List, Record, Map} from 'immutable';
// import {devTools} from 'redux-devtools';

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
	knownPersonId: number,
	unknownPersonName: string
}

const CREATE_PERSON = 'create_person';


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

// inside person
const CHANGE_NAME = 'change_name';

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

function changeName(name:string) {
	return {
		type: CHANGE_NAME,
		name
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
	knownPersonId: 0,
	unknownPersonName: ''
});

class Person extends PersonRecord {
	constructor(props) {
		super(props);
	}
}

const PersonDataRecord = Record({
	id: 0,
	name: '',
	club: 'Endresz',
	level: ''
});

class PersonData extends PersonDataRecord {
	constructor(props) {
		super(props);
	}

}

const RoleRecord = Record({
	id: 0
});

class Role extends RoleRecord {
	constructor(props) {
		super(props);
	}
}

const SeatRecord = Record({
	person: new Person({}),
	role: new Role({})
});

class Seat extends SeatRecord {
	constructor(props) {
		super(props);
	}
}

const PlaneRecord = Record({
	type: 'known',
	knownPlaneId: 1
});

class Plane extends PlaneRecord {
	constructor(props) {
		super(props);
	}
}

const GliderTimeRecord = Record({
	state: 'flying',
	takeoffTime: '',
	landTime: '',
	flyTime: ''
});

class GliderTime extends GliderTimeRecord {
	constructor (props) {
		super(props);
	}
}

const EntryRecord = Record({
	id: '',
	primarySeat: new Seat({}),
	secondarySeat: new Seat({}),
	plane: new Plane({}),
	gliderTime: new GliderTime({})
});

class Entry extends EntryRecord {
	constructor(props) {
		super(props);
	}
}

const TimesheetRecord = Record({
	id: '',
	items: List([])
});

class Timesheet extends TimesheetRecord {
	constructor(props) {
		super(props);
	}
}

const RootRecord = Record({
	timesheets: List([])
});

class Root extends RootRecord {
	constructor(props) {
		super(props);
	}
}

function planeReducer(state: any, action: any) {
	return state;
}

function gliderTimeReducer(state: any, action: any) {
	return state;
}

const personReducer = (state: any, action: any) => {

	switch (action.type) {
	case CHANGE_NAME:

		state = state.set('type', PersonStateType.unknown);
		state = state.set('unknownPersonName', action.name);

		return state;
	default:
		return state;
	}	
}

function seatReducer(state: any, action: any) {

	console.log('seatReducer', action, state.toJSON());
	
	switch (action.type) {
	case CHANGE_PERSON:

		console.log('changing person');

		return state.update('person', value => personReducer(value, action.action));
//		return state.set('person', personReducer(state.person, action.action));
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
		console.log('The items', state.items.push(entry));

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

			console.log('NEW TIMESHEET STATE', newState.toJSON());
			

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
	
	return state.persons.push(personData);
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

		console.log('NEW ROOT STATE', sheets.toJSON());

		return state.set('timesheets', sheets);

	case CREATE_PERSON:

		return personManagementReducer(state, action);
		
	default:
		return state;
	}
}

const middleware = store => next => action => {

	console.log('action:', action);

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

@Injectable()
class PersonService {

	constructor(private store: FcStore)
	{
	}

	public findPerson(pattern:string) {
		let persons = this.store.getState().persons;

		let regex = new RegExp('.*' + pattern + '.*');
		let found = persons.toArray().find(x => regex.test(x));

		alert('found');
	}
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
    <div>plane</div>
`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaneComponent {
	
}

interface Action {
}

@Component({
	selector: 'fc-person',
	template: `
    <input #name (change)="changeName(name.value)" [value]="personName()">
`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonComponent {

	@Input() state:PersonState;
	@Output() action:EventEmitter<any> = new EventEmitter<any>();

	private personName():string {

		switch (this.state.type)  {
		case PersonStateType.empty:
			return '';
		case PersonStateType.unknown:
			return this.state.unknownPersonName;
		case PersonStateType.known:
			return 'known: ' + this.state.knownPersonId
		};
	}
	
	private changeName(name:string):void {
		let action = changeName(name);
		console.log('person action to emit', action);
		this.action.emit(action);
	}
}

@Component({
	selector: 'fc-role',
	template: `
    <div>role</div>
`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent {

}

@Component({
	selector: 'fc-seat',
	template: `
    <fc-person [state]="personState()" (action)="personAction($event)"></fc-person>
    <fc-role></fc-role>
  `,
	directives: [PersonComponent, RoleComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatComponent {

	@Input() state;
	@Output() action = new EventEmitter();

	private personState() {
		return this.state.person;
	}

	private personAction(action) {
		this.action.emit(changePerson(action));
	}
}

@Component(
	{
		selector: 'fc-entry',
		template:
		`
      <fc-seat [state]="state.primarySeat" (action)="primarySeatAction($event)"></fc-seat>
      <fc-seat [state]="state.secondarySeat" (action)="secondarySeatAction($event)"></fc-seat>
      <fc-plane [state]="state.plane" (action)="planeAction($event)"></fc-plane>
      <fc-glider-time [state]="state.gliderTime" (action)="gliderTimeAction($event)"></fc-glider-time>
    `,
		directives: [SeatComponent, PlaneComponent, GliderTimeComponent],
		changeDetection: ChangeDetectionStrategy.OnPush
	})
export class EntryComponent2 {

	@Input() state:any;
	@Output() action = new EventEmitter();

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

		console.log('entryChanged', action);
		
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
	providers: [FcStore],
	directives: [TimesheetComponent2],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent2 {

	static timesheetId = 'timesheet1';
	
	constructor(private store:FcStore) {
		this.createDummyPersons();
	}

	private createDummyPersons() {

		let id = v4();
		alert(id);
		
//		this.store.dispatch(createPerson())

	}

	private timesheetState() {

		let state = this.store.getState();

		let timesheet = state.timesheets.find(x => x.id == AppComponent2.timesheetId);

		return timesheet;
	}

	private timesheetAction(action) {

		console.log('TimesheetChanged', action);

		this.store.dispatch(changeTimesheet(AppComponent2.timesheetId, action));
	}
}

