import {Component, Input, Output, Injectable, EventEmitter} from 'angular2/core';
//import {PrimarySeatComponent} from './primary-seat.component';
//import {PersonComponent,StateEvent} from './person.component';
//import {EntryComponent} from './entry.component';
//import {TimesheetComponent} from './timesheet.component';

export interface IDispatcher {

  dispatch(scope:any, action:any, param:any);
  register(scope:any, name:any, listener:any);
}

export interface IChange {

  register(scope:any, eventName:any, listener:any);
}

class DummyEventRef {
  constructor(
    public id:any,
    public scope:any = null
  ) {

  }
}

class DummyEvent {

  public dependencies:DummyEventRef[];

  constructor(
    public id:any,
    public action:any,
    public payload:any,
    dependencies:DummyEventRef[]
  ) {
    this.dependencies = dependencies;
  }

  getScopeParent(scope:any = null):DummyEventRef {
    return this.dependencies.find((x) => x.scope == scope);
  }
}

@Injectable()
class EventStore {

  private data:any = {};

  save() {

    console.log('EventStore save');

    var targetData = {};

    for (var scope in this.data) {

      var events = this.data[scope];
      var targetEvents = [];

      for (var i = 0; i < events.length; i++) {

        var evt = events[i];

        var targetDeps = [];
        evt.dependencies.forEach((dep) => {
          if (dep.scope == null) {
            targetDeps.push(dep.id);
          } else {
            targetDeps.push([dep.scope, dep.id]);
          }
        });

        var targetEvent = [targetDeps, evt.id, evt.action, evt.payload];

        targetEvents.push(targetEvent);
      }

      targetData[scope] = targetEvents;

    }

    return targetData;
  }

  load(data:any) {
    for (var scope in data) {

      var events = data[scope];

      //console.log('EventStore load events', events, events.length);

      for (var i = 0; i < events.length; i++) {

        var evt = events[i];

        var dep = evt[0];
        var dependencies:DummyEventRef[] = [];
        if (dep instanceof Array) {

          dep.forEach((item) => {

            if (item instanceof Array) {

              dependencies.push(new DummyEventRef(item[1], item[0]));

            } else {
              dependencies.push(new DummyEventRef(item));
            }

          });

        } else {
          dependencies = [new DummyEventRef(dep)];
        }

        var theEvent = new DummyEvent(evt[1], evt[2], evt[3], dependencies);
        //console.log('EventStore loaded event', theEvent);
        if (!this.data[scope]) {
          this.data[scope] = [];
        }

        this.data[scope].push(theEvent);

        //console.log('EventStore load scope', scope, the);
      }
    }

    console.log('Loaded events', this.data);
  }

  add(scope:any, evt:DummyEvent) {

    if (!this.data[scope]) {
      this.data[scope] = [];
    }

    this.data[scope].push(evt);
  }

  getLastInScope(scope:any):number {
    var scopeEvents:any[] = this.data[scope];

    var max = 0;
    for (var i = 0; i < scopeEvents.length; i++) {
      if (scopeEvents[i].id > max) {
        max = scopeEvents[i].id;
      }
    }

    return max;
  }

