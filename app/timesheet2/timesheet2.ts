import {Component, Input, Injectable} from 'angular2/core';
import {createStore, Store} from 'redux';
//import {generate} from 'UUID'; 
import {List, Record, Map} from 'immutable';


const initialState = {
	ui: {
		items: List([])
	}
}

const ADD_ENTRY = 'add_entry';
const CHANGE_ENTRY = 'change_entry';
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

function rootReductor(state: any, action: any) {

	if (state == undefined) {

		return initialState;
	}

	var newState = {
		ui: ui(state.ui, action)
	};

	return newState;	
}

@Injectable()
class FcStore {

	private store:Store;
	
	constructor() {
		this.store = createStore(rootReductor);
	}

	public dispatch(action: any): any {
		return this.store.dispatch(action);
	}

	public getState(): any {
		return this.store.getState();
	}	
}

@Component(
	{
		selector: 'fc-entry',
		template:
		`
      <input #personName type="text" (change)="changeTheName(personName.value)" [value]="getName()">
    `})
export class EntryComponent2 {

	@Input() state:any;
	@Input() action:any;
	
	public getName():string {
		return this.state.name;
	}

	private changeTheName(name:string) {
		console.log(this.action);
		var changed = changeName(name);
		console.log(changed);
		this.action(changed);
	}
}

@Component({
  selector: 'fc-timesheet',
  template: `
    <div>
      <div *ngFor="#item of items()">
        <fc-entry [state]="item.state" [action]="item.action" ></fc-entry>
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

	private tmp:number = 0;

	constructor(private store: FcStore) {
	}

	private items() {
		var theItems = this.store.getState().ui.items.toArray().map((item) => {
			return { state: item, action: (ac) => {
				var entryAction = changeEntry(item.id, ac);
//				console.log('entryAction', entryAction);
				this.store.dispatch(entryAction);
			}};
		});

		console.log(theItems);

		return theItems;
	}

  private add() {

		this.tmp++;
//		var id = generate();
		this.store.dispatch(addEntry(this.tmp.toString()));
		
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

