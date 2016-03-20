import {Component, Input, Output, Injectable, EventEmitter} from 'angular2/core';
import {createStore, applyMiddleware, Store, compose} from 'redux';
//import {generate} from 'UUID'; 
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

function ui(state:any, action: any) {
	switch (action.type)
	{
	case CHANGE_ENTRY:
		{
			var index = state.items.findIndex((item)=>item.id == action.id);
			var item = state.items.get(index);

			return {
				items: state.items.set(index, entry(item, action.action))
			};
		}
	case ADD_ENTRY:

		var modifiedList = state.items.push(
			{id: action.id,
			 name: ''}
		);

		return {
			items: modifiedList
		};
	default:
		return state;
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

function timesheetReducer(state: any, action:any) {

	switch (action.type) {
	case ADD_ENTRY:

		console.log('ADD_ENTRY', state.toJSON(), action);

		let entry = new Entry({id: action.id});
		console.log('The items', state.items.push(entry));

		let newEntries = state.items.push(entry);
		let newState = state.set('items', newEntries);
		
	  // let newState = state.updateIn('items', (items) => items.push(entry)); // 
		return newState;

		// console.log('ADD_ENTRY_AFTER', newState.toJSON());
	}
}

const initialState = {
	timesheets: List([
		new TimesheetRecord(
		{
			id: 'timesheet1',
		  items: List([
				// {
				// 	id: 'entry1',
				// 	primarySeat: {
				// 		person: {
				// 			type: PersonStateType.known,
				// 			knownPersonId: 'person1',
				// 			unknownPersonName: null
				// 		},
				// 		role: {
				// 			id: 1
				// 		}
				// 	},
				// 	secondarySeat: {
				// 	  person: {
				// 			type: PersonStateType.unknown,
				// 			unknownPersonName: 'Utas Pistike'
				// 		},
				// 		role: {
				// 			id: 2
				// 		}
				// 	},
				// 	plane: {
				// 		type: 'known',
				// 		knownPlaneId: 1
				// 	},
				// 	gliderTime: {
				// 		state: 'flying',
				// 		takeoffTime: '',
				// 		landTime: '',
				// 		flyTime: ''
				// 	}
				// }
			])
		})
	]),
	model: {
		persons: List([
			{
				id: 'person1',
				name: 'Bagó Tomi',
				club: 'club1'	
			}
		]),
		clubs: List([
			{
				id: 'club1',
				name: 'Endresz'
			}
		])
	}
}

function rootReducer(state: any, action: any) {

	if (state == undefined) {
		return initialState;
	}

	switch(action.type) {
	case CHANGE_TIMESHEET:

		let sheets = state.timesheets;
		sheets = sheets.update(sheets.findIndex(x=> x.id == action.id), timesheet => timesheetReducer(timesheet, action.action));

		console.log('NEW ROOT STATE', sheets.toJSON());
		
		return {
			timesheets: sheets
		};
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

@Component({
	selector: 'fc-glider-time',
	template: `
    <div>GliderTime</div>
  `
})
export class GliderTimeComponent {

}

@Component({
	selector: 'fc-plane',
	template: `
    <div>plane</div>
`
})
export class PlaneComponent {
	
}

interface Action {
}

@Component({
	selector: 'fc-person',
	template: `
    <input #name (change)="changeName(name.value)" [value]="personName()">
`
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
  `
})
export class RoleComponent {

}

@Component({
	selector: 'fc-seat',
	template: `
    <fc-person [state]="personState()" (action)="personAction($event)"></fc-person>
    <fc-role></fc-role>
  `,
	directives: [PersonComponent, RoleComponent]
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
		directives: [SeatComponent, PlaneComponent, GliderTimeComponent]
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
      <div *ngFor="#entry of entries()">
        <fc-entry [state]="entry" (action)="entryAction(entry, $event)"></fc-entry>
      </div>
    </div>
    <div>
      <button (click)="add()">Add</button>
    </div>
`,
	providers: [FcStore],
	directives: [EntryComponent2]
})
export class TimesheetComponent2 {

	@Input() state;
	@Output() action = new EventEmitter();
	
	private tmp:number = 0;

	private entryAction(entry, action) {

		console.log('entryChanged', action);
		
		this.action.emit(changeEntry(entry.id, action));
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
	directives: [TimesheetComponent2]
})
export class AppComponent2 {

	static timesheetId = 'timesheet1';
	
	constructor(private store:FcStore) {
	}

	private timesheetState() {
		let state = this.store.getState();

		console.log('The current state', state);
		
		let timesheet = state.timesheets.toArray().find(x => x.id == AppComponent2.timesheetId);

		return timesheet;
	}

	private timesheetAction(action) {

		console.log('TimesheetChanged', action);

		this.store.dispatch(changeTimesheet(AppComponent2.timesheetId, action));
	}
}

