import { ApolloClient, InMemoryCache } from "@apollo/client";

export class WPGraphQLAPI {
	private static apiSingleton: WPGraphQLAPI;
	private apiClient: ApolloClient<InMemoryCache>;

	public static getClient(): ApolloClient<InMemoryCache> {
		return WPGraphQLAPI.getAPISingleton().apiClient;
	}

	public static getAPISingleton(cfgSrc?: string): WPGraphQLAPI {
		if (WPGraphQLAPI.apiSingleton == null) {
			WPGraphQLAPI.apiSingleton = WPGraphQLAPI.init(cfgSrc);
		}
		return WPGraphQLAPI.apiSingleton;
	}

	public static isInitialized(): boolean {
		return !!WPGraphQLAPI.apiSingleton;
	}

	private static init(cfgSrc?: string): WPGraphQLAPI {
        const rv = new WPGraphQLAPI();
        return rv;
    }
}
