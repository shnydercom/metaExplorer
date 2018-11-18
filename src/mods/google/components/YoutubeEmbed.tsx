import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { Component } from "react";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from "appstate/LDProps";
import { ILDOptions } from "ldaccess/ildoptions";
import { VisualDict } from "components/visualcomposition/visualDict";
import { LDDict } from "ldaccess/LDDict";
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, initLDLocalState } from "components/generic/generatorFns";
import { isProduction } from "approot";

export const YoutubeEmbedName = "google-api/YoutubeEmbed";
let cfgIntrprtKeys: string[] =
	[VisualDict.videoId];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.videoId,
		value: undefined,
		ldType: LDDict.Text,
	},
];
const bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: YoutubeEmbedName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface YoutubeEmbedState extends LDLocalState {

}
@ldBlueprint(bpCfg)
export class PureYoutubeEmbed extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, YoutubeEmbedState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: YoutubeEmbedState): null | YoutubeEmbedState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, []);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [VisualDict.videoId]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return {
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
			[VisualDict.videoId]);
		this.state = {
			...ldState,
		};
	}
	render() {
		const { localValues } = this.state;
		let ytVideoId = localValues.get(VisualDict.videoId);
		if (!isProduction) return null;
		return <iframe width="420" height="315"
			style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "100%", borderWidth: "0px" }}
			src={"https://www.youtube.com/embed/" + ytVideoId + "?modestbranding=1&autohide=1&showinfo=0&controls=0autoplay=0&showinfo=0"}
			frameBorder={0} allowFullScreen>
		</iframe>;
	}
}
