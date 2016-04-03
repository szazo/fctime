class Time {
  private time:string;


}

class TimesheetState {
  constructor(private items:Item[]) {

  }

  public mutate(evt:StateEvent) {

    switch (evt.name) {
      case 'entryCreated':
        this.entryCreated(evt.params.id);
        break;
      case 'instructorChanged':
        this.instructorChanged(evt.params.id, evt.params.name);
        break;
      case 'primarySeatPersonChanged':evt
        this.primarySeatPersonChanged(evt.params.id, evt.params.person);
      case 'tookOff':
        this.tookOff(evt.params.id, evt.params.time);
        break;
      case 'landed':
        this.landed(evt.params.id, evt.params.time);
        break;
    }
  }

  private tookOff(id:string, time:string) {
    var item = this.getItem(id);
    item.takeoffTime = time;
    item.state = State.flying;
  }

  private landed(id:string, time:string) {
    var item = this.getItem(id);
    item.landTime = time;
    item.state = State.landed;
  }

  private entryCreated(id:string) {
    var emptyItem = new Item(id, State.none, null, '', '', '', '', '', '', '');
    this.items.push(emptyItem);
  }

  private primarySeatPersonChanged(id:string, person:PersonRef|NotStoredPerson) {
    var item = this.getItem(id);
    item.primarySeatPerson = person;
  }

  private instructorChanged(id:string, name:string) {
    var item = this.getItem(id);
    item.instructor = name;
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
}
