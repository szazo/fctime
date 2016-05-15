import * as React from 'react';
import * as DateTimeField from 'react-bootstrap-datetimepicker';
import { changeDate, changeAirport, changeTimekeeper, changeLeader } from './timesheet-meta.actions';

//declare var DateTimeField:any;

interface TimesheetMetaProps {
		date: string;
		airport: string;
		timekeeper: string;
		leader: string;

		dispatch?: (action:any) => void;		
}

export class TimesheetProps extends React.Component<TimesheetMetaProps, {}> {

		render() {
//				console.log(DateTimeField);
//				alert(DateTimeField);
				
				return <div>
						<form>
								<div class="form-group">
										<label for="date">Dátum</label>
										{/* <DateTimeField /> */}
										
										<input
												type="text"
												className="form-control"
												id="date" placeholder=""
												value={this.props.date}
												onChange={this.handleDateChange.bind(this)} />
								</div>
								<div class="form-group">
										<label for="airport">Repülőtér</label>
										<input
												type="text"
												className="form-control"
												id="airport"
												placeholder="Reptér ICAO kódja"
												onChange={this.handleAirportChange.bind(this)}/>
								</div>
								<div class="form-group">
										<label for="timekeeper">Időmérő</label>
										<input
												type="text"
												className="form-control"
												id="timekeeper"
												placeholder=""
												onChange={this.handleTimekeeperChange.bind(this)}
										/>
								</div>
								<div class="form-group">
										<label for="leader">Repülésvezető</label>
										<input
												type="text"
												className="form-control"
												id="leader"
												placeholder=""
												onChange={this.handleLeaderChange.bind(this)}
										/>
								</div>
						</form>
						</div>
		}

		private handleDateChange(evt:any) {
				this.props.dispatch(changeDate(evt.target.value));
		}

		private handleAirportChange(evt:any) {
				this.props.dispatch(changeAirport(evt.target.value));
		}

		private handleTimekeeperChange(evt:any) {
				this.props.dispatch(changeTimekeeper(evt.target.value));
		}

		private handleLeaderChange(evt:any) {
				this.props.dispatch(changeLeader(evt.target.value));
		}
}
