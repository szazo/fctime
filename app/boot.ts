
import {bootstrap} from "angular2/platform/browser";
//import {AppComponent} from "./app.component";
//import {AppComponent2} from './timesheet2/app.component';
import {TimesheetComponent2} from './timesheet2/timesheet2';
import {AppComponent2} from './timesheet2/timesheet2';
import {ROUTER_PROVIDERS} from 'angular2/router';

bootstrap(AppComponent2, [
	ROUTER_PROVIDERS
]);
