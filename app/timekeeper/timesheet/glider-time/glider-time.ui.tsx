import * as React from 'react';
import * as moment from 'moment';

import * as classNames from 'classnames';
import { FluxProps } from '../../../common/flux-props';
import { Time } from '../../common/time';
//import * as ReactMaskMixin  from 'react-mask-mixin';

import { GliderTimePhase, takeoff, land, changeTakeoffTime, changeLandTime, changeAirTime, TimeState, TimeStateImpl, TimePhase, recordToTimeState } from './glider-time.model';

interface TimeInputProps {

		value:TimeState;
		onChange?(time: string);
}

class TimeInput extends React.Component<TimeInputProps, {}> {

		constructor() {
				super();
				
//				(this as any).mixins = [ReactMaskMixin];
		}

		/* get mixins() {
			 return [ReactMaskMixin.ReactMaskMixin];
			 } */
		
		render() {

				let classes = classNames('time-input', {
						'has-error': this.props.value.phase == TimePhase.invalid
				})
				
				return (
						<div className={classes}>
								<input maxLength={5} mask="99/99/99" type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.text()} />
						</div>);
		}				
		
		private handleChange(event:any) {

				this.props.onChange(event.target.value);
		}

		private text():string {
				return this.props.value.text;
		}
}

enum TimeButtonStyle {
		none,
		takeoff,
		land
}

interface TimeButtonProps {
		style: TimeButtonStyle;
		
		onClick();
}

class TimeButton extends React.Component<TimeButtonProps, {}> {

		render() {
				let classes = classNames('btn', {
						'btn-primary': this.props.style == TimeButtonStyle.takeoff,
						'btn-success': this.props.style == TimeButtonStyle.land
				});

				return <button className={classes} onClick={this.props.onClick.bind(this)}>{this.props.children}</button>;
		}
}

export class GliderTime extends React.Component<FluxProps, {}> {

		render() {

				let startTime;
				if (this.isNone()) {
						startTime = <TimeButton style={TimeButtonStyle.takeoff} onClick={this.takeoff.bind(this)}>Felszállás</TimeButton>;
				} else if (this.isFlying() || this.isLanded()) {
						startTime = <TimeInput onChange={this.changeTakeoffTime.bind(this)} value={this.takeoffTime()} />
				}

				let landTime;
				if (this.isFlying()) {
						landTime = <TimeButton style={TimeButtonStyle.land} onClick={this.land.bind(this)}>Leszállt</TimeButton>;
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
								<div className="glider-time-column">{startTime}</div>
								<div className="glider-time-column">{landTime}</div>
								<div className="glider-time-column">{flyTime}</div>
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
