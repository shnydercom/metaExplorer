import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDRetrieverSuperRewrite } from "sidefx/LDRetrieverSuper-rewrite";
import { IItptRetriever, ITPT_TAG_ATOMIC, ITPT_TAG_MOD } from "ldaccess/iitpt-retriever";

//import { Swagger } from 'swagger-client';

// tslint:disable-next-line:no-var-requires
//const Swagger = require('swagger-client');

const swaggerURL = "swagger/";
const swaggerLink = "http://localhost:2222/swagger.json";

export interface ISwaggerHTTPMethod {
  parameters: [{}];
  responses: [{ [responsecode: string]: {} }];
  [path: string]: {};
}

export interface ISwaggerClient {
  apis: { [tag: string]: { [operation: string]: (paramObj) => Promise<{}>; }; };
  spec: {
    definitions: {
      type: string;
      properties: {};
    };
    paths: {
      [path: string]: {
        get?: ISwaggerHTTPMethod;
        delete?: ISwaggerHTTPMethod;
        put?: ISwaggerHTTPMethod;
        options?: {};
        post?: ISwaggerHTTPMethod;
      }
    };
  };
  errors: any;
}

export interface ISwaggerItpt {
  cfg: BlueprintConfig;
  operationId: string;
  pathName: string;
  httpMethodStr: string;
}

export class SwaggerClientAPI {

  public static async getSC() {
    return (await SwaggerClientAPI.getSwaggerAPISingleton()).sc;
  }

  public static async getSwaggerAPISingleton(): Promise<SwaggerClientAPI> {
    if (SwaggerClientAPI.scSingleton == null) {
      SwaggerClientAPI.scSingleton = await SwaggerClientAPI.initSwagger();
    }
    return SwaggerClientAPI.scSingleton;
  }

  private static scSingleton: SwaggerClientAPI;
  private static async initSwagger(): Promise<SwaggerClientAPI> {
    let rv = new SwaggerClientAPI();
    const Swagger = await rv.initScriptLoad() as (arg) => void;
    rv.sc = await Swagger(swaggerLink);
    rv.itptsFromClient(rv.sc);
    // Tags interface
    //client.apis.pet.addPet({ id: 1, name: "bobby" }).then(...)

    // TryItOut Executor, with the `spec` already provided
    //client.execute({ operationId: 'addPet', parameters: { id: 1, name: "bobby")
    //});
    return rv;
  }

  protected sc: any;
  protected itptBpcfSet: Map<string, any> = new Map();

  public initScriptLoad() {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			document.body.appendChild(script);
			script.onload = resolve;
			script.onerror = reject;
			script.async = true;
			script.src = '/lib/swagger-client.js';
		});
	}

  public itptsFromClient(client: ISwaggerClient) {
    const apis = client.apis;
    const paths = client.spec.paths;
    const bpcfgs: BlueprintConfig[] = [];
    for (const pathKey in paths) {
      if (paths.hasOwnProperty(pathKey)) {
        const pathElem = paths[pathKey];
        for (const httpKey in pathElem) {
          if (pathElem.hasOwnProperty(httpKey)) {
            const httpMethodElem = pathElem[httpKey];
            const retrieverName = swaggerURL + pathKey + httpKey;
            let bpcfg: BlueprintConfig = {
              nameSelf: retrieverName,
              crudSkills: "cRud",
              subItptOf: null,
              interpretableKeys: []
            };
            bpcfgs.push(bpcfg);
          }
        }
      }
    }
    for (let idx = 0; idx < bpcfgs.length; idx++) {
      const cfg = bpcfgs[idx];
      const RetrieverItptClass = ldBlueprint(cfg)(LDRetrieverSuperRewrite);
      this.itptBpcfSet.set(cfg.nameSelf, RetrieverItptClass);
    }
  }

  public addAllItpts(retriever: IItptRetriever) {
    this.itptBpcfSet.forEach((val, key) => {
      retriever.addItpt(key, val, "cRud", [ITPT_TAG_ATOMIC]); //, ITPT_TAG_MOD]);
    });
  }
}
