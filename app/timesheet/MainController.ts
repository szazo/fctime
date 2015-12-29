
class MainController {

  private items:Item[];

  constructor(private $scope, private $interval:ng.IIntervalService) {

    this.items = [
      new Item("id1", State.running, "Oláh Attila", "E", "C", "HA-4524", "", "11:10", "", "bb"),
      new Item("id2", State.stopped, "Juhász Dániel", "E", "C", "HA-4524", "", "12:10", "", "b"),
    ];

    $interval(() => {
      this.updateTimes();
    }, 1000);
  }

  private updateTimes() {

    var currentDate = new Date();
    var time = currentDate.getTime();

    console.log(time);

    // csak az aktualisan futokat kell
    for (var i:number = 0; i < this.items.length; i++) {
      //var item:Item = new Item("id2", State.running, "Juhász Dániel", "E", "C", "HA-4524", "", "12:10", "", time.toString());
      var item = this.items[i];
      if (item.state == State.running) {
        this.items[i].airTime = time.toString();
      }
      //this.$scope.items[i] = item;
    }
  }

}

enum State {
  none,
  running,
  stopped
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
