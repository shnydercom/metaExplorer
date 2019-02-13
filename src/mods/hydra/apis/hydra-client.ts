import HydraClient from "hydraclient.js/src/HydraClient";
import HydraClientFactory from "hydraclient.js/src/HydraClientFactory";
import { IApiDocumentation } from "hydraclient.js/src/DataModel/IApiDocumentation";
import { hydra } from "hydraclient.js/src/namespaces";
import { IWebResource } from "hydraclient.js/src/DataModel/IWebResource";
import { IHydraResource } from "hydraclient.js/src/DataModel/IHydraResource";

const hydraApiDocURL: string = "http://localhost:1111"; ///api/ysj/hydra/ApiDocumentation";

const serverURLMap: Map<string, string> = new Map();
serverURLMap.set("http://shnyder.com", "http://localhost:1111");

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
    rv.hc.getResource = async (urlOrResource) => {
      //START getUrl
      let url: any = urlOrResource;
      if (typeof url === "object") {
        url = !!url.target ? url.target.iri : url.iri;
      }
      if (!!!url) {
        throw new Error(HydraClient.noUrlProvided);
      }
      //END getUrl
      serverURLMap.forEach((val, key) => {
        if ((url as string).startsWith(key)) {
          url = (url as string).replace(key, val);
        }
      });
      const response = await fetch(url);
      if (response.status !== 200) {
        throw new Error(HydraClient.invalidResponse + response.status);
      }
      const hypermediaProcessor = rv.hc.getHypermediaProcessor(response);
      if (!hypermediaProcessor) {
        throw new Error(HydraClient.responseFormatNotSupported);
      }
      const result = await hypermediaProcessor.process(response, rv.hc);
      Object.defineProperty(result, "iri", {
        value: response.url
      });
      return result;
    };
    rv.setHydraApiDoc(hydraApiDocURL);
    return rv;
  }

  protected hc: HydraClient;

  protected apiDoc: IApiDocumentation;

  public setHydraApiDoc(hydraApiDocUrl: string) {
    this.hc.getApiDocumentation(hydraApiDocUrl).then(
      (apiDocumentation) => {
        this.apiDoc = apiDocumentation; //apiDocumentation.hypermedia.ofType(hydra.ApiDocumentation).first() as IApiDocumentation;
        let firstSupportedClass = this.apiDoc.supportedClasses.first();
        console.log(firstSupportedClass);
        let firstSupportedOperation = firstSupportedClass.supportedOperations.first();
        console.log(firstSupportedOperation);
        //console.log(firstSupportedOperation.collections);
        console.log(firstSupportedOperation.expects);
        console.log(firstSupportedOperation.operations);
        console.log(firstSupportedOperation.method);
        console.log(firstSupportedClass.description);

        this.apiDoc.getEntryPoint().then((a) => this.itptsFromWebResource(a as any));
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

  public itptsFromWebResource(wr: IWebResource) {
    console.log(wr);
    let firstCollection = wr.hypermedia.collections.first();
    console.log(firstCollection.iri);
    console.log(firstCollection.links);
    console.log(firstCollection.memberTemplate);
    console.log(firstCollection.members);
    console.log(firstCollection.operations);
    //this one:
    console.log(firstCollection["supportedOperations"]);
    console.log(firstCollection.totalItems);
    console.log(firstCollection.type);
    console.log(firstCollection.view);
    console.log(firstCollection.collections);
    console.log(firstCollection.getIterator());
  }

  public itptsFromDirectEntryPointChildren(wr: IWebResource) {

  }
}
