import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { HydraClientAPI } from 'apis/hydra-client';

export function processAsWebResource(input) {
	var testvar = HydraClientAPI.getHCSingleton();
	//var procResource = HydraClientAPI.getHCSingleton().getHypermediaProcessor(input).process(input);
	return null; //procResource;
}
export function getHydraForURL(url: string): Promise<IWebResource> {
return fetch(url, {
	method: 'GET',
	/*headers: {
		'Content-Type': 'multipart/form-data',
		'Accept': 'application/json'
	},*/
	//body : formData
} )
	.then(( response ) => {
			if ( response.status >= 400 ) {
					throw new Error( "Bad response from server" );
			}
			// var testVar2 = response.json();
			var testVar = HydraClientAPI.getHCSingleton().getHypermediaProcessor( response );
			//var procResource = HydraClientAPI.getHCSingleton().getHypermediaProcessor( response ).process( response );
			//console.log(procResource);
			//var testVar3 = response.headers.get("Content-Type");
			return null; //procResource;
	} );
}
