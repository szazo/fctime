class TimesheetStore {

  private items:Item[];
  private view:TimesheetView;
  private revision:number;
  private changes:StateEventRevision[];
  private state:TimesheetState;

  constructor(view:TimesheetView) {
    this.revision = 0;
    this.items = [];
    this.changes = []
    this.view = view; // ezt majd valami eventekkel kell
    this.state = new TimesheetState(this.items);
  }

  public createEntry() {
    var id = this.generateUUID();
    var evt = new StateEvent('entryCreated', {id: id});

    this.applyEvent(evt);
  }

  public changeInstructor(id: string, name:string) {
    var evt = new StateEvent('instructorChanged', {id: id, name:name});
    this.applyEvent(evt);
  }

  public takeOff(id:string):void {

    var time = this.getHoursMinutes(new Date());
    var evt = new StateEvent('tookOff', {id:id, time: time});

    this.applyEvent(evt);
  }

  public land(id:string): void {

    var time = this.getHoursMinutes(new Date());
    var evt = new StateEvent('landed', {id:id, time: time});

    this.applyEvent(evt);
  }

  private applyEvent(evt:StateEvent) {
    this.revision++;
    this.changes.push(new StateEventRevision(evt, this.revision));
    this.mutate(evt);

    this.view.changed();
  }

  private getHoursMinutes(date:Date):string {

    return date.getUTCHours() + ":" + date.getUTCMinutes();
  }

  public since(since:number):ChangesSince {
    var newEvents = [];
    for (var i = 0; i < this.changes.length; i++) {
      if (this.changes[i].revision > since) {
        newEvents.push(this.changes[i].evt);
      }
    }

    return new ChangesSince(since, this.revision, newEvents);
  }

  private mutate(evt:StateEvent) {

    this.state.mutate(evt);
  }

  private generateUUID(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
          d += performance.now();; //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
  }

/*
  private invalidateItem(id:string) {
    var item = this.getItem(id);
    var cloned = angular.copy(item);

    console.log("change", item);

    this.view.itemChanged(cloned);
  }
*/
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
