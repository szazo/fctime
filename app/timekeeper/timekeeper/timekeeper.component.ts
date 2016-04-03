import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouterOutlet, RouteConfig } from 'angular2/router';
import { TimesheetListComponent } from './timesheet-list.component';
import { TimesheetComponent } from '../timesheet/timesheet.component';

@Component({
  template: `
    <h2>Időmérő</h2>
    <router-outlet></router-outlet>
  `,
  directives: [RouterOutlet]
})
@RouteConfig([
  { path: '/', name: 'TimesheetList', component: TimesheetListComponent, useAsDefault: true},
	{ path: '/:id', name: 'Timesheet', component: TimesheetComponent}
])
export class TimekeeperComponent {

}
