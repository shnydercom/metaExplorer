import JsonLdHypermediaProcessor from "hydraclient.js/src/JsonLd/JsonLdHypermediaProcessor";
import HydraClient from "hydraclient.js/src/HydraClient";

export class HydraClientAPI {

  public static getHCSingleton(): HydraClient {
    if (HydraClientAPI.hcSingleton == null) {
      HydraClientAPI.initHydra();
    }
    return HydraClientAPI.hcSingleton;
  }

  private static hcSingleton: HydraClient;
  private static initHydra(): void {
    //(HydraClient as any)._hypermediaProcessors.length = 0;
    HydraClient.registerHypermediaProcessor(new JsonLdHypermediaProcessor());
    HydraClientAPI.hcSingleton = new HydraClient();
  }

  constructor() {
    HydraClientAPI.getHCSingleton();
  }
}
