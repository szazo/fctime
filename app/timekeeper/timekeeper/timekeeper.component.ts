import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouterOutlet, RouteConfig } from 'angular2/router';
import { TimesheetListComponent } from './timesheet-list.component';
import { TimesheetComponent } from '../timesheet/timesheet.component';
import { stateProvider } from '../../common/fc-store';
import { changeTimekeeper } from '../../app.model';

@Component({
  template: `
    <h2>Időmérő</h2>
    <router-outlet></router-outlet>
  `,
  directives: [RouterOutlet],
	// TODO: ennek a providernek igazabol egy szinttel fejlebb kene hogy legyen
//	providers: [stateProvider(action => changeTimekeeper(action), state => state.timekeeper )]
})
@RouteConfig([
  { path: '/', name: 'TimesheetList', component: TimesheetListComponent, useAsDefault: true},
	{ path: '/:id', name: 'Timesheet', component: TimesheetComponent}
])
export class TimekeeperComponent {

	constructor() {
	}

	
}
