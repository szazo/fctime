
interface TimesheetView {
  changed():void;
}


class MainController implements TimesheetView {

  private items:Item[];

  private store:TimesheetStore;
  private viewState:TimesheetState;
  private lastRevision:number;

  constructor(private $scope, private $interval:ng.IIntervalService, private $q:ng.IQService) {

    this.store = new TimesheetStore(this);

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

enum State {
  none,
  flying,
  landed
}

// TODO: valid elnevezések
class Item {

  constructor(
    public id:string,
    public state:State,

    public name:string,
    public club:string,
    public level:string,
    public reg:string,
    public instructor:string,
    public takeoffTime:string,
    public landTime:string,
    public airTime:string)
  {

  }
}
