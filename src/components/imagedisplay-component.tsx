import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';

type OwnProps = {
	singleImage;
};
type ConnectedState = {
};

type ConnectedDispatch = {
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});*/

let cfgType: string = LDDict.ViewAction;
let cfgIntrprtKeys: string[] =
    [LDDict.name, LDDict.fileFormat, LDDict.contentUrl];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
		subInterpreterOf: null,
		canInterpretType: cfgType,
    nameSelf: "shnyder/imageDisplay",
    //interpreterRetrieverFn: appIntprtrRetr,
    initialKvStores: initialKVStores,
    interpretableKeys: cfgIntrprtKeys,
    crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
class PureImgDisplay extends React.Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, {}>
implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
	}
	render() {
		const { ldOptions } = this.props;
		return <div>
			<img alt="" src={ldOptions.resource.kvStores[0].value}/>
		</div>;
	}

}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureImgDisplay);
