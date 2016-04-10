import * as React from 'react';
import * as moment from 'moment';

import { FluxProps } from '../../../common/flux-props';
import { Time } from '../../common/time';

import { GliderTimePhase, takeoff, land, changeTakeoffTime, changeLandTime, changeAirTime } from './glider-time.model';

// TODO: state-ben kezelni az aktuális állapotokat, ezt fogja frissíteni a react, itt még lehet invalid időt is megadni
class TimeEntry {

		private text:string;
		private time:Time;

		public change(value:string):TimeEntry {

				this.time = Time.parse(value);
				this.text = value;

				return null;
		}

		public isValid() {
				return this.time.isValid;
		}
}

class State {

		takeoffTime:TimeEntry;
		landTime:TimeEntry;
		airTime:TimeEntry;
		
		changeTakeoffTime(value:string):State {

				return null;
		}
}

export class GliderTime extends React.Component<FluxProps, State> {

		getInitialState() {
				
		}
		
		render() {

				let startTime;
				if (this.isNone()) {
						startTime = <button className="takeoff-button" onClick={this.takeoff.bind(this)}>Felszállás</button>;
				} else if (this.isFlying() || this.isLanded()) {
						startTime = <input type="text" onChange={this.changeTakeoffTime.bind(this)} value={this.takeoffTime()} />;
				}

				let landTime;
				if (this.isFlying()) {
						landTime = <button class="land-button" onClick={this.land.bind(this)}>Leszállt</button>;
				} else if (this.isLanded()) {
						landTime = <input type="text" onChange={this.changeLandTime.bind(this)} value={this.landTime()} />;
				}

				let flyTime;
				if (this.isFlying()) {
						flyTime = this.flyingAirTime();
				} else if (this.isLanded()) {
						flyTime = <input type="text" onChange={this.changeAirTime.bind(this)} value={this.airTime()} />;
				}
				
				return (
						<div>
								{startTime}
								{landTime}
								{flyTime}
						</div>
				);
		}

		private takeoffTime():string {
				return this.props.state().takeoffTime.format();
		}		

		private takeoff() {
				this.props.dispatch(takeoff());
		}

		private changeTakeoffTime(value:string) {
				let time = Time.parse(value);
				if (time.isValid()) {
						this.props.dispatch(changeTakeoffTime(time));
				}
		}		

		private landTime():string {
				return this.props.state().landTime.format();
		}

		private land() {
				this.props.dispatch(land());
		}

		private changeLandTime(value:string) {
				let time = Time.parse(value);
				if (time.isValid()) {
						this.props.dispatch(changeLandTime(time));
				}				
		}

		private changeAirTime(value:string) {
				let time = Time.parse(value);
				if (time.isValid()) {
						this.props.dispatch(changeAirTime(time));
				}
		}

		private flyingAirTime():string {
				return this.airTime();
		}		

		private airTime() {

				return '';
				/* 
					 var takeoff = moment(this.props.state().takeoffTime);
					 var land = moment(this.props.state().landTime);
					 var diff = land.diff(takeoff, 'minutes');
					 
					 return diff.toString(); */
		}
				
		private isNone():boolean {
				return this.props.state().phase == GliderTimePhase.none;
		}

		private isFlying():boolean {
				return this.props.state().phase == GliderTimePhase.flying;
		}
		
		private isLanded():boolean {
				return this.props.state().phase == GliderTimePhase.landed;
		}		

}
