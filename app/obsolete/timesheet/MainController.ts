//declare var app:ng.IModule;

app.directive('fcPerson', () => {
  return {
    restrict: 'E',
    template: '<div>{{person}}</div>',
    scope: {
      person: '='
    }
  }
});

app.directive('fcPersonFormat', () => {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: (scope, element, attr, ngModel:ng.INgModelController) => {
      //console.log('scope', scope);
      //console.log('element', element);
      //console.log('attr', attr);
      //console.log('ngModel', ngModel);

      var parse = (text) => {
        console.log('parseViewValue', text);
        return text;
      }

      var format = (modelValue) => {
        console.log('formatModelValue:', modelValue);
        if (modelValue instanceof PersonRef) {
          return 'personref';
        }

        if (modelValue instanceof NotStoredPerson) {
          return modelValue.name;
        }

        return modelValue;
        //(modelValue || '').toUpperCase();
      }

      var validator = (modelValue, viewValue) => {
        console.log('validatorModel', modelValue);
        console.log('validatorView', viewValue);

        if (modelValue instanceof PersonRef) {
          return true;
        }

        if (modelValue instanceof NotStoredPerson) {
          return true;
        }

        return false;
      }

      ngModel.$formatters.push(format);
      ngModel.$parsers.push(parse);
      ngModel.$validators['person'] = validator;
    }
  }
})

interface TimesheetView {
  changed():void;
}

class Person {
  constructor(public id:string, public name:string) {

  }
}

class PersonStore {

}

class MainController implements TimesheetView {

  private items:Item[];
  private persons:Person[];
  private selectedPerson:any;

  private store:TimesheetStore;
  private viewState:TimesheetState;
  private lastRevision:number;

  constructor(private $scope, private $interval:ng.IIntervalService, private $q:ng.IQService) {

    this.store = new TimesheetStore(this);

    this.persons = [
      new Person("person1", "Nagy József"),
      new Person("person2", "Repülős Pista")
    ];

    this.lastRevision = 0;
    this.items = [];
    this.viewState = new TimesheetState(this.items);

    /* [
      new Item("id1", State.flying, "Oláh Attila", "E", "C", "HA-4524", "Oktató1", "11:10", "", ""),
      new Item("id2", State.none, "Juhász Dániel", "E", "C", "HA-4524", "Oktató2", "12:10", "", ""),
    ];*/

    this.addEmpty();

    $interval(() => {
      this.updateTimes();
    }, 1000);
  }

  public changed() {

    this.$scope.$evalAsync(() => {
      var changesSince = this.store.since(this.lastRevision);

      for (var i = 0; i < changesSince.changes.length; i++) {
        var evt = changesSince.changes[i];
        console.log("newEvent", evt);
        this.viewState.mutate(evt);
      }
      this.lastRevision = changesSince.currentRevision;
    });
  }

  private addEmpty() {
    this.store.createEntry();
  }

  private formatPerson(model) {
    console.log('format', model);

    return 'alma';
  }

  private setAsPassenger(id, ctrl:ng.INgModelController) {
    console.log('setAsPassenger');
    console.log('setAsPassenger', ctrl.$viewValue);

    this.store.changePrimarySeatPerson(id, new NotStoredPerson(NotStoredPersonType.passenger, ctrl.$viewValue));

    //ctrl.$viewValue = 'alma';
    ctrl.$validate();
  }

  private primarySeatPersonSelected(id, item, model, label) {

    this.store.changePrimarySeatPerson(id, new PersonRef(model.id));
    console.log('item', item);
    console.log('model', model);
    console.log('label', label);
  }

  private instructorSelected(item, model, label) {

    console.log('item', item);
    console.log('model', model);
    console.log('label', label);
  }

  private changeInstructor(id:string):void {

    var item = this.getItem(id);
    this.store.changeInstructor(id, item.instructor);
  }

  private takeOff(id:string):void {

    this.store.takeOff(id);
  }

  private land(id:string):void {

    this.store.land(id);
  }

  private getHoursMinutes(date:Date):string {

    return date.getUTCHours() + ":" + date.getUTCMinutes();
  }

  private parseHoursMinutes(str:string):Date {

    var items = str.split(':');
    var date = new Date(0);
    date.setUTCHours(Number(items[0]));
    date.setUTCMinutes(Number(items[1]));

    return date;
  }

  private getItem(id:string):Item {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.id == id) {
        return item;
      }
    }

    return null;
  }

  private updateTimes() {

    var currentDate = this.parseHoursMinutes(this.getHoursMinutes(new Date()));

    // csak az aktualisan futokat kell
    for (var i:number = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.state == State.flying) {

        if (!item.takeoffTime) {
          continue;
        }

        var takeoff = this.parseHoursMinutes(item.takeoffTime);
        var diff = currentDate.getTime() - takeoff.getTime();
        var diffDate = new Date(0);
        diffDate.setMilliseconds(diff);

//        console.log(diffDate);
//        console.log(this.getHoursMinutes(diffDate));

        this.items[i].airTime = this.getHoursMinutes(diffDate);
      }
      //this.$scope.items[i] = item;
    }
  }

}

app.controller('mainController', MainController);
