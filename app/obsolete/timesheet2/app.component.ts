import {Component} from 'angular2/core';
import {EventStore} from './event-store';
import {Dispatcher} from './dispatcher';
import {TimesheetComponent, TimesheetStore} from './timesheet';
//import moment from 'moment';

@Component ({
  selector: 'fc-app',
  //template: `<fc-timesheet>`,
  template: `<fc-timesheet [timesheetStore]="timesheetStore">`,
  providers: [EventStore, Dispatcher, TimesheetStore],
  directives: [TimesheetComponent]
})
export class AppComponent2 {

    constructor(private timesheetStore:TimesheetStore) {
	timesheetStore.create('root');

    //var a:moment.MomentStatic = new moment.MomentStatic();

    //console.log(a);



    var now = moment();
    console.log(now.format());

    var next = moment(now);
    next.add(4, 'minutes');
    next.add(1, 'hours');
    next.add(40, 'seconds');
    console.log(next.format());

    var diff = next.diff(now, 'minutes');

    console.log(diff);

    now.seconds(0);
    console.log(now.format());



    //console.log(moment().quarter());
  }
}
