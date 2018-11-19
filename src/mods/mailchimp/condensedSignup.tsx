import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { Component } from "react";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from "appstate/LDProps";
import { ILDOptions } from "ldaccess/ildoptions";
import { LDDict } from "ldaccess/LDDict";
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, initLDLocalState } from "components/generic/generatorFns";
import { VisualDict } from "components/visualcomposition/visualDict";
import { isProduction } from "approot";

export const MailChimpSignupName = "mailchimp/condensedSignup";
let cfgIntrprtKeys: string[] =
	[LDDict.embedUrl, VisualDict.headerTxt];
let initialKVStores: IKvStore[] = [
	{
		key: LDDict.embedUrl,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: VisualDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
];
const bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MailChimpSignupName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface MailChimpSignupState extends LDLocalState {
	emailInputContent: string;
}
@ldBlueprint(bpCfg)
export class PureMailChimpSignup extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, MailChimpSignupState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: MailChimpSignupState): null | MailChimpSignupState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, []);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [LDDict.embedUrl, VisualDict.headerTxt]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return {
			...prevState,
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	styleClassName: string;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props,
			[],
			[LDDict.embedUrl, VisualDict.headerTxt]);
		this.state = {
			emailInputContent: "",
			...ldState,
		};
	}
	render() {
		const { localValues, emailInputContent } = this.state;
		let embedUrl = localValues.get(LDDict.embedUrl);
		let subscribeText = localValues.get(VisualDict.headerTxt);
		if (!isProduction) return null;
		return <div id="mc_embed_signup">
			<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"></link>
			<form action={embedUrl} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
				<div id="mc_embed_signup_scroll">
					<label htmlFor="mce-EMAIL">{subscribeText}</label>
					<input type="email" value={emailInputContent} name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required onChange={
						(e) => this.setState({ ...this.state, emailInputContent: e.target.value })
					} />
					<div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
						<input type="text" name="b_fabde687110079f0e86910e15_62f594e155" tabIndex={-1} defaultValue={emailInputContent} readOnly />
					</div>
					<div className="clear">
						<input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
					</div>
				</div>
			</form>
		</div>;
	}
}
