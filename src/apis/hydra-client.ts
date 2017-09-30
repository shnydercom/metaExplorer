import JsonLdHypermediaProcessor from "hydraclient.js/src/DataModel/JsonLd/JsonLdHypermediaProcessor";
import HydraClient from "hydraclient.js/src/HydraClient";

export class HydraClientAPI {
  private static hcSingleton: HydraClient;
  
  public static getHCSingleton() : HydraClient {
    if (HydraClientAPI.hcSingleton == null) {
        HydraClientAPI.initHydra();
    }
    return HydraClientAPI.hcSingleton; 
  }
  
  constructor() {
    HydraClientAPI.getHCSingleton();
  }
  
  private static initHydra(): void {
    (<any>HydraClient)._hypermediaProcessors.length = 0;
    HydraClient.registerHypermediaProcessor(new JsonLdHypermediaProcessor());
    HydraClientAPI.hcSingleton = new HydraClient();
  }
}
