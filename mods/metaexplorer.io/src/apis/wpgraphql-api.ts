import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
	HttpLink,
} from "@apollo/client";

export interface WPGraphQLAPIOptions {
	uri: string;
}

export class WPGraphQLAPI {
	private static apiSingleton: WPGraphQLAPI;
	private apiClient: ApolloClient<NormalizedCacheObject>;

	public static getAPISingleton(cfg?: WPGraphQLAPIOptions): WPGraphQLAPI {
		if (WPGraphQLAPI.apiSingleton == null) {
			WPGraphQLAPI.apiSingleton = WPGraphQLAPI.init(cfg);
		}
		return WPGraphQLAPI.apiSingleton;
	}

	public static isInitialized(): boolean {
		return !!WPGraphQLAPI.apiSingleton;
	}

	private static init(cfg?: WPGraphQLAPIOptions): WPGraphQLAPI {
		const rv = new WPGraphQLAPI();
		rv.apiClient = new ApolloClient({
			//graphql endpoint
			link: new HttpLink({ uri: cfg && cfg.uri ? cfg.uri : "/graphql" }),
			cache: new InMemoryCache(),
			/*fetchOptions: {
              mode: 'no-cors'
            }*/
		});
		return rv;
    }
    
    public getClient(): ApolloClient<NormalizedCacheObject> {
		return this.apiClient;
	}

	// class methods

	public setConfig(cfg: WPGraphQLAPIOptions): void {
		if (cfg) {
			this.apiClient.setLink(
				new HttpLink({ uri: cfg.uri ? cfg.uri : "/graphql" })
			);
		}
	}
}
