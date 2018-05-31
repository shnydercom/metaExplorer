import JsonLdHypermediaProcessor from "hydraclient.js/src/JsonLd/JsonLdHypermediaProcessor";
import HydraClient from "hydraclient.js/src/HydraClient";
import HydraClientFactory from "hydraclient.js/src/HydraClientFactory";
import StaticVocabularyProvider from "hydraclient.js/src/JsonLd/StaticVocabularyProvider";
import IndirectTypingProvider from "hydraclient.js/src/JsonLd/IndirectTypingProvider";
import { IVocabularyProvider } from "hydraclient.js/src/JsonLd/IVocabularyProvider";
import { IHydraClient } from "hydraclient.js/src/IHydraClient";

export class HydraClientAPI {

  public static getHCSingleton(): HydraClient {
    if (HydraClientAPI.hcSingleton == null) {
      HydraClientAPI.initHydra();
    }
    return HydraClientAPI.hcSingleton;
  }

  private static hcSingleton: HydraClient;
  private static initHydra(): void {
    /*let vocabProvider: StaticVocabularyProvider = new StaticVocabularyProvider();
    let indirectTypingProvider: IndirectTypingProvider = new IndirectTypingProvider(vocabProvider);
    //(HydraClient as any)._hypermediaProcessors.length = 0;
    var utf8jsonld = "application/ld+json;charset=UTF-8";
    var processor = new JsonLdHypermediaProcessor(indirectTypingProvider);
    var suppMediaTypes = processor.supportedMediaTypes;*/
    let factory: HydraClientFactory = new HydraClientFactory();
    HydraClientAPI.hcSingleton = factory.withDefaults().andCreate() as HydraClient;
    //HydraClient.registerHypermediaProcessor(new JsonLdHypermediaProcessor());
    //HydraClientAPI.hcSingleton = new HydraClient(processor,);
  }

  constructor() {
    HydraClientAPI.getHCSingleton();
  }
}
