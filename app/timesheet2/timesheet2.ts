import {Component, Input, Injectable} from 'angular2/core';
import {createStore} from 'redux';

class Dispatcher2 {

	public dispatch(source:string, action:string, payload:any) {

	}

	public register(scope, listener:any) {

	}
}

function addEntry(id:string) {
	return {
		type: 'add_entry',
		id
	}
}

function timesheetView(state: any, action) {

}


class State2 {

	constructor() {

		var store = createStore(timesheetView);
	}

}

@Component({
  selector: 'fc-timesheet',
  template: `
    <div>
    </div>
    <div>
      <button (click)="add()">Add</button>
    </div>
  `,
})
export class TimesheetComponent2 {

	private dispatcher:Dispatcher2;

	constructor() {

		/*
		// itt igazabol egy nezetre kellene attach-olni
		this.dispatcher.register('timesheet_view', (state) => {

			// ha a timesheet-et erinto nezet valtozott, ez maga a lista
			this.state = state;
		});
		*/
	}
	
  private add() {

    // a felhasznalo rakattintott a hozzaadasra
		// ezt az akaratot kell eltarolnunk

		// vegul addig gyujtjuk az action-oket, amig azok egy helyes
		// allapotot allitanak elo, ezt fogjuk merge-elni a fo allapotba,
		// addig az egesz csak egy atmeneti

		// ez az action kivalthat tovabbi action-oket, kulonbozo scope-okban
		// es ez az ami tovabbmegy, attol fuggoen, hogy mi a helyes, de
		// ami a lenyeg, az a felhasznalo action-je

    // a kovetkezo, hogy hogyan taroljuk a causal lancot, ami az allapothoz
		// juttatott, eleg csak a root-okat tarolni, es esetleg a root-ok
		// kozti osszefuggest?
		
		//this.dispatcher.dispatch('timesheet', 'add', {id: 'id'});
		
//    this.timesheetStore.addEntry();
  }
}

