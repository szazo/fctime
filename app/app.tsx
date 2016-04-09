import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { DevTools } from './devtools';

import { rootReducer } from './app.model';
import { Timekeeper } from './timekeeper/timekeeper/timekeeper.ui';

class App extends React.Component<{},{}> {

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
														<li><Link to={`/timekeeper`} activeClass="active">Üzemnapok</Link></li>
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
let store = createStore(rootReducer, DevTools.instrument());

ReactDOM.render(
		<Provider store={store}>
				<Router history={hashHistory}>
						<Route path="/" component={App}>
								<Route path="timekeeper" component={Timekeeper}>
								</Route>
						</Route>
				</Router>
		</Provider>
		, document.getElementById('react-container'));
