import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, IReducer, IAction } from 'redux';

import { DevTools } from './devtools';

import { ActionLog } from './common/action-log';
import { UUID } from './common/uuid';
import { rootReducer, RootRecord, managePersons, managePlanes } from './app.model';
import { Timekeeper } from './timekeeper/timekeeper/timekeeper.ui';
import { TimesheetList } from './timekeeper/timekeeper/timesheet-list.ui';
import { EntryList } from './timekeeper/timesheet/entry-list.ui';
import { PersonService } from './person/person-service';
import { createPerson } from './person/person.model';

import { PlaneService } from './plane/plane-service';

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

console.log('store', store);
//		applyMiddleware(actionLog.middleware, DevTools.instrument()));

class App extends React.Component<{},{}> {
		
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
								<nav className="navbar navbar-inverse navbar-fixed-top">
						
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
								</nav>
								{ this.props.children }
								<DevTools />
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
								<Route path="timekeeper" component={Timekeeper}>
										<IndexRoute component={TimesheetList} />
										<Route path="timesheet/:id" component={EntryList} />
								</Route>
						</Route>
				</Router>
		</Provider>
		, document.getElementById('react-container'));
