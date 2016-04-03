
import {Component,Input} from 'angular2/core';
import {EventData, EventRef, EventStore} from './event-store';
import {Dispatcher} from './dispatcher.ts';
import {StoreFacade2, StoreComponentFacade} from './entry';

/*
@Component({
	selector: 'fc-role',
	template: `
    <input #role type="text" [value]="role()" (change)="changeRole(role.value)" size="6">
  `
})
class RoleComponent {

	@Input() store:RoleStore;

	private role() {
		return this.store.
	}
}

class RoleStore {

}

class RoleState {

	private roleName:string = '';
	
	public mutate(evt:EventData) {
		switch(evt.name) {
		case 'roleChange':
			this.roleName = evt.payload;
		}
	}
}
*/

@Component({
	selector: 'fc-person',
	template: `
    <div>Person</div>
    <input #person type="text" [value]="personName()" (change)="changeName(person.value)">
  `
})
export class PersonComponent {
	@Input() scope:any;

	private currentFacade:StoreFacade2<PersonState>;
	
	constructor(
		private dispatcher:Dispatcher,
		private storeFacade:StoreComponentFacade) {
	}

	private ngOnInit() {
		this.storeFacade.register<PersonState>(this.scope, (facade) => {
			this.currentFacade = facade;
		});
	}
	
	private personName() {

		this.currentFacade.getState().name;
	}

	public changeName(name:string) {
		this.currentFacade.executeAction('changeName', name);
	}
}

/*
class PersonValidator {

	public validate(state:PersonState) {

	}
}*/

// ez a tiszta uzleti logika, ami action-t kap es
// az aktualis allapot alapjan megcsinalja az eventet
class PersonActuator {

	public executeAction(currentState:PersonState, name:string, payload:any) {
		switch(name) {
		case 'changeName':
			var evt:EventData = {
				name: 'changeName',
				payload: name
			};
			return evt;			
		}
	}
}

//
// ezeket kell elvallasztani:
// - tarolas
// - validacio
// - GUI elem
// - modositas tovabbadas
// - logika, hogy mikor lehet elvegezni
// - a mentett event-et a tarolasi eventtol

// Ez kapja az action-oket
export class PersonStore {

	private ref:EventRef;
	public state:PersonState;
	
	constructor(
		private eventStore:EventStore,
		private dispatcher:Dispatcher) {
		this.state = new PersonState();
	}

	public load(ref:EventRef) {
		this.ref = ref;
	}

	

	public changeName(name:string) {

		// get the state for the ref

//		var actuator = new PersonActuator(this.state);
//		var evt = actuator.changeName(name);

//		this.apply(evt);
	}

  private apply(evt:EventData) {

    this.ref = this.eventStore.commit(this.ref, evt);
    this.state.mutate(evt);

		this.dispatcher.dispatch(this.ref.scope, 'storeChanged', this.ref);
  }
}

export class PersonState {
	public name:string;

	public constructor() {
		this.name = '';
	}

	public mutate(evt:EventData) {
		switch (evt.name) {
		case 'changeName': {

			this.name = evt.payload;
			
			break;
		}
		}
	}
}
