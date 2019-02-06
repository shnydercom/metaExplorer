import HydraClient from "hydraclient.js/src/HydraClient";
import HydraClientFactory from "hydraclient.js/src/HydraClientFactory";
import { IApiDocumentation } from "hydraclient.js/src/DataModel/IApiDocumentation";
import { hydra } from "hydraclient.js/src/namespaces";

const hydraApiDocURL: string = "http://localhost:1111/api/ysj/hydra/ApiDocumentation";
export class HydraClientAPI {

  public static getHC() {
    return HydraClientAPI.getHydraAPISingleton().hc;
  }

  public static getHydraAPISingleton(): HydraClientAPI {
    if (HydraClientAPI.hcSingleton == null) {
      HydraClientAPI.hcSingleton = HydraClientAPI.initHydra();
    }
    return HydraClientAPI.hcSingleton;
  }

  private static hcSingleton: HydraClientAPI;
  private static initHydra(): HydraClientAPI {
    let rv: HydraClientAPI = new HydraClientAPI();
    let factory: HydraClientFactory = new HydraClientFactory();
    rv.hc = factory.withDefaults().andCreate() as HydraClient;
    rv.setHydraApiDoc(hydraApiDocURL);
    return rv;
  }

  protected hc: HydraClient;

  protected apiDoc: IApiDocumentation;

  public setHydraApiDoc(hydraApiDocUrl: string) {
    this.hc.getResource(hydraApiDocUrl).then(
      (apiDocumentation) => {
        this.apiDoc = apiDocumentation.hypermedia.ofType(hydra.ApiDocumentation).first() as IApiDocumentation;

        /*
        getting ApiDocumentation over a link from the server's root doesn't work currently, uncommented:
      this.hc.getApiDocumentation(hydraApiDocUrl).then((apiDocumentation) => {
       this.apiDoc = apiDocumentation;*/
        console.log("hydra getApiDocumentation was successful:");
        console.dir(this.apiDoc);
      }).catch((reason) => {
        console.log("hydra getApiDocumentation was rejected:");
        console.dir(reason);
      });
  }
}
