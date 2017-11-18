import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

type OwnProps = {
	singleImage;
};
type ConnectedState = {
};

type ConnectedDispatch = {
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});

let cfgType: string = LDDict.ViewAction;
let cfgIntrprtKeys: string[] =
    [LDDict.name, LDDict.fileFormat, LDDict.contentUrl];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
    //consumeWebResource: (ldOptions: ILDOptions) => { return; },
    forType: cfgType,
    nameSelf: "shnyder/imageDisplay",
    interpreterRetrieverFn: appIntprtrRetr,
    initialKvStores: initialKVStores,
    getInterpretableKeys() { return cfgIntrprtKeys; },
    crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
class PureImgDisplay extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
	}
	render() {
		const { singleImage } = this.props;
		return <div>
			<img alt="" src={singleImage}/>
		</div>;
	}

}
export default connect(mapStateToProps, mapDispatchToProps)(PureImgDisplay);
