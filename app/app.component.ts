import {Component} from 'angular2/core';
import {PrimarySeatComponent} from './primary-seat.component';
import {PersonComponent} from './person.component';

@Component({
  selector: 'my-alma',
  template: `
    <input (ngModelChange)="korte($event)" [ngModel]="barack">
  `
})
export class AlmaComponent {

  barack: string;

  public korte(valami: string) {
    this.barack = valami;
    console.log(valami);
  }
}

@Component({
  selector: 'fc-entry',
  directives: [PrimarySeatComponent,PersonComponent,AlmaComponent],
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
