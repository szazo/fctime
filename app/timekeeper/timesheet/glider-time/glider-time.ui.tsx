import * as React from 'react';
import * as moment from 'moment';

import * as classNames from 'classnames';
import { FluxProps } from '../../../common/flux-props';
import { Time } from '../../common/time';
import * as ReactMaskMixin from 'react-mask-mixin';

import { GliderTimePhase, takeoff, land, changeTakeoffTime, changeLandTime, changeAirTime, TimeState, TimeStateImpl, TimePhase, recordToTimeState } from './glider-time.model';

/*
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
*/

interface TimeInputProps {

		value:TimeState;
		onChange?(time: string);
}

class TimeInput extends React.Component<TimeInputProps, {}> {

		render() {

				let classes = classNames({
						'has-error': this.props.value.phase == TimePhase.invalid
				})
				
				return (
						<div className={classes}>
								<input type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.text()} />
						</div>);
		}				
		
		private handleChange(event:any) {

				this.props.onChange(event.target.value);
		}

		private text():string {
				return this.props.value.text;
		}
}

export class GliderTime extends React.Component<FluxProps, {}> {

		render() {

				let startTime;
				if (this.isNone()) {
						startTime = <button className="takeoff-button" onClick={this.takeoff.bind(this)}>Felszállás</button>;
				} else if (this.isFlying() || this.isLanded()) {
						startTime = <TimeInput onChange={this.changeTakeoffTime.bind(this)} value={this.takeoffTime()} />
						{/* startTime = <input type="text" onChange={this.changeTakeoffTime.bind(this)} value={this.takeoffTime()} />; */}
				}

				let landTime;
				if (this.isFlying()) {
						landTime = <button class="land-button" onClick={this.land.bind(this)}>Leszállt</button>;
				} else if (this.isLanded()) {
						landTime = <TimeInput onChange={this.changeLandTime.bind(this)} value={this.landTime()} />
				}

				let flyTime;
				if (this.isFlying()) {
						flyTime = this.flyingAirTime().text;
				} else if (this.isLanded()) {
						flyTime = <TimeInput onChange={this.changeAirTime.bind(this)} value={this.airTime()} />
				}
				
				return (
						<div>
								{startTime}
								{landTime}
								{flyTime}
						</div>
				);
		}

		private takeoffTime():TimeState {
				return recordToTimeState(this.props.state().takeoffTime);
		}		

		private takeoff() {
				this.props.dispatch(takeoff());
		}

		private changeTakeoffTime(time:string) {
				this.props.dispatch(changeTakeoffTime(time));
		}		

		private landTime():TimeState {
				return recordToTimeState(this.props.state().landTime);
		}

		private land() {
				this.props.dispatch(land());
		}

		private changeLandTime(value:string) {
				this.props.dispatch(changeLandTime(value));
		}

		private changeAirTime(value:string) {
				this.props.dispatch(changeAirTime(value));
		}

		private flyingAirTime():TimeState {

				if (!this.takeoffTime().isValid) {
						return TimeStateImpl.empty();
				}
				
				let diff = Time.now().diffFrom(this.takeoffTime().time);
				return TimeStateImpl.valid(diff);
		}		

		private airTime() {
				
				return recordToTimeState(this.props.state().airTime);
//				return '';
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
