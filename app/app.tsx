import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, IReducer, IAction } from 'redux';
import { Navbar, NavbarCollapse, Nav, NavItem, Row, Grid, Col } from 'react-bootstrap';
import { RouteNavItem } from './common/route-nav-item';
import * as Breadcrumbs from 'react-bootstrap-breadcrumbs';
import { DevTools } from './devtools';

import { ActionLog } from './common/action-log';
import { UUID } from './common/uuid';
import { rootReducer, RootRecord, managePersons, managePlanes } from './app.model';
import { Timekeeper } from './timekeeper/timekeeper/timekeeper.ui';
import { TimesheetList } from './timekeeper/timekeeper/timesheet-list.ui';
import { EntryList } from './timekeeper/timesheet/entry-list.ui';
import { TimesheetMeta} from './timekeeper/timesheet/props/timesheet-meta.reduxmapping';
import { Timesheet } from './timekeeper/timesheet/timesheet.ui';
import { PersonService } from './person/person-service';
import { createPerson } from './person/person.model';

import { PlaneService } from './plane/plane-service';

require('./styles/main.scss');
require('react-bootstrap-table/css/react-bootstrap-table-all.min.css');

let actionLog = new ActionLog();

let state:any = new RootRecord();

console.log(state);

//actionLog.clear();
actionLog.load();
if (actionLog.actions().length > 0) {

		console.log('we have data, loading...');
		
		// we have data
		actionLog.disable();
		
		let actions = actionLog.actions();
		for (var i in actions) {
				state = rootReducer(state, actions[i].action);
		}

		actionLog.enable();

		console.log('loaded data', state);
}

//let devToolsMiddleware:any = DevTools.instrument();
//let enhancer:any = applyMiddleware(devToolsMiddleware);

//let store = enchancer(rootReducer);

//let store:any =  applyMiddleware(devToolsMiddleware)(rootReducer);
let createStore2:any = createStore;
let store = createStore2(rootReducer, state, applyMiddleware(actionLog.middleware));

let planeService = new PlaneService(
		() => store.getState().planes,
		(action:IAction) => store.dispatch(managePlanes(action))
);

let personService = new PersonService(
		() => store.getState().persons,
		(action:IAction) => store.dispatch(managePersons(action)));

let createDummyPersons = () => {

		personService.createPerson('Oláh Attila', 'Endresz', 'C');
		personService.createPerson('Bagó Tomi', 'Endresz', 'C');
		personService.createPerson('Juhász Dani', 'Endresz', 'C');
		personService.createPerson('Sall Pisti', 'Endresz', 'C');
		personService.createPerson('Tóth Balázs', 'Endresz', 'C');
}

let createDummyPlanes = () => {

		planeService.createPlane(UUID.generate(), 'HA-5560', 'R22');
		planeService.createPlane(UUID.generate(), 'HA-5524', 'Astir CS');
		planeService.createPlane(UUID.generate(), 'HA-5065', 'KA-7');		
}

if (actionLog.actions().length == 0) {
		createDummyPersons();
		createDummyPlanes();
}

function getRouteTitle(name:string, route:any, params:any) {
		/* switch (name) {
			 case 'root':
			 return 'Kezdőlap';
			 case 'timesheet-list':
			 return 'Üzemnapok';
			 case 'timesheet':
			 return 'Üzemnap';
			 default:
			 return 'unknown';
			 } */
}

console.log('store', store);
//		applyMiddleware(actionLog.middleware, DevTools.instrument()));

class Logo extends React.Component<{}, {}> {

		render() {

				return (

						<div style={{width: '50%'}}>
 								<img style={{width: '500px', margin: 'auto'}} src="app/img/logo.jpg" />
						</div>
				);
		}
}

class App extends React.Component<{routes:any, params:any},{}> {
		
		static childContextTypes = {
				personService: React.PropTypes.object,
				planeService: React.PropTypes.object
		}
		
		getChildContext() {
				
				return {
						personService: personService,
						planeService: planeService
				}
		}
		
		render() {
				return (
						
						<div>
								<Navbar inverse fixedTop fluid>
										<Navbar.Header>
												<Navbar.Brand>
														<a href="#">
																<img style={{width: '30px'}} src="app/img/logo.jpg" />
														</a>
												</Navbar.Brand>
										</Navbar.Header>
										<Navbar.Collapse>
												<Nav>
														<RouteNavItem path="/timekeeper">Időmérő</RouteNavItem>
												</Nav>
										</Navbar.Collapse>
								</Navbar>

								
								{/* <nav className="navbar navbar-inverse navbar-fixed-top">
								
								<div className="container-fluid">
								<div className="navbar-header">
								<a className="navbar-brand" href="#">
								<img style={{width: '30px'}} src="app/img/logo.jpg" />
								</a>
								</div>
								<ul className="nav navbar-nav">
								<li><Link to={`/timekeeper`} activeClass="active">Időmérő</Link></li>
								</ul>
								</div>
								</nav> */}

								<Breadcrumbs getTitle={getRouteTitle}
														 routes={this.props.routes}
														 params={this.props.params} />
								<Grid fluid>
										<Row>
												<Col xs="12">
														{ this.props.children }
												</Col>
										</Row>
								</Grid>
								{/* <DevTools /> */}
						</div>
				);
		}
}

/* /*
	 var fcStore = new FcStore();
	 fcStore.load(rootReducer);
 */

ReactDOM.render(
		<Provider store={store}>
				<Router history={hashHistory}>
						<Route path="/" component={App}>
								<IndexRoute component={Logo} />
								<Route path="timekeeper" component={Timekeeper}>
										<IndexRoute component={TimesheetList} />
										{/* <Route path="timesheet/:id" component={EntryList} /> */}
										<Route path="timesheet/:id" component={Timesheet}>
												<IndexRoute component={EntryList} />
												<Route path="props" component={TimesheetMeta} />
										</Route>
								</Route>
						</Route>
				</Router>
		</Provider>
		, document.getElementById('react-container'));
