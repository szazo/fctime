import {Component} from 'angular2/core';
import {PrimarySeatComponent} from './primary-seat.component';

@Component({
  selector: 'fc-entry',
  directives: [PrimarySeatComponent],
  template: `
    <div>
      Első ülés
      <fc-primaryseat></fc-primaryseat>
    </div>
  `
})
class EntryComponent {

}

@Component ({
  selector: 'fc-app',
  template: `<fc-entry>`,
  directives: [EntryComponent]
})
export class AppComponent {}
