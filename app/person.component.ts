import {Component, EventEmitter, Output} from 'angular2/core';

@Component({
  selector: 'fc-person',
  template: `
    <div><input placeholder="name" (ngModelChange)='onNameChange($event)' #box>
    {{box.className}}</div>
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

  @Output() almachanged = new EventEmitter();

  private knownPersons = [
    new Person('p1', 'Oláh Attila', 'Endresz', 'C'),
    new Person('p2', 'Dosek Dani', 'Endresz', 'D')
  ];

  state:PersonComponentState;
  knownPersonId:string;
  unknownPersonName:string;

  personDisplayName:string;

  constructor() {
    this.setAsEmpty();
  }

  public onNameChange(name: string) {

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
    this.state = PersonComponentState.empty;
    this.unknownPersonName = null;
    this.knownPersonId = null;
  }

  private setAsUnknownPerson(name: string) {
    this.state = PersonComponentState.unknown;
    this.unknownPersonName = name;
    this.knownPersonId = null;
  }

  private setAsKnownPerson(id: string) {
    this.state = PersonComponentState.known;
    this.knownPersonId = id;
    this.unknownPersonName = null;
  }

  public isKnownPerson() {
    return this.state == PersonComponentState.known;
  }
}

enum PersonComponentState {
  empty,
  unknown,
  known
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
