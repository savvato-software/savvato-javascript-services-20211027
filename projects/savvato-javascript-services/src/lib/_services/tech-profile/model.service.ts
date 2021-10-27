import { Injectable } from '@angular/core';

import { TechProfileAPIService } from './api.service';
import { SequenceService } from '../sequence.service';

@Injectable({
  providedIn: 'root'
})
export class TechProfileModelService {

	techProfile: any = null;
	questionCountsPerCell: number | undefined;

	resetCalculatedStuffCallback: Function | undefined;

	environment: any = null;

	constructor(protected _techProfileAPI: TechProfileAPIService,
				protected _sequenceService: SequenceService	) { }

	setEnvironment(env: any) {
		this.environment = env;

		this._techProfileAPI.setEnvironment(env);
	}

	// This service is initialized two different ways.. By _init(), which calls the API directly,
	//  and setProviderForTechProfile, which uses a passed-in function from a third party. 

	_init(force?: boolean) {
		let self = this;

		if (!self.environment)
			throw new Error("The environment object has not been set on the TechProfileModelService");


		if (force || self.techProfile === undefined) {
			self.techProfile = null;
			self.questionCountsPerCell = undefined;

			self._techProfileAPI.get(1).then((tp) => {
				self.techProfile = tp;

				if (self.resetCalculatedStuffCallback) 
					self.resetCalculatedStuffCallback();
			})
		}
	}


	setProviderForTechProfile(func: Function) {
		this.techProfile = func();
	}

	waitingPromise() {
		let self = this;

		// Is this working correctly? It just spins until the isTechProfileAvailable() returns true. 
		//  shouldn't it initiate the call too? When code calls this method, is it not expecting that
		//  calling this will begin the model creation process, rather than just waiting?
		//
		// See eog-mobile2/offer-model-service

		return new Promise((resolve, reject) => {

			function to() {
				setTimeout(() => {
					if (self.isTechProfileAvailable())
						resolve(true);
					else
						to();
				}, 600);
			}

			to();
		})
	}

	setResetCalculatedStuffCallback(func: Function) {
		this.resetCalculatedStuffCallback = func;
	}

	getModel() {
		return this.techProfile;
	}

	getName() {
		let model: any = this.getModel();

		if (model) 
			return model['name']
		else
			return undefined;
	}

	getTopics() {
		return this.techProfile && this.techProfile["topics"].sort((a: any, b: any) => { return a["sequence"] - b["sequence"]; });
	}

	getTopicById(id: number) {
		return this.techProfile && this.techProfile["topics"].filter((t: any) => { return t['id'] === id; });
	}

	getLineItemsForATopic(topicId: number) {
		return this.getTechProfileLineItemsByTopic(topicId);
	}

	isTechProfileAvailable() {
		return this.techProfile && this.techProfile != null
	}

	// setTechProfile(techProfile) {
	// 	this.techProfile = techProfile;
	// }

	isTopicAbleToMoveUp(topicId: number) {
		let rtn: boolean = false;

		if (topicId) {
			let topic: any = this.techProfile && this.techProfile["topics"].find((t: any) => { return t['id'] === topicId });

			if (topic)
				rtn = this._sequenceService.isAbleToMove(this.techProfile["topics"], topic, -1);
		}
	
		return rtn;
	}

	isTopicAbleToMoveDown(topicId: number) {
		let rtn: boolean = false;

		if (topicId) {

			let topic: any = this.techProfile && this.techProfile["topics"].find((t: any) => { return t['id'] === topicId });

			if (topic)
				return this._sequenceService.isAbleToMove(this.techProfile["topics"], topic, 1);
		}

		return rtn;
	}

	moveSequenceForTechProfileTopic(topicId: number, direction: number) {
		let topic: any = this.techProfile && this.techProfile["topics"].find((t: any) => { return t['id'] === topicId });

		if (topic)
			return this._sequenceService.moveSequenceByOne(this.techProfile["topics"], topic, direction);
		else
			console.error("Topic with ID " + topicId + " not found. Nothing to move.");
	}

