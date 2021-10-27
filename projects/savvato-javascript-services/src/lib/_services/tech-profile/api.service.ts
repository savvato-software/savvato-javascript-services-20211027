import { Injectable } from '@angular/core';
import { ApiService } from '../api.service'

@Injectable({
  providedIn: 'root'
})
export class TechProfileAPIService {

  environment: any | undefined;

  constructor(private _apiService: ApiService) {

  }

  setEnvironment(env: any) {
  	this.environment = env;
  }

  get(techProfileId: number) {
    let url: string = this.environment.apiUrl + "/api/techprofile/" + techProfileId;

  	let rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.get(url).subscribe(
  				(data) => { 
  					console.log("getTechProfile API call returned");
  					console.log(data);

  					resolve(data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;
  }

  getScores(userId: number) {
    console.log("calling to get TechProfile scores for [" + userId + "] ");
  	let url: string = this.environment.apiUrl + "/api/user/" + userId + "/techprofile/scores";

  	let rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.get(url).subscribe(
  				(data) => { 
  					console.log("get TechProfile scores for [" + userId + "] API call returned");
  					console.log(data);

  					resolve(data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;  
  }

  saveScores(userId: number, scores: any) {
  	let url: string = this.environment.apiUrl + "/api/user/" + userId + "/techprofile/scores";

  	let data: string = this.JSON_to_URLEncoded(scores);

  	let rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.post(url, data).subscribe(
  				(data) => { 
  					console.log("POST TechProfile scores for [" + userId + "] API call returned");
  					console.log(data);

  					resolve(data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;  
  }

  addTopic(name: string) {
  	let url: string = this.environment.apiUrl + "/api/techprofile/topics/new"

  	let data: string = "topicName="+name

  	let rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.post(url, data).subscribe(
  				(data) => {
  					console.log("POST addTopic [" + name + "] API call returned")
  					console.log(data)

  					resolve(data)
  				}, (err) => {
  					reject(err)
  				});
  		});

  	return rtn;
  }

  addLineItem(topicId: number, name: string) {
  	return this.addLineItemWithDescriptions(topicId, name, "level 0 desc", "level 1 desc", "level 2 desc", "level 3 desc");
  }

  addLineItemWithDescriptions(topicId: number, name: string, l0description: string, l1description: string, l2description: string, l3description: string) {
  	let url: string = this.environment.apiUrl + "/api/techprofile/topics/" + topicId + "/lineitem/new"

  	let data: string = "lineItemName="+name
  		+"&l0description="+l0description
  		+"&l1description="+l1description
  		+"&l2description="+l2description
  		+"&l3description="+l3description;

  	let rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.post(url, data).subscribe(
  				(data) => {
  					console.log("POST addLineItem [" + name + "] API call returned")
  					console.log(data)

  					resolve(data)
  				}, (err) => {
  					reject(err)
  				});
  		});

  	return rtn;
  }

  updateLineItemWithDescriptions(lineItem: any) {
  	let url: string = this.environment.apiUrl + "/api/techprofile/lineitem/" + lineItem["id"];
    let rtn = new Promise((resolve: Function, reject: Function) => { reject("invalid line item data") });

  	if (lineItem["name"] !== undefined 
        && lineItem["l0Description"] !== undefined
        && lineItem["l1Description"] !== undefined
        && lineItem["l2Description"] !== undefined
        && lineItem["l3Description"] !== undefined) {

        	rtn = new Promise((resolve: Function, reject: Function) => {
        			this._apiService.postUnsecuredAPI(url, {lineItem: lineItem}).subscribe(
        				(data) => {
        					console.log("POST updateLineItem [" + lineItem['id'] + "] API call returned")
        					console.log(data)

        					resolve(data)
        				}, (err) => {
        					reject(err)
        				});
        		});
        }

  	return rtn;
  }

  updateTopic(topic: any) {
    let url: string = this.environment.apiUrl + "/api/techprofile/topic/" + topic["id"]
    let rtn:Promise<any> = new Promise((resolve, reject) => resolve(null));

    if (topic['name'] !== undefined) {
      rtn = new Promise(
        (resolve, reject) => {
              this._apiService.postUnsecuredAPI(url, {topic: topic}).subscribe(
                (data) => {
                  console.log("POST updateTopic [" + topic['id'] + "] API call returned")
                  console.log(data)

                  resolve(data)
                }, (err) => {
                  reject(err)
                });
            });
    }

    return rtn;
  }

  addExistingLineItem(parentTopicId: number, existingLineItemId: number) { 
    let url: string = this.environment.apiUrl + "/api/techprofile/topic/" + parentTopicId + "/addExistingLineItemAsChild"
    let rtn = new Promise((resolve, reject) => {
      let data = "existingLineItemId="+ existingLineItemId;

      this._apiService.post(url, data).subscribe((data) => {
        console.log("POST addExistingLineItem call returned")
        console.log(data);
        resolve(data);
      })
    })

    return rtn;
  }

  deleteExistingLineItem(parentTopicId: number, lineItemId: number) { 
    let url: string = this.environment.apiUrl + "/api/techprofile/topic/" + parentTopicId + "/lineItem/" + lineItemId
    let rtn = new Promise((resolve, reject) => {

      this._apiService.delete(url).subscribe((data) => {
        console.log("DELETE deleteExistingLineItem call returned")
        console.log(data);
        resolve(data);
      })
    })

    return rtn;
  }

  saveSequenceInfo(arr: any) {
    let url: string = this.environment.apiUrl + "/api/techprofile/sequences"
    let rtn = new Promise(
      (resolve, reject) => {
        this._apiService.postUnsecuredAPI(url, {arr: arr}).subscribe(
          (data) => {
            console.log("POST sequence info API call returned")
            console.log(data)
            resolve(data)
          }, (err) => {
            reject(err);
          }
        )
      }
    )

    return rtn
  }

	JSON_to_URLEncoded(scores: any){
		var list = '';
	
		var ctr = 0;
		scores.map((score: any) => {
			list += "userId"+ctr+"="+score.userId;
			list += "&techProfileLineItemId"+ctr+"="+score.techProfileLineItemId;
			list += "&techProfileLineItemScore"+ctr+"="+score.techProfileLineItemScore;

			if (ctr+1 < scores.length)
				list += "&";

			ctr++;
		})

		list += "&count="+ (ctr);

		return list;
	}

}
