import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  /** 
      Given a list of objects with a 'sequence' attribute, that is properly maintained so that the range 
      starts at 1, and there are no gaps, this service will move the elements forward or back.
      
  **/

	list = undefined;

  	FORWARD = 1;
	BACKWARD = -1;

	UP = this.BACKWARD;
	DOWN = this.FORWARD;

  constructor() { }

  moveSequenceByOne(list: any, obj: any, direction: number) {
    if (direction !== this.FORWARD && direction !== this.BACKWARD)
      throw new Error("Invalid value for 'direction' parameter");

  	let done = false;

    if (direction == this.FORWARD) {
      // moving to a higher sequence
      let follower = list.find((e: any) => { return e['sequence'] === obj['sequence'] + 1 })

      if (follower) {
        this.swapSequenceNumbers(follower, obj)
      }
    } else {
      let predecessor = list.find((e: any) => { return e["sequence"] === (obj["sequence"] - 1); })

      if (predecessor) {
        this.swapSequenceNumbers(predecessor, obj);
      }
    }

  	return obj;
  }

  swapSequenceNumbers(obj1: any, obj2: any) {
    let tmp = obj1["sequence"];
    obj1["sequence"] = obj2["sequence"];
    obj2["sequence"] = tmp;
  }

  isAbleToMove(list: any, obj: any, direction: number) {
    if (direction !== this.FORWARD && direction !== this.BACKWARD)
      throw new Error("Invalid value for 'direction' parameter");

  	let max = -1;
  	list.forEach((o: any) => { if (o['sequence'] > max) max = o['sequence'] });

  	let lastObj = list.find((o: any) => o['sequence'] === max);

  	if (direction == this.FORWARD) {
  		// moving to a higher sequence
      return obj['sequence'] + direction <= lastObj['sequence']
  	} else {
  		return obj['sequence'] + direction > 0
  	}
  }
}

