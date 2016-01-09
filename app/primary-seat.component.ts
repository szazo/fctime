import {Component} from 'angular2/core';
import {PersonComponent} from './person.component';

@Component({
  selector: 'fc-primaryseat',
  directives: [PersonComponent],
  template: `
    <div>
      <label>Személy: </label>
      <fc-person></fc-person>
    </div>
    <div>
    <label>Szerep: </label>
      <select #role (ngModelChange)="onRoleChange($event)">
        <option *ngFor="#currentRole of roles" >{{currentRole.name}}</option>
      </select>
    </div>
  `
})
export class PrimarySeatComponent {

  private roles = [
    new Role('passenger', 'Utas'),
    new Role('pic', 'PIC'),
    new Role('student', 'Oktatás/ellenőrzés')
  ];

  private onRoleChange(role:string) {
    console.log('onRoleChange', role);
  }
}

class Role {
  constructor(
    public id:string,
    public name:string
  ) {}
}
