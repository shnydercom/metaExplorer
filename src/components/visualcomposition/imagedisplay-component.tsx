import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, initLDLocalState } from '../generic/generatorFns';

let cfgType: string = LDDict.ViewAction;
let cfgIntrprtKeys: string[] =
	[LDDict.name, LDDict.fileFormat, LDDict.contentUrl];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: "shnyder/imageDisplay",
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureImgDisplay extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: LDLocalState): null | LDLocalState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, []);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [LDDict.name, LDDict.fileFormat, LDDict.contentUrl]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return {...rvNew};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	consumeLDOptions: (ldOptions: ILDOptions) => any;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = initLDLocalState(this.cfg, props, [], [LDDict.name, LDDict.fileFormat, LDDict.contentUrl]);
	}

	render() {
		const { ldOptions } = this.props;
		let imgLnk: string = this.state.localValues.get(LDDict.contentUrl);
		if (imgLnk
			&& !imgLnk.startsWith("http://")
			&& !imgLnk.startsWith("blob:http://")
			&& !imgLnk.startsWith("/")) {
			imgLnk = "http://localhost:1111/api/ysj/media/jpgs/" + imgLnk;
		}
		if (!ldOptions) return <div>no Image data</div>;
		return <div className="imgdisplay">
			<img alt="" src={imgLnk} className="imgdisplay" />
			{imgLnk}
			{this.props.children}
		</div>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureImgDisplay);
