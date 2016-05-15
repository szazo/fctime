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
		return new Time(-1, -1);
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
		let m = moment(text, 'HH:mm', true);
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

	public diffFrom(previous:Time):Time {

		if (!this.isValid()) {
			return Time.empty();
		}

		if (!previous.isValid()) {
			return Time.empty();
		}
		
		let thisMoment = this.timeToMoment(this);
		let previousMoment = this.timeToMoment(previous);
		
		let diffMinutes = thisMoment.diff(previousMoment, 'minutes');

		let duration = moment.duration(diffMinutes, 'minutes');
		
		return Time.time(duration.hours(), duration.minutes());		
	}

	public add(other:Time):Time {

		if (!this.isValid()) {
			return Time.empty();
		}

		if (!other.isValid()) {
			return Time.empty();
		}

		let thisMoment = this.timeToMoment(this);
		let newMoment = thisMoment
			.add(other.hour, 'hours')
			.add(other.minute, 'minutes');

		return Time.fromMoment(newMoment);
	}

	public format():string {
		let m = this.toMoment();
		return m.format('HH:mm');
	}

	private toMoment() {
		let m = this.timeToMoment(this);

		return m;
	}

	private timeToMoment(time:Time) {
		let m = moment({ hour:time.hour, minute:time.minute });
		return m;
	}
}
