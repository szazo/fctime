const CHANGE_DATE = 'change_date';
const CHANGE_AIRPORT = 'change_airport';
const CHANGE_TIMEKEEPER = 'change_timekeeper';
const CHANGE_LEADER = 'change_leader';

export function changeDate(date:string) {
	return {
		type: CHANGE_DATE,
		date
	}
}

export function changeAirport(airport:string) {
	return {
		type: CHANGE_AIRPORT,
		airport
	}
}

export function changeTimekeeper(timekeeper:string) {
	return {
		type: CHANGE_TIMEKEEPER,
		timekeeper
	}
}

export function changeLeader(leader:string) {
	return {
		type: CHANGE_LEADER,
		leader
	}
}
