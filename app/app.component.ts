import {Component, Input, Output, Injectable, EventEmitter} from 'angular2/core';
import {PrimarySeatComponent} from './primary-seat.component';
import {PersonComponent,StateEvent} from './person.component';
import {EntryComponent} from './entry.component';
import {TimesheetComponent} from './timesheet.component';

export interface IDispatcher {

  dispatch(scope:any, action:any, param:any);
  register(scope:any, name:any, listener:any);
}

export interface IChange {

  register(scope:any, eventName:any, listener:any);
}

class EventStore {

  add(scope:any, parent:any, id:any, change:any) {

  }

  getChanges(fromId:any) {

  }

}

@Injectable()
export class Dispatcher implements IDispatcher {

  private queue:any[] = [];
  private subscribers:any[] = [];

  constructor() {

    setInterval(() => {

      if (this.queue.length > 0) {
        var item = this.queue.shift();

        var foundSubscribers = this.subscribers.filter((value) =>{
          return value.scope == item.scope && value.action == item.action;
        });

        for (var i = 0; i < foundSubscribers.length; i++) {

          //console.log('calling listener');

          foundSubscribers[i].listener(item.param);
        }

      }

      //console.log('dequeue');
    }, 100);
  }

  dispatch(scope:any, action:any, param:any) {

    this.queue.push({
      scope: scope,
      action: action,
      param: param
    });

    //console.log('dispatch', action);
  }

  register(scope:any, action:any, listener:any) {

    this.subscribers.push({
      scope: scope,
      action: action,
      listener: listener
    });

    //console.log('register', scope, name);
  }

}

export class PersonStore {

  private eventStore:EventStore;
  private currentData:any;

  constructor(public scope:any, public dispatcher:IDispatcher) {

    this.eventStore = new EventStore();

    dispatcher.register(scope, 'nameChange', (param) =>
    {
      console.log('PersonStore nameChange listener', scope, param);

      // ehhez a scope-hoz megvaltozott a nev
      var newData = this.currentData + 1;
      this.eventStore.add(this.scope, this.currentData, newData, param);

      // ok, valid, jon az event a valtozasrol
      dispatcher.dispatch(scope, 'changed', newData);

    });

  }

  load(data:any) {
    this.currentData = data;
  }
}

export class SeatStore {

  personStore:PersonStore;

  private personSnapshot:any;

  constructor(private scope:any, private dispatcher:IDispatcher) {
  }

  load(data:any) {
    var personScope = this.scope + ':person';
    this.personStore = new PersonStore(personScope, this.dispatcher);
    this.personStore.load(data.person);

    this.dispatcher.register(personScope, 'changed', (param) => {

      console.log('SeatStore person change handler', param);

      this.personSnapshot = param;
      this.checkData();
    });
  }

  private checkData() {

    var valid = true;
    if (valid) {
      var seatData = {
        name: this.personSnapshot
      };

      this.dispatcher.dispatch(this.scope, 'changed', seatData);
    }
  }

}

class EntryStore {

  public primarySeatStore:SeatStore;
  public secondarySeatStore:SeatStore;

  private actualPrimarySeatData:any;
  private actualSecondarySeatData:any;

  constructor(
    public scope:any,
    private dispatcher:Dispatcher) {
  }

  load(data:any) {

    this.primarySeatStore = new SeatStore(this.scope + ':primary', this.dispatcher);
    this.dispatcher.register(this.scope + ':primary', 'changed', (data) => {
      this.actualPrimarySeatData = data;
      this.checkData();
    })

    this.secondarySeatStore = new SeatStore(this.scope + ':secondary', this.dispatcher);
    this.dispatcher.register(this.scope + ':secondary', 'changed', (data) => {
      this.actualSecondarySeatData = data;
      this.checkData();
    })

    this.primarySeatStore.load(data.primarySeat);
    this.secondarySeatStore.load(data.secondarySeat)
  }

  private checkData() {

    var valid = true;
    if (valid) {
      var entryData = {
        primarySeat: this.actualPrimarySeatData,
        secondarySeat: this.actualSecondarySeatData
      };

      this.dispatcher.dispatch(this.scope, 'changed', entryData);
    }
  }

}

class TimesheetStore {

  entryStores:EntryStore[];

