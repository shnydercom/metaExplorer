import {IWebResource} from 'hydraclient.js/src/DataModel/IWebResource';
import { HydraClientAPI } from './hydra-client';
import {LDError } from './../appstate/LDError'

export class ImageUploadAPI{
    private resrcEndpoint : string =  'http://localhost:1111/rest/ysj/media/upload';  // URL to web api IRI resource
    postNewImage(fileList: FileList): Promise<IWebResource> {//Observable<IWebResource> { //FETCH
        if (fileList.length > 0) {
          let file: File = fileList[0];
          let formData: FormData = new FormData();
          formData.append('file', file, file.name);
          
        return fetch(this.resrcEndpoint, {
          method: 'POST',
          body : formData
        })
          .then((response) => {
            if (response.status >= 400) {
              throw new LDError("Bad response from server");
            }
            var testVar = HydraClientAPI.getHCSingleton().getHypermediaProcessor(response);
            var procResource = HydraClientAPI.getHCSingleton().getHypermediaProcessor(response).process(response);  
            return procResource;
          });
         }
      }
}