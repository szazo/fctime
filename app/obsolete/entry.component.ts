import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {PrimarySeatComponent} from './primary-seat.component';
import {StateEvent} from './person.component';

@Component({
  selector: 'fc-entry',
  directives: [PrimarySeatComponent],
  template: `
    <div>
      Első ülés
      <fc-primaryseat (primarySeatChange)="primarySeatChange($event)"></fc-primaryseat>
    </div>
  `
})
export class EntryComponent {

  @Output() entryChange:EventEmitter<StateEvent> = new EventEmitter();

  constructor() {
  }

  @Input()
  set state(state:any) {
    console.log('state', state);
  }

  @Input()
  set stateRef(stateRef:any) {
    console.log('stateRef', stateRef);
  }

  private primarySeatChange(evt:StateEvent) {
    console.log("EntryComponent primarySeatChange", evt);

    // check valid
    var evt = new StateEvent('EntryChanged', 'EntryScope', null);
    this.entryChange.emit(evt);
  }

}
