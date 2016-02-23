import {Event, EventData, EventRef, EventStore} from './event-store';
import {Dispatcher} from './dispatcher';
import {Component, Input, Injectable} from 'angular2/core';
import {EntryStore, EntryComponent} from './entry';

@Injectable()
export class TimesheetStore {

  private ref:EventRef;
  private state:TimesheetState;

  public entryStores:EntryStore[] = [];

  constructor(
    private dispatcher:Dispatcher,
    private eventStore:EventStore
  ) {
    this.state = new TimesheetState();
  }

  public create(scope:any) {
    this.ref = {
      scope: scope,
      revision: 0
    };
  }

  public load(ref:EventRef) {
    this.loadState(ref);
    //this.createEntryStores();
  }

  private loadState(ref:EventRef) {
    var changes = this.eventStore.getChanges(ref);
    this.state.load(changes);
  }

  public addEntry() {

    // megcsinaljuk az entry actor-t, es letrehozzuk
    var id = '123'; // TODO: generate

    var entryStore = new EntryStore(this.eventStore, this.dispatcher);
    var ref = entryStore.create(id, id);

    var evt:EventData = {
      name: 'addentry',
      payload: ref
    };
    this.apply(evt);

    // az entryStore-t kintrol kellene kapni
    this.entryStores.push(entryStore);

    /*
    this.dispatcher.register(id, 'create', ref => {
      console.log('created', ref);
      // letrejott
      // hozzaadjuk a timesheethez
    })*/

    // action
  }

  private apply(evt:EventData) {
    this.ref = this.eventStore.commit(this.ref, evt);
    this.state.mutate(evt);
  }
}

export class TimesheetState {

  private entries:any[] = [];

  public load(changes:Event[]) {
    changes.forEach((x) => this.mutate(x));
  }

  public mutate(evt:EventData) {

    switch (evt.name) {

      case 'addentry': {

        let entry = {
          scope: evt.payload.scope,
          revision: evt.payload.revision
        }

        this.entries.push(entry);

        break;
      }
      case 'change': {

        let entry = this.entries.find((x) => x.scope == evt.payload.scope);
        entry.revision = evt.payload.revision;

        break;
      }
      default:
        throw new Error(evt.name);
    }

  }
}

@Component({
  selector: 'fc-timesheet',
  template: `
    <div>
      <div *ngFor="#entry of timesheetStore.entryStores">
        <fc-entry [entryStore]="entry"></fc-entry>
      </div>
    </div>
    <div>
      <button (click)="add()">Add</button>
    </div>
  `,
  directives: [EntryComponent]
})
export class TimesheetComponent {

  @Input() timesheetStore:TimesheetStore;

  private add() {
    this.timesheetStore.addEntry();
  }
}
