import {Injectable} from 'angular2/core';

export interface Store {
  // visszaadja, hogy a store allapota jelenleg hol van
  ref:EventRef;
}

export interface Store2 {
	load(ref:EventRef);
}

export interface Event {
  revision:number;
  name:string;
  payload:any;
}

export interface EventData {
  name:string;
  payload:any;
}

export interface EventRef {
  scope:any;
  revision:number;
}

@Injectable()
export class EventStore {

  public commit(previous:EventRef, evt:EventData):EventRef {
    var newRef:EventRef = {
      scope: previous.scope,
      revision: previous.revision + 1
    }

    return newRef;
  }

  public getChanges(ref:EventRef):Event[] {
    return null;
  }
}
