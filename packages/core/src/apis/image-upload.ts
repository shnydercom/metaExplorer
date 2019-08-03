import { LDError } from './../appstate/LDError';
import { Observable, from } from 'rxjs';
import { ILDWebResource } from 'ldaccess/ildresource';

export class ImageUploadAPI {  // URL to web api IRI resource
  postNewImage(fileList: FileList, targetUrl: string): Observable<ILDWebResource> {//Observable<IWebResource> { //FETCH
    if (targetUrl == null) {
      throw new Error(("no targetUrl defined for Image Upload"));
    }
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      let returnVal: Observable<ILDWebResource>;
      let fetchPromise = fetch(targetUrl, {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          if (response.status >= 400) {
            throw new LDError("Bad response from server");
          }
          return response.json();
          /*
          var testVar = HydraClientAPI.getHC().getHypermediaProcessor(response);
          var procResource = HydraClientAPI.getHC().getHypermediaProcessor(response).process(response, HydraClientAPI.getHC()).then((hydraResponse) => {
            console.dir(hydraResponse);
            return hydraResponse;
          });
          return procResource;*/
        });
      returnVal = from(fetchPromise);
      return returnVal;
    }
    else {
      throw new Error(("fileList for images was empty"));
    }
  }
}
