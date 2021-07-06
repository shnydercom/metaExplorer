import {
	ldBlueprint,
	LDRetrieverSuperRewrite,
	LDServiceSchemaDict,
	SideFXDict,
	UserDefDict,
} from "@metaexplorer/core";
import { WPGraphQLAPI } from "./../apis/wpgraphql-api";
import BP_CFG, { IN_KEYS } from "./BlogPreviewRetriever-bpcfg";
import { QUERY_GET_POSTS_BY_CATEGORY } from "./QUERY_GET_POSTS_BY_CATEGORY";

@ldBlueprint(BP_CFG)
export class BlogPreviewRetriever extends LDRetrieverSuperRewrite {
	constructor(parameters) {
		super(parameters, IN_KEYS);
		const srvUrl = this.state.localValues.get(SideFXDict.srvURL);
        WPGraphQLAPI.getAPISingleton().setConfig({ uri: srvUrl });
		this.apiCallOverride = () =>
			new Promise<any>((resolve) => {
				const wpCat = this.state.localValues.get(
					LDServiceSchemaDict.WordpressCategory
				);
				const wpInstallUrl = this.state.localValues.get(
					LDServiceSchemaDict.WordpressInstallationURL
				);
				const promise = () => {
					return WPGraphQLAPI.getAPISingleton()
						.getClient()
						.query({
							query: QUERY_GET_POSTS_BY_CATEGORY,
							variables: { categoryName: wpCat },
						});
				};
				promise()
					.then((response) => {
						resolve(this.wrapOutputKv(response, wpInstallUrl));
					})
					.catch((reason) =>
						resolve(
							this.wrapOutputKv({
								status: "error",
								message: reason,
								statusPayload: "error",
							})
						)
					);
			});
		let triggerValue = this.state.localValues.get(SideFXDict.trigger);
		if (triggerValue) {
			this.state.isInputDirty = true;
			this.evalDirtyInput();
		}
	}

	protected wrapOutputKv(inputBody: any, wpInstallUrl?: string): any {
		return {
			[UserDefDict.outputData]: inputBody,
		};
	}
}
