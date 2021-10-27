import { Injectable } from '@angular/core';
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root'
})
export class CareerGoalService {

	environment: any = undefined;

	constructor(private _apiService: ApiService) {

	}

	_init(env: any) {
		this.environment = env;
	}

	getCareerGoalById(id: number) {
		if (isNaN(id))
			console.trace("An invalid ID was passed to getCareerGoalById()")

		let url: string = this.environment.apiUrl + "/api/careergoal/" + id;

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => {
						console.log("Call to getCareerGoalById(" + id + ") returned")
						console.log(data)
						resolve(data);
					}, (err) => {
						reject(err);
					});
			}
			);

		return rtn;
	}

	getAllCareerGoals() {
		let url: string = this.environment.apiUrl + "/api/careergoal/all"

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => {
						console.log("Call to getAllCareerGoals() returned")
						console.log(data)
						resolve(data);
					}, (err) => {
						reject(err);
					});
			}
			);

		return rtn;
	}

	save(careerGoal: any, pathAssociations: any) {
		let url: string = this.environment.apiUrl + '/api/careergoal/save'

		return new Promise(
			(resolve, reject) => {
				this._apiService.postUnsecuredAPI(url, {careergoal: careerGoal, pathassociations: pathAssociations}).subscribe(
					(data) => {
						resolve(data)
					}, (err) => {
						reject(err)
					});
			});
	}


	getCareerGoalForUserId(userId: number) {
		let url: string = this.environment.apiUrl + "/api/user/" + userId + "/careergoal/";

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => { 
						console.log("Career Goal for user " + userId + " received!");
						console.log(data);

						resolve(data);
					}, (err) => {
						reject(err);
					});
			});

		return rtn;
	}

	getNextQuestionsForCareerGoal(userId: number, careerGoalId: number) {
		let url: string = this.environment.apiUrl + "/api/user/" + userId + "/careergoal/" + careerGoalId + "/questions";

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => { 
						console.log("Next Questions Toward Career Goal for user " + userId + " received!");
						console.log(data);

						resolve(data);
					}, (err) => {
						reject(err);
					});
			});	

		return rtn;
	}

	getQuestionsAlreadyAskedInThisSession(userId: number, sessionId: number) {
		let url: string = this.environment.apiUrl + "/api/user/" + userId + "/mockinterviewsession/" + sessionId + "/questions";

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => { 
						console.log("Questions Already Asked In This session for user " + userId + " received!");
						console.log(data);

						resolve(data);
					}, (err) => {
						reject(err);
					});
			});

		return rtn;
	}
}
