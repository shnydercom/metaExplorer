//import { IHypermedia } from "hydraclient.js/src/DataModel/IHypermedia";
import { IKvStore } from "ldaccess/ikvstore";
import { LDConsts } from 'ldaccess/LDConsts';
import { IHypermediaContainer } from "hydraclient.js/src/DataModel/IHypermediaContainer";
import { LDDict } from "ldaccess/LDDict";

export let singleHyperMediaToKvStores = (inputHM: any): IKvStore[] => {
	var kvStoreArray: IKvStore[] = new Array<IKvStore>();
	for (var key in inputHM) {
		if (inputHM.hasOwnProperty(key)) {
			let value = inputHM[key];
			//TODO: here would be a possible point to add a search for possible types based on the key
			let ldType = null;
			let newKvStore: IKvStore = {
				key: key,
				value: value,
				ldType: ldType,
				//intrprtrClass: null
			};
			kvStoreArray.push(newKvStore);
		}
	}
	return kvStoreArray;
};

export let multiHyperMediaToKvStores = (inputHMs: IHypermediaContainer): IKvStore[] => {
	let kvStoreArray: IKvStore[] = new Array<IKvStore>();
	console.log(inputHMs);
	/*inputHMs.members. .forEach((singleHM) => {
		let kvStoreInnerArray: IKvStore[] = singleHyperMediaToKvStores(singleHM);
		let kvStoreWrapper: IKvStore = {
			key: null,
			value: kvStoreInnerArray,
			ldType: LDDict.WrapperObject,
			intrprtrClass: null
		};
		kvStoreArray.push(kvStoreWrapper);
	});*/
	return kvStoreArray;
};
/*
export let hypermediaToKvStores = (inputHM: IHypermedia): IKvStore[] => {
	var kvIntrprtrArray: any[] = new Array<any>();
	var kvStoreArray: IKvStore[] = new Array<IKvStore>();
	//first build an Array of relevant KvStores
	for (var index = 0; index < this.intrprtdValues.length; index++) {
		var idxKey: string = this.intrprtdKeys[index];
		if (idxKey.charAt(0) === "@") {
			//look for an object interpreter with perfect fit
			if (idxKey === LDConsts.type) {
				var idxValue: any = this.intrprtdValues[index];
				var objIntrprtr: any = this.intrprtrSearchService.searchForObjIntrprtr(idxValue, 'cRud');
				if (objIntrprtr != null) {
					kvIntrprtrArray.push(objIntrprtr);
					this.interpreters.next(kvIntrprtrArray);
					this.perfectIntrprtr = objIntrprtr;
					var singleKvStore: IKvStore = {
						key: idxValue,
						value: inputWR,
						ldType: null,
						intrprtrClass: objIntrprtr
					};
					//hands down its own value, take care of recursive loops!
					//singleKvStore.value = ;
					kvStoreArray.push(singleKvStore);
					this.kvStores = kvStoreArray;
					return kvStoreArray;
				}
			}
			continue;
		}
		this.perfectIntrprtr = null;
		var curKvStore: IKvStore = {
			key: this.intrprtdKeys[index],
			value: this.intrprtdValues[index],
			ldType: null,
			intrprtrClass: null,
		};
		kvStoreArray.push(curKvStore);
		//var newKVIntrprtComp: KeyValueInterpreterComponent =
		//    new KeyValueInterpreterComponent( );
		//newKVIntrprtComp.kvObj = curKvStore
		//var newInjector : Injector
		//newInjector = ReflectiveInjector.resolveAndCreate(
		//        [ { provide: KvStore, useFactory: () => curKvStore } ]
		//);
		//        ,
		//        this.injector);
		//curKvStore.injectorClass = newInjector
	}
	//var newKVStore : KvStore = new KvStore();
	return kvStoreArray;
};
export let kvStoreToWebResource = (inputKvStore: IKvStore): IWebResource => {
	var objToWrap = inputKvStore.value;
	var wrpObj: IWebResource = objToWrap as IWebResource;
	return wrpObj;
};
*/
