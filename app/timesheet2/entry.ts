import {EventRef, EventData, EventStore} from './event-store';
import {Component, Input} from 'angular2/core';
import {Dispatcher} from './dispatcher';
import {TimeComponent, TimeStore} from './time';

export class EntryStore {

  private state:EntryState = new EntryState();
  private ref:EventRef;

  public timeStore:TimeStore;

  constructor(
    private eventStore:EventStore,
    private dispatcher:Dispatcher) {
  }

  public load(ref:EventRef) {
  }

  public create(scope:any, id:any):EventRef {
    this.ref = {
      scope: scope,
      revision: 0
    };

    // TODO: a gyerek store-ok valahogy nem itt kellenenek
    this.timeStore = new TimeStore(this.dispatcher, this.eventStore);

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
    <div><fc-time [timeStore]="entryStore.timeStore"></fc-time></div>
  `,
  directives: [TimeComponent]
})
export class EntryComponent {
  @Input() entryStore:EntryStore;
}