  constructor(
    public scope:any,
    private dispatcher:Dispatcher) {
  }

  load(data:any) {

    var entryStores:EntryStore[] = [];

    data.entries.forEach((element, index) => {
      console.log(element, index);
    });

    data.entries.forEach((element, index) => {

      //let currentIndex = i;
      console.log('currentIndex', index);

      var entryStore = new EntryStore(this.scope + ':entry' + index, this.dispatcher);
      entryStore.load(data.entries[index]);

      entryStores.push(entryStore);

      this.dispatcher.register(this.scope + ':entry' + index, 'changed', (data) => {
        console.log('TimesheetStore EntryChanged', data);

        var timesheetEntryChanged = {
          index: index,
          data: data
        };

        this.dispatcher.dispatch(this.scope, 'changed', timesheetEntryChanged);
      });
    });

    this.entryStores = entryStores;
  }
}

@Component({
  selector: 'fc-dummyperson',
  template: `
    <div><input #name type="text" (change)="nameChange(name.value)"></div>
  `
})
class DummyPersonComponent {
  @Input() store:PersonStore;

  constructor(private dispatcher:Dispatcher) {

  }

  nameChange(name:any) {
    console.log('DummyPersonComponent.nameChange', name);

    // ez action
    // ACTOROK!!!!
    this.dispatcher.dispatch(this.store.scope, 'nameChange', name);
  }
}

@Component({
  selector: 'fc-dummyseat',
  template: `
    <div><fc-dummyperson [store]='seatStore.personStore'></fc-dummyperson></div>
  `,
  directives: [DummyPersonComponent]
})
class DummySeatComponent {

  @Input() seatStore:SeatStore;

  constructor() {

  }

  ngOnInit() {

  }

}

@Component({
  selector: 'fc-dummyentry',
  template: `
    <div>
      <div style="display:inline-block"><fc-dummyseat [seatStore]="entryStore.primarySeatStore"></fc-dummyseat></div>
      <div style="display:inline-block"><fc-dummyseat [seatStore]="entryStore.secondarySeatStore"></fc-dummyseat></div>
    </div>
  `,
  directives: [DummySeatComponent]
})
class DummyEntryComponent {

  @Input() entryStore:EntryStore;

  constructor(
    private dispatcher:Dispatcher) {

  }

  ngOnInit() {

    console.log('DummyEntryComponent ngOnInit', this.entryStore);

    this.dispatcher.register(this.entryStore.scope, 'changed', (data) => {

    })

  }


}

@Component({
  selector: 'fc-dummytimesheet',
  template: `
    <div>
      <div *ngFor="#entry of entries">
        <fc-dummyentry [entryStore]="entry"></fc-dummyentry>
      </div>
    </div>`,
  directives: [DummyEntryComponent]
})
class DummyTimesheetComponent {

  private timesheetStore:TimesheetStore;
  private entries:EntryStore[];

  constructor(
    private dispatcher:Dispatcher) {

    // get
    window.localStorage.removeItem('fc-events');
    var read = window.localStorage.getItem('fc-events');
    var events:any[] = [];
    if (read) {
      events = JSON.parse(read);
    }

    console.log("DummyTimesheetComponent loaded events", events);

    this.timesheetStore = new TimesheetStore('root', dispatcher);

    var data = {
      entries: [
        {
          primarySeat: {
            person: 0
          },
          secondarySeat: {
            person: 0
          }
        },
        {
          primarySeat: {
            person: 'entry2:primarySeat'
          },
          secondarySeat: {
            person: 'entry2:secondarySeat'
          }
        }
      ]
    };

    this.timesheetStore.load(data);
    this.entries = this.timesheetStore.entryStores;
    this.dispatcher.register(this.timesheetStore.scope, 'changed', (data) => {

      events.push(data);
      window.localStorage.setItem('fc-events', JSON.stringify(events));

      console.log('TimesheetComponent timesheetStore changed', data);

      console.log('new events', JSON.stringify(events));
    });

    console.log('entries loaded', this.entries);
  }

}

@Component ({
  selector: 'fc-app',
  //template: `<fc-timesheet>`,
  template: `<fc-dummytimesheet>`,
  providers: [Dispatcher],
  directives: [TimesheetComponent,DummyTimesheetComponent]
})
export class AppComponent {}
