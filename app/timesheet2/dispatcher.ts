import {Injectable} from 'angular2/core';

export interface IDispatcher {

  dispatch(scope:any, action:any, param:any);
  register(scope:any, name:any, listener:any);
}

@Injectable()
export class Dispatcher implements IDispatcher {

  private queue:any[] = [];
  private subscribers:any[] = [];

  constructor() {

    setInterval(() => {

      if (this.queue.length > 0) {
        var item = this.queue.shift();

        var foundSubscribers = this.subscribers.filter((value) =>{
          return value.scope == item.scope && value.action == item.action;
        });

        for (var i = 0; i < foundSubscribers.length; i++) {

          //console.log('calling listener');

          foundSubscribers[i].listener(item.param);
        }

      }

      //console.log('dequeue');
    }, 100);
  }

  dispatch(scope:any, action:any, param:any) {

    this.queue.push({
      scope: scope,
      action: action,
      param: param
    });

    //console.log('dispatch', action);
  }

  register(scope:any, action:any, listener:any) {

    this.subscribers.push({
      scope: scope,
      action: action,
      listener: listener
    });

    //console.log('register', scope, name);
  }

}
