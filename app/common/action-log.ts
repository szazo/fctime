import { IMiddlewareStore, IDispatch, IAction } from 'redux'; 

import { UUID } from './uuid';

class ActionLogItem {
	id: string;
	action:any;
}

export class ActionLog {

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
	
	public middleware = (store:IMiddlewareStore<any>) => (next:IDispatch) => (action:IAction) => {
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