	isLineItemAbleToMoveUp(topicId: number, lineItemId: number) {
		let topic: any = this.techProfile && this.techProfile["topics"].find((t: any) => { return t['id'] === topicId });

		let lineItem: any = topic && topic["lineItems"] && topic["lineItems"].find((li: any) => { return li['id'] === lineItemId });

		if (lineItem)
			return this._sequenceService.isAbleToMove(topic["lineItems"], lineItem, -1);

		return false;
	}

	isLineItemAbleToMoveDown(topicId: number, lineItemId: number) {
		let topic: any = this.techProfile && this.techProfile["topics"].find((t: any) => { return t['id'] === topicId });

		let lineItem: any = topic && topic["lineItems"] && topic["lineItems"].find((li: any) => { return li['id'] === lineItemId });

		if (lineItem) 
			return this._sequenceService.isAbleToMove(topic["lineItems"], lineItem, 1)

		return false;
	}

	moveSequenceForTechProfileLineItem(topicId: number, lineItemId: number, direcionPlusOrMinus: number) {
		let topic: any = this.techProfile && this.techProfile["topics"].find((t: any) => { return t['id'] === topicId });
		let lineItem: any = topic && topic["lineItems"].find((li: any) => { return li['id'] === lineItemId });

		if (lineItem)
			return this._sequenceService.moveSequenceByOne(topic["lineItems"], lineItem, direcionPlusOrMinus);
		else
			console.error("LineItem with ID " + lineItemId + " not found. Nothing to move.");
	}

	saveSequenceInfo() {
		return new Promise((resolve, reject) => {
			let arr1: any = [];

			this.techProfile['topics'].forEach((topic: any) => {
				let arr: any = [];

				if (topic['lineItems'].length > 0) {
					topic['lineItems'].forEach((lineItem: any) => {
						let row = []
						row.push(1) // techProfileId
						row.push(topic['id'])
						row.push(topic['sequence'])

						row.push(lineItem['id'])
						row.push(lineItem['sequence'])

						arr.push(row);
					})
				} else {
					// this topic does not have line items
					arr.push([1 /* tech profile id */, topic['id'], topic['sequence'], -1, -1])
				}

				arr1.push(arr);
			})

			this._techProfileAPI.saveSequenceInfo(arr1).then((data: any) => {
				resolve(data);
			}, (err) => {
				reject(err);
			})
		})
	}

	getTechProfileLineItemsByTopic(topicId: number) {
		let rtn = undefined;
		let topic = this.techProfile && this.techProfile["topics"].find((t: any) => { return t["id"] === topicId; });

		if (topic) {
			rtn = topic["lineItems"].sort((a: any, b: any) => { return a["sequence"] - b["sequence"]; });
		}

		return rtn;
	}

	getTechProfileLineItemById(lineItemId: number) {
		let rtn = undefined;

		for (var x=0; this.techProfile && !rtn && x < this.techProfile["topics"].length; x++) {
			rtn = this.techProfile["topics"][x]["lineItems"].find((li: any) => { return li["id"] === lineItemId; });
		}

		return rtn;
	}

	updateTechProfileTopic(topic: any) {
		let self = this;
		if (topic.id !== -1) {
			return self._techProfileAPI.updateTopic(topic).then(() => self._init(true));
		} else {
			console.error("A topic with no backend id was passed to updateTechProfileTopic.");
            return false;
		}
	}

	updateTechProfileLineItem(lineItem: any) {
		let self = this;
		if (lineItem.id !== -1) {
			return self._techProfileAPI.updateLineItemWithDescriptions(lineItem).then(() => self._init(true));
		} else {
			console.error("A lineItem with no backend id was passed to updateTechProfileLineItem.");
            return false;
		}
	}

	addTopic(name: string) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.addTopic(name).then(() => {
				self._init(true);

				resolve(true);
			})
		});
	}

	addLineItem(parentTopicId: number, lineItemName: string) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.addLineItem(parentTopicId, lineItemName).then(() => {
				self._init(true);

				resolve(true);
			})
		})
	}

	addExistingLineItem(parentTopicId: number, lineItemId: number) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.addExistingLineItem(parentTopicId, lineItemId).then(() => {
				self._init(true);

				resolve(true);
			})
		})
	}
	
	deleteExistingLineItem(parentTopicId: number, lineItemId: number) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.deleteExistingLineItem(parentTopicId, lineItemId).then(() => {
				self._init(true);

				resolve(true);
			})
		})
	}
	
}
