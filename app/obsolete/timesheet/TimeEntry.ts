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

    public primarySeatPerson:PersonRef|NotStoredPerson,
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

enum NotStoredPersonType {
  passenger
}

class NotStoredPerson {
  constructor(public type:NotStoredPersonType, public name:string) {

  }
}

class PersonRef {
  constructor(public id:string) {

  }
}