  getChanges(scope:any, toId:any):DummyEvent[] {

    var changes:any[] = [];
    var scopeEvents:any[] = this.data[scope];

    console.log('getChanges scopeEvents', scope, toId, scopeEvents, this.data);

    if (!scopeEvents) {
      return [];
    }

    var lastEvent = scopeEvents.find((x) => x.id == toId);
    console.log('first lastEvent', lastEvent);

    changes.push(lastEvent);

    var thisScopeParent = lastEvent.getScopeParent();
    while (thisScopeParent) {

      console.log('thisScopeParent', thisScopeParent, thisScopeParent.id);
      console.log('scopeEvents', scopeEvents);

      lastEvent = scopeEvents.find((x) => x.id == thisScopeParent.id);
      console.log('other lastEvent', lastEvent);

      changes.unshift(lastEvent);

      thisScopeParent = lastEvent.getScopeParent();
    }

    return changes;
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

class PersonState {

  public name:any = '';

  apply(evt:DummyEvent) {

    this.name = evt.payload;

  }

}

export class PersonStore {

  private personState:PersonState;
  private currentData:any;

  constructor(
    public scope:any,
    private dispatcher:IDispatcher,
    private eventStore:EventStore
  ) {

    console.log('PersonStore constructor with scope', scope);

    this.personState = new PersonState();

    dispatcher.register(scope, 'nameChange', (param) =>
    {
      console.log('PersonStore nameChange listener', scope, param);

      // ehhez a scope-hoz megvaltozott a nev, taroljuk a local state-ben
      this.currentData = this.currentData + 1;
      var evt = new DummyEvent(this.currentData, 'change', param, [new DummyEventRef(this.currentData - 1)]);
      this.eventStore.add(this.scope, evt);

      this.personState.apply(evt);

      // ok, valid, jon az event a valtozasrol
      dispatcher.dispatch(scope, 'changed', new DummyEventRef(this.currentData, scope));
    });

  }

  getName() {
    return this.personState.name;
  }

  load2(rev:any) {

    this.currentData = rev;

    console.log('PersonStore load2', rev);

    var changes = this.eventStore.getChanges(this.scope, rev);

    changes.forEach((x) => {

      this.personState.apply(x);
    });

    console.log('Person loaded', this.personState.name);
  }
}

export class SeatStore {

  personStore:PersonStore;

  private personSnapshot:any;
  private rev:any;

  constructor(
    public scope:any,
    private dispatcher:IDispatcher,
    private eventStore:EventStore) {
  }

  load2(rev:any) {

    this.rev = rev;

    console.log('SeatStore load2', rev);

    var changes = this.eventStore.getChanges(this.scope, rev);

    var personRev = 0;
    var roleRev = 0;

    var personScope = this.scope + ':person';
    var roleScope = this.scope + ':role';

    changes.forEach((x) => {

      if (x.action == 'change') {

        var target = x.payload.target;
        if (target == 'person') {
          personRev = x.getScopeParent(personScope).id;
        } else if (target == 'role') {
          roleRev = x.getScopeParent(roleScope).id;
        } else {
          console.error('invalid', target);
        }
      }
    });

    this.personStore = new PersonStore(personScope, this.dispatcher, this.eventStore);
    this.personStore.load2(personRev);

    this.dispatcher.register(personScope, 'changed', (param) => {

      console.log('SeatStore person change handler', param);

      this.rev++;
      var evt = new DummyEvent(this.rev, 'change', {target: 'person'},
        [param, new DummyEventRef(this.rev-1)]);

      this.eventStore.add(this.scope, evt);

      // ok, valid, jon az event a valtozasrol
      this.dispatcher.dispatch(this.scope, 'changed', new DummyEventRef(this.rev, this.scope));

      //this.personSnapshot = param;
      //this.checkData();
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

  private currentRev:any;

  constructor(
    public scope:any,
    private dispatcher:Dispatcher,
    private eventStore:EventStore) {
  }

  load2(rev:any) {

    this.currentRev = rev;

    console.log('EntryStore load2: ', this.scope, rev);
    var changes = this.eventStore.getChanges(this.scope, rev);

    var primaryRev = 0;
    var secondaryRev = 0;

    var primaryScope = this.scope + ':primary';
    var secondaryScope = this.scope + ':secondary';

    changes.forEach((x) => {

      if (x.action == 'create') {
        this.primarySeatStore = new SeatStore(primaryScope, this.dispatcher, this.eventStore);
        this.secondarySeatStore = new SeatStore(secondaryScope, this.dispatcher, this.eventStore);
      } else if (x.action == 'change') {

        let target = x.payload.target;
        if (target == 'secondary') {
          var secondaryRef = x.getScopeParent(secondaryScope);
          secondaryRev = secondaryRef.id;
          //secondaryRev = x.get
        }
      }
    });

    this.primarySeatStore.load2(primaryRev);
    this.secondarySeatStore.load2(secondaryRev);

    this.dispatcher.register(secondaryScope, 'changed', (ref) => {
      // secondary seat changed
      var evt = new DummyEvent(this.currentRev + 1, 'change', {target: 'secondary'},
          [ref, new DummyEventRef(this.currentRev)]);
      this.eventStore.add(this.scope, evt);

      this.currentRev++;

      this.dispatcher.dispatch(this.scope, 'changed', new DummyEventRef(this.currentRev, this.scope));
      console.log('EntryStore, secondary changed', ref);
    });

    //console.log('entry load result: ', secondaryRev);
    //console.log('load2 changes', changes);
  }

/*
  load(data:any) {

    this.primarySeatStore = new SeatStore();
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
*/
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
  private rev:any;

  constructor(
    public scope:any,
    private dispatcher:Dispatcher,
    private eventStore:EventStore) {
  }

  load2(rev:any) {

    this.rev = rev;

    var changes = this.eventStore.getChanges(this.scope, rev);
    console.log('TimesheetStore load2', changes);

    var entries = [];
    changes.forEach((x) => {

      console.log('TimesheetStore load2 change', x);

      if (x.action == 'addentry') {
        let entry = {
          scope: x.payload.scope,
          rev: x.getScopeParent(x.payload.scope).id
        };

        entries.push(entry);
      } else if (x.action == 'change') {

        let entry = entries.find((y) => y.scope == x.payload.scope);
        entry.scope = x.payload.scope;
        entry.rev = x.getScopeParent(x.payload.scope).id;

      }});

      console.log('load2 entries loaded', entries);

      // create the stores for entries
      var entryStores:EntryStore[] = [];

      entries.forEach((element, index) => {

        //let currentIndex = i;
        console.log('currentIndex', index);

        var entryScope = this.scope + ':entry' + (index + 1);

        var entryStore = new EntryStore(entryScope, this.dispatcher, this.eventStore);
        entryStore.load2(entries[index].rev);

        entryStores.push(entryStore);

        this.dispatcher.register(entryScope, 'changed', (data) => {
          console.log('TimesheetStore EntryChanged', data);

          var evt = new DummyEvent(this.rev + 1, 'change',
                  {index: index, scope: entryScope},
                  [data, new DummyEventRef(this.rev)]);

          this.eventStore.add(this.scope, evt);

          this.rev++;

          this.dispatcher.dispatch(this.scope, 'change', new DummyEventRef(this.rev, this.scope));
          /*
          var timesheetEntryChanged = {
            index: index,
            data: data
          };

          this.dispatcher.dispatch(this.scope, 'changed', timesheetEntryChanged);*/
        });
      });

      this.entryStores = entryStores;
  }
}

@Component({
  selector: 'fc-dummyperson',
  template: `
    <div><input #name type="text" (change)="nameChange(name.value)" [value]="theName"></div>
  `
})
class DummyPersonComponent {
  @Input() store:PersonStore;

  public theName:string = '';

  constructor(private dispatcher:Dispatcher) {

  }

  ngOnInit() {

    this.theName = this.store.getName();

    this.dispatcher.register(this.store.scope, 'changed', (rev) =>{

        this.theName = this.store.getName();

    });
  }

  // ha valtozott a GUI
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

    });

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
    private dispatcher:Dispatcher,
    private eventStore:EventStore) {

    // get
    //window.localStorage.removeItem('fc-events');
    var read = window.localStorage.getItem('fc-events');
    console.log("Loaded json", read);
    var events:any[] = [];
    if (read) {
      events = JSON.parse(read);
    }

    console.log("DummyTimesheetComponent loaded events", events);

    this.timesheetStore = new TimesheetStore('root', dispatcher, eventStore);
/*
    var events = {

    };*/

    var evts:any = {
      'root:entry1:secondary:person': [
        [[], 1, 'namechange', 'name1'],
        [1, 2, 'namechange', 'name2']
      ],
      'root:entry1:secondary:role': [
        [[], 1, 'change', 'PIC']
      ],
      'root:entry1:secondary': [
        [[['root:entry1:secondary:person', 2], ['root:entry1:secondary:role', 1]], 1, 'change', {target: 'person'}]
      ],
      'root:entry1': [
        [[], 1, 'create', null],
        [[1, ['root:entry1:secondary', 1]], 2, 'change', {target: 'secondary'}]
      ],
      'root': [
        [[['root:entry1', 1]], 1, 'addentry', {index: 0, scope: 'root:entry1'}],
        [[1, ['root:entry1', 2]], 2, 'change', {scope: 'root:entry1'}]
      ]
    };

    evts = events;

    this.eventStore.load(evts);

    //this.timesheetStore.load(data);
    var max = this.eventStore.getLastInScope('root');
    this.timesheetStore.load2(max);
    this.entries = this.timesheetStore.entryStores;
    this.dispatcher.register(this.timesheetStore.scope, 'change', (data) => {

      var saved = eventStore.save();
      //events.push(data);
      window.localStorage.setItem('fc-events', JSON.stringify(saved));
      //window.localStorage.setItem('fc-events', 'allma');


      console.log('TimesheetComponent timesheetStore changed', data);

      console.log('new events', JSON.stringify(saved));
    });

    console.log('entries loaded', this.entries);
  }

}

@Component ({
  selector: 'fc-app',
  //template: `<fc-timesheet>`,
  template: `<fc-dummytimesheet>`,
  providers: [Dispatcher, EventStore],
  directives: [DummyTimesheetComponent]
})
export class AppComponent {}
