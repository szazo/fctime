import * as moment from 'moment';

export class Time {

	private _hour:number;
	private _minute:number;
	
	constructor(hour:number, minute:number) {
		this._hour = hour;
		this._minute = minute;
	}

	public get hour() {
		return this._hour;
	}

	public get minute() {
		return this._minute;
	}
	
	public static empty() {
		return new Time(0, 0);
	}

	private static invalid() {
		return new Time(-1, -1);
	}

	public isValid():boolean {
		return this.hour >= 0 && this.hour <= 23 && this.minute >= 0 && this.minute <= 59;
	}

	public static time(hour:number, minute: number) {
		return new Time(hour, minute);
	}

	public static parse(text:string):Time {
		let m = moment(text, 'HH:mm');
		if (m.isValid()) {
			return Time.fromMoment(m);
		}

		return Time.invalid();
	}

	public static now() {
		let m = moment();
		return this.fromMoment(m);
	}

	public static fromMoment(m:moment.Moment) {
		return Time.time(m.hours(), m.minutes());
	}		

	private format():string {
		let m = moment({ hour:this.hour, minute:this.minute });
		return m.format('HH:mm');
	}		
}
