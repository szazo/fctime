import {Component, Input} from 'angular2/core';
import {Dispatcher} from './dispatcher';
import {EventData,EventRef,EventStore} from './event-store';

@Component({
  selector: 'fc-time',
  template: `
    <div>
      TIME
      <div *ngIf="isNone()">
        <button class="takeoffButton" (click)="takeOff">Felszállás</button>
      </div>
      <div *ngIf="isFlying() || isLanded()">
        <input type="text" [value]="takeoffTime()" size="6">
      </div>
    </div>
  `
})
export class TimeComponent {

  @Input() timeStore:TimeStore;

  private currentState:TimeState;

  ngOnInit() {
    this.currentState = this.timeStore.state;
  }

  private takeoffTime():string {
    return this.currentState.takeoffTime;
  }

  private landTime():string {
    return this.currentState.landTime;
  }

  private airTime():string {
    var takeoff = moment(this.currentState.takeoffTime);
    var land = moment(this.currentState.landTime);
    var diff = land.diff(takeoff, 'minutes');

    return String(diff);
  }

  private isNone():boolean {
    return this.currentState.phase == TimePhase.none;
  }

  private isFlying():boolean {
    return this.currentState.phase == TimePhase.flying;
  }

  private isLanded():boolean {
    return this.currentState.phase == TimePhase.landed;
  }
}

export class TimeStore {

  private ref:EventRef;
  public state:TimeState;

  constructor(
    private dispatcher:Dispatcher,
    private eventStore:EventStore
  ) {
    this.state = new TimeState();
  }

  public takeoff() {

    var now = moment();

    var evt:EventData = {
      name: 'takeoff',
      payload: now.format()
    };
    this.apply(evt);
  }

  public land() {

    var now = moment();

    var evt:EventData = {
      name: 'land',
      payload: now.format()
    };

    this.apply(evt);
  }

  public changeTakeoffTime(timeText:string) {

  }

  public changeLandTime(timeTest:string) {

  }

  private apply(evt:EventData) {
    this.ref = this.eventStore.commit(this.ref, evt);
    this.state.mutate(evt);
  }
}

export enum TimePhase {
  none,
  flying,
  landed
}

export class TimeState {

  public phase:TimePhase;
  public takeoffTime:string;
  public landTime:string;

  public mutate(evt:EventData) {

    switch (evt.name) {
      case 'takeoff': {

        this.takeoffTime = evt.payload;
        this.phase = TimePhase.flying;

        break;
      }
      case 'land': {

        this.landTime = evt.payload;
        this.phase = TimePhase.landed;

        break;
      }
    }

  }

}
