import {Component, EventEmitter, Input, Output} from 'angular2/core';
//import {IPersonData} from './persondata.ts';

interface StateReference {
  scope:string;
  revision:number;
}

export class StateEvent {
  constructor(
    public scope:string,
    public name:string,
    public data:any) {

  }
}

@Component({
  selector: 'fc-person',
  template: `
    <div><input (ngModelChange)="onNameChange($event)" [ngModel]="korte">
    </div>
    <div *ngIf="isKnownPerson()">Klub: <input #club> Vizsga:
      <select #level>
        <option>K</option>
        <option>A</option>
      </select>
    </div>
    <div>
      <div>state: {{state}}</div>
      <div>knownPersonId: {{knownPersonId}}</div>
      <div>unknownPersonName: {{unknownPersonName}}</div>
    </div>
  `
})
export class PersonComponent {

  //@Input() personData:IPersonData;
  @Output() personChange:EventEmitter<StateEvent> = new EventEmitter();

  private knownPersons = [
    new Person('p1', 'Oláh Attila', 'Endresz', 'C'),
    new Person('p2', 'Dosek Dani', 'Endresz', 'D')
  ];

  private scope:string = 'PersonScope';
  private revision:number;
  private events:StateEvent[] = [];

  korte:string;

  private data:PersonComponentData;
  state:PersonComponentState;
  knownPersonId:string;
  unknownPersonName:string;

  personDisplayName:string;

  constructor() {
    this.setAsEmpty();
  }

  private onNameChange(name: string) {

    console.log('name change', name);

    for (let i = 0; i < this.knownPersons.length; i++) {
      if (this.knownPersons[i].name == name) {
        // we found a name
        console.log('found', this.knownPersons[i].id);
        console.log(this);
        this.setAsKnownPerson(this.knownPersons[i].id);
        return;
      }
    }

    if (name.length == 0) {
      this.setAsEmpty();
    } else {
      this.setAsUnknownPerson(name);
    }
  }

  private setAsEmpty() {

    var data = new PersonComponentData(
      PersonComponentState.empty,
      null,
      null
    );

    this.emitChange(data);
  }

  private setAsUnknownPerson(name: string) {

    var data = new PersonComponentData(
      PersonComponentState.unknown,
      null,
      name
    );

    this.emitChange(data);
  }

  private setAsKnownPerson(id: string) {

    var data = new PersonComponentData(
      PersonComponentState.known,
      id,
      null
    );

    this.emitChange(data);
  }

  private emitChange(data:any) {

    console.log('emitChange', data);

    this.data = data;
    var evt = new StateEvent('PersonChanged', this.scope, data);

    this.personChange.emit(evt);
  }

  public isKnownPerson() {
    return this.state == PersonComponentState.known;
  }
}

export enum PersonComponentState {
  empty,
  unknown,
  known
}

export class PersonComponentData {

  constructor(
    public state:PersonComponentState,
    public knownPersonId:string,
    public unknownPersonName:string
  ) {

  }
}

class Person {
  constructor(
    public id:string,
    public name:string,
    public club:string,
    public level:string
  ) {

  }
}
