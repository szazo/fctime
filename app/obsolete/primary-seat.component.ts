import {Component, EventEmitter, Output} from 'angular2/core';
import {PersonComponent, PersonComponentData, PersonComponentState, StateEvent} from './person.component';
//import {PersonData} from './persondata';

class StateNode {

  generation:number;
  change:any;
  parent:StateNode;

  apply(change:any):StateNode {
    return null;
  }

  getChanges(fromGeneration:number):any[] {
    return null;
  }
}

class RoleData {
  private name:string;

  apply(change:any):RoleData {
    var data = new RoleData();
    data.name = change.name;

    return data;
  }
}

class SeatData {
  //private personData:PersonData;
  private roleData:RoleData;


  apply(change:any):SeatData {

    var personChanges = change.payload.personChanges;
    var roleChanges = change.payload.roleChanges;

    //var newPersonData = this.personData.apply(personChanges);
    var newRoleData = this.roleData.apply(roleChanges);

    var newData = new SeatData();
    //newData.personData = newPersonData;
    newData.roleData = newRoleData;

    return newData;
  }
}

/*
interface State {
  getChange(fromStateAddress:string):Change;
  getData(stateAddress:string):any;
  apply(change:Change):State;
}*/

class AktualisData {

  private personState:StateNode;
  //private personSnapshot:PersonData;

  private roleState:StateNode;

  public changePerson(change:any):AktualisData {

    // megcsinaljuk az uj event-et
    var newChange = {
      name: 'PERSON_CHANGED',
      payload: change
    };
    var newPersonState = this.personState.apply(newChange);


    //var newPersonSnapshot = this.personSnapshot.apply(change);

    var newInstance = new AktualisData();
    newInstance.roleState = this.roleState;
    newInstance.personState = newPersonState;
    //newInstance.personSnapshot = newPersonSnapshot;

    return newInstance;
  }

  public changeRole(change:any):AktualisData {
    return null;
  }

  public getChanges(from:AktualisData) {
    var originalPersonGeneration = from.personState.generation;
    var originalRoleGeneration = from.roleState.generation;

    var personChanges = this.personState.getChanges(originalPersonGeneration);
    var roleChanges = this.roleState.getChanges(originalRoleGeneration);

    var changes = new SeatChanges();
    changes.personChanges = personChanges;
    changes.roleChanges = roleChanges;

    return changes;
  }
}

class SeatChanges
{
  public personChanges:any[];
  public roleChanges:any[];
}

@Component({
  selector: 'fc-primaryseat',
  directives: [PersonComponent],
  template: `
    <div>
      <label>Személy: </label>
      <fc-person (personChange)="onPersonChange($event)"></fc-person>
    </div>
    <div>
    <label>Szerep: </label>
      <select #role (change)="onRoleChange(role.value)">
        <option *ngFor="#currentRole of roles" >{{currentRole.name}}</option>
      </select>
    </div>
    <div *ngIf="isInvalid()">
      {{errorMessage}}
    </div>
  `
})
export class PrimarySeatComponent {

  @Output() primarySeatChange:EventEmitter<StateEvent> = new EventEmitter();

  private personData:PersonComponentData;
  private roleData:string;
  private isValid:boolean = true;
  private errorMessage:string;

  private originalData:AktualisData;
  private currentData:AktualisData;

  private roles = [
    new Role('', ''),
    new Role('passenger', 'Utas'),
    new Role('pic', 'PIC'),
    new Role('student', 'Oktatás/ellenőrzés')
  ];

  private onPersonChange2(change:any) {

    this.currentData = this.currentData.changePerson(change);

//    if (currentData.isValid) {
//
//      var changes = currentData.getChanges(this.originalData.generation);


    //}

    //this.currentData = this.currentData.

    // az updateeljuk az aktualis changeket
    // aktualis = aktualis.changePerson()

    // if aktualis.valid, send aktualis
  }

  private onPersonChange(data:StateEvent) {
    console.log('onPersonChange', data.data);

    this.personData = data.data;

    this.checkState();
  }

  private onRoleChange(role:string) {
    console.log('onRoleChange', role);

    this.roleData = role;

    this.checkState();
  }

  private checkState() {

    this.setValid();

    console.log('checkState', this.roleData, this.personData)
    if (this.roleData == 'PIC') {
      // csak ismert lehet
      if (this.personData.state != PersonComponentState.known) {
        // nem ismert
        this.setInvalid("Első ülésben lévő PIC-nek szerepelnie kell a nyilvántartásban.")
      }
    }

    console.log('isValid', this.isValid);

    if (this.isValid) {
      var isEmpty = this.roleData == '' && this.personData.state == PersonComponentState.empty;

      var data = new PrimarySeatData(isEmpty ? PrimarySeatComponentState.empty : PrimarySeatComponentState.set,
                      this.personData, this.roleData);
      var evt = new StateEvent('PrimarySeatChanged', 'PrimarySeatScope', data);
      this.primarySeatChange.emit(evt);
    }
  }

  private setValid() {
    this.isValid = true;
  }

  private setInvalid(message:string) {
    this.isValid = false;
    this.errorMessage = message;
  }

  private isInvalid():boolean {
    return !this.isValid;
  }
}

enum PrimarySeatComponentState {
  empty,
  set
}

class PrimarySeatData {

  constructor(
  public state:PrimarySeatComponentState,
  public personState,
  public roleState) {

  }
}

class Role {
  constructor(
    public id:string,
    public name:string
  ) {}
}
