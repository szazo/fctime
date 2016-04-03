import {Component} from 'angular2/core';
import {EntryComponent} from './entry.component';
import {StateRef} from './stateref';
//import {PersonComponent, PersonComponentData, PersonComponentState, StateEvent} from './person.component';


@Component({
  selector: 'fc-timesheet',
  directives: [EntryComponent],
  template: `
    <div>
      <div *ngFor="#entry of entries">
        <fc-entry [state]="state" [stateRef]="entry" (entryChange)="entryChange($event)"></fc-entry>
      </div>
    </div>
  `
})
export class TimesheetComponent {

  private state:any;
  private entries:any[] = ['Entry1'];

  constructor() {

    this.state = { scopes: [
      { scope: 'Entry1',
        scopes: [
          { scope: 'PrimarySeat',
            scopes: [
              { scope: 'Person', events: [
                { revision: 1, name: 'NameChange', data: 'O'},
                { revision: 2, name: 'NameChange', data: 'Ol'},
                { revision: 3, name: 'NameChange', data: 'Olá'}
              ] },
              { scope: 'Role', events: [
                { revision: 1, name: 'RoleChange', data: 'PIC'},
                { revision: 2, name: 'RoleChange', data: 'Utas'}
              ] }
            ],
           events: [
            { revision: 1, name: 'PrimarySeatChange',
                  ref: [ {scope: 'Person', rev: 3 }, {scope: 'Role', rev: 2} ]}
          ] }
        ],
        events: [
          { revision: 1, name: 'EntryChanged',
                  ref: [ {scope: 'PrimarySeat', rev: 1}]}
        ]}
    ]};

    var currentScope = {
      scope: [],
      rev: 0
    };

    this.entries = [
      new StateRef('Entry1', 1),
      new StateRef('Entry2', 2)
    ];

/*
    var entryState = this.state.scopes.filter(obj => obj.scope == 'Entry1')[0];
    console.log('EntryState', entryState);

    this.load(entryState, 1);*/


  }

  private load(state:any, rev:number) {

    var entryState = {
      primarySeat: null
    };

    for (let i = 0; i < state.events.length; i++) {
      if (state.events[i].revision <= rev) {
        var evt = state.events[i];
        if (evt.name == 'EntryChanged') {
          entryState.primarySeat = new StateRef('PrimarySeat', evt.ref[0].rev);
        }
      }
    }

    return entryState;

  }

  private entryChange(evt:any) {
    console.log('TimeSheetEntryChange', evt);
  }
}
