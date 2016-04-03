import {Component, Input} from 'angular2/core';
import {Dispatcher} from './dispatcher';
import {EventData,EventRef,EventStore} from './event-store';

interface StateManager {
	// ezt hivja betolteskor
	getCurrentState<T>(scope:any):T;
	
}

@Component({
  selector: 'fc-time',
  template: `
    <div>
      <div *ngIf="isNone()">
        <button class="takeoffButton" (click)="takeoff()">Felszállás</button>
      </div>
      <div *ngIf="isFlying() || isLanded()">
        <input type="text" [value]="takeoffTime()" size="6">
      </div>
      <div *ngIf="isFlying()">
        <button class="landButton" (click)="land()">Leszállt</button>
      </div>
      <div *ngIf="isLanded()">
        <input type="text" [value]="landTime()" size="6">
      </div>
      <div *ngIf="isLanded()">
        <input type="text" [value]="airTime()" size="6">
      </div>
    </div>
  `
})
export class TimeComponent {

  @Input() timeStore:TimeStore;

  private currentState:TimeState;
	private dispatcher:Dispatcher;

	constructor(dispatcher:Dispatcher) {
		this.dispatcher = dispatcher;
	}

  ngOnInit() {
		// TODO: this is just a reference now,
		// component should register to scope change
    this.currentState = this.timeStore.state;
  }

	public takeoff() {
		this.timeStore.takeoff();
	}

	public land() {
		this.timeStore.land();
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

	public load(ref:EventRef) {
		this.ref = ref;
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

	public constructor() {
		this.phase = TimePhase.none;
	}
	
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
