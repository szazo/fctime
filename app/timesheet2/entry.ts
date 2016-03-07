
import {Store2,EventRef, EventData, EventStore} from './event-store';
import {Component, Input} from 'angular2/core';
import {Dispatcher} from './dispatcher';
import {TimeComponent, TimeStore} from './time';
import {PersonComponent, PersonStore} from './seat';

export interface StoreFacade2<TState> {
	executeAction(name:string, payload:any);
	getState():TState;
}

export interface Actuator<TState> {

	executeAction(currentState:TState, name:string, payload:any):EventData;
}

class StoreFacadeImpl<TState> implements StoreFacade2<TState> {

	private eventRef:EventRef;
	private theState:TState;

	public executeAction(name:string, payload:any) {
		var eventData:EventData = {
			name: name,
			payload: payload
		};
	}

	public getState():TState {
		return null;
	}
}

export class StoreComponentFacade {

	public register<TState>(scope:any, listener:(store:StoreFacade2<TState>) => void) {
		
	}	
}

export class StoreManager {
  constructor(
    private eventStore:EventStore,
    private dispatcher:Dispatcher) {
		
  }

	public createStore<T>(storeType:string, ref:EventRef):StoreFacade2<T> {

		var store:Store2;
		switch (storeType){
		case 'time': {
			store = new TimeStore(this.dispatcher, this.eventStore);
			break;
		}
		case 'person': {
			store = new PersonStore(this.eventStore, this.dispatcher);
			break;
		}
		}
		
		store.load(ref);

		return null;
	}
	
	public destroyStore(storeType:string, scope:any) {

	}
}

class StateManager {
	public loadState(eventRef:EventRef):any {
	}
}

export class EntryStore {

  private state:EntryState = new EntryState();
  private ref:EventRef;

	private personRef:EventRef;
	private timeRef:EventRef;
	
  constructor(
    private eventStore:EventStore,
    private dispatcher:Dispatcher,
		private storeManager:StoreManager) {
  }

  public load(ref:EventRef) {
  }

  public create(scope:any, id:any):EventRef {
    this.ref = {
      scope: scope,
      revision: 0
    };

    // TODO: a gyerek store-ok valahogy nem itt kellenenek
		this.timeRef = {
			scope: scope + ':time',
			revision: 0
		};
		this.storeManager.createStore('time', this.timeRef);

		this.personRef = {
			scope: scope + ':' + 'person',
			revision: 0
		};

		this.storeManager.createStore('person', this.personRef);		
		this.dispatcher.register(this.personRef.scope, 'storeChanged', (data) => {
			console.log("Person storeChanged", data);
		});
		
		
    var evt:EventData = {
      name: 'create',
      payload: id
    };

    this.apply(evt);

    return this.ref;

    // we reference to the created state
    //console.log('entry ref', this.ref);
    //this.dispatcher.dispatch(scope, 'create', this.ref);
  }

  private apply(evt:EventData) {
    this.ref = this.eventStore.commit(this.ref, evt);
    this.state.mutate(evt);
  }
}

class EntryState {
  public id:any;

  public mutate(evt:EventData) {

    switch (evt.name) {

      case 'create': {
        this.id = evt.payload.id;

        break;
      }
      default:
        throw new Error(evt.name);
    }
  }
}

@Component({
  selector: 'fc-entry',
  template: `
    <div>Entry</div>
    <input #control type="text" [value]="currentValue()" (change)="changeValue(control.value)">
  `,
  directives: [TimeComponent,PersonComponent]
})
export class EntryComponent {
  @Input() scope:any;

	private currentFacade:StoreFacade2<EntryState>;

	constructor(
		private storeFacade:StoreComponentFacade) {

	}

	private changeValue(value:string) {
		this.currentFacade.executeAction('changeValue', value);
	}

	private currentValue() {
		return this.currentFacade.getState().id;
	}

	private ngOnInit() {
		this.storeFacade.register<EntryState>(this.scope,
																					(facade) =>
																					{
																						this.currentFacade = facade;
																					});
	}
}
