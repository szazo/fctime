import {createStore, applyMiddleware, IMiddlewareStore, IStore, IAction, IDispatch, compose } from 'redux';
// import {Injectable, provide, SkipSelf, Host} from 'angular2/core'; // 

import {UUID} from './uuid';

const middleware = (store:IMiddlewareStore<State>) => (next:IDispatch) => (action:IAction) => {

		return next(action);

//	console.debug('action:', action);

}

class ActionLogItem {
	id: string;
	action:any;
}

class ActionLog {

	private logItems:ActionLogItem[] = [];
	private isEnabled:boolean = true;

	public clear() {
    window.localStorage.removeItem('fc-actions');
		this.logItems = [];
	}
	
	public load() {
		let read = window.localStorage.getItem('fc-actions');

		if (read) {
			this.logItems = JSON.parse(read);
		} else {
			this.logItems = [];
		}

		//console.log('loaded items', this.logItems);
	}

	public actions():ActionLogItem[] {
		return this.logItems;
	}
	
	public middleware = (store:IMiddlewareStore<State>) => (next:IDispatch) => (action:IAction) => {
		let nextDispatch = next(action);

		if (this.isEnabled) {
			this.add(action, null);
		}

		return nextDispatch;
	}

	public enable() {
		this.isEnabled = true;
	}

	public disable() {
		this.isEnabled = false;
	}

	private add(action:any, nextState:any)
	{
		var logItem = new ActionLogItem();
		logItem.id = UUID.generate();
		logItem.action = action;

		this.store(logItem);
	}

	private store(logItem:ActionLogItem) {

		this.logItems.push(logItem);
		
		var json = JSON.stringify(this.logItems);

//		console.log('storing json', json);
		
		window.localStorage.setItem('fc-actions', json);
//		logItem.toJSON();
	}	
}

export class State {
	public get state():any {
		throw new Error();
	}
	
	public dispatch(action:any) {
		throw new Error();
	}
}

export class FcStore extends State {

	private _store:IStore<any>;
	private actionLog: ActionLog;
	
	constructor() {
		super();
		
		this.actionLog = new ActionLog();
	}

	public load(rootReducer:any) {

		// create the store
		this._store = createStore(
			rootReducer,
			applyMiddleware(middleware, this.actionLog.middleware)
		);
		
		this.actionLog.clear();
		this.actionLog.load();
		if (this.actionLog.actions().length > 0) {

			console.log('we have data, loading...');
			
			// we have data
			this.actionLog.disable();
			
			let actions = this.actionLog.actions();
			for (var i in actions) {
				var action = actions[i].action;
				this._store.dispatch(action);
			}

			this.actionLog.enable();			
		}
	}

	public dispatch(action: any): any {
		return this._store.dispatch(action);
	}

	public get state(): any {
		return this._store.getState();
	}

	public get store(): IStore<any> {
		return this._store;
	}
}
