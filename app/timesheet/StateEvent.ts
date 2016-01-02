class StateEvent {
  constructor(public name:string, public params:any) {
  }
}

class StateEventRevision {

  constructor(
    public evt:StateEvent,
    public revision:number
  ) {}
}

class ChangesSince {
  constructor(
    public since:number,
    public currentRevision:number,
    public changes:StateEvent[]
  ) {}
}
