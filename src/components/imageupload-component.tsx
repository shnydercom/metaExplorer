import { connect, Dispatch } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
//import ImgDisplay from './imagedisplay-component';
import { BlueprintConfig, OutputKVMap } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintItpt } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

//import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';
import { Component, ComponentClass, StatelessComponent } from 'react';

type OwnProps = {
};
type ConnectedState = {
};

type ConnectedDispatch = {
    fileChange: (fileList: FileList, url: string) => void;
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: Dispatch<ExplorerState>): ConnectedDispatch => ({
    fileChange: (fileList: FileList, url: string) => {
        dispatch(uploadImgRequestAction(fileList, url));
        return;
    }
});

/**
 * annotation-candidates:
 * {
 * 	forType:
 * 	"@type":"schema:CreateAction",
 * 	getInterpretableKeys:
 * 	"agent"  //:"schema:Person",
 * 	"result" //:"schema:ImageObject",
 * 	"target" //:"schema:Entrypoint"
 * initialKVStores:
 * 	"target": "'http://localhost:1111/api/ysj/media/upload';"
 * }
 */
let cfgType: string = LDDict.CreateAction;
let cfgIntrprtKeys: string[] =
    [LDDict.agent, LDDict.target];
let initialKVStores: IKvStore[] = [
    {
        key: LDDict.agent,
        value: undefined,
        ldType: undefined
    },
    {
        key: LDDict.target,
        value: 'http://localhost:1111/api/ysj/media/upload',
        ldType: LDDict.EntryPoint
    },
    {
        key: LDDict.result,
        value: undefined,
        ldType: LDDict.ImageObject
    }];
var bpCfg: BlueprintConfig = {
    subItptOf: null,
    canInterpretType: cfgType,
    nameSelf: "shnyder/imageUpload",
    //interpreterRetrieverFn: appIntprtrRetr,
    initialKvStores: initialKVStores,
    interpretableKeys: cfgIntrprtKeys,
    crudSkills: "Crud"
};

@ldBlueprint(bpCfg)
class PureImgUploader extends Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
    implements IBlueprintItpt {
    cfg: BlueprintConfig;
    outputKVMap: OutputKVMap;
    initialKvStores: IKvStore[];
    consumeLDOptions: (ldOptions: ILDOptions) => any;
    onClickFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
		/*if (!this.props.isSaving) {
			this.props.save(this.props.counter.value)
		}*/
        let fileList: FileList = (e.target as HTMLInputElement).files;
        if (fileList.length > 0) {
            var url: string = this.getStringValFromKey(LDDict.target);
            this.props.fileChange(fileList, url);
			/*this.imgULsrvc.postNewImage(fileList).then(remoteImgObj => {
				this.imgReturnWR = Observable.of<IWebResource>(remoteImgObj);
			});*/
        }
    }
    render() {
        const { fileChange } = this.props;
        return <div>
            <input type="file" onChange={(evt) => this.onClickFileChange(evt)}
                placeholder="Upload file" accept=".jpg,.png,.txt" />
            //  ImgDisplay/>
            // singleImage="" />
        </div>;
    }

    private getStringValFromKey(key: string): string {
        let kvStoreVal = this.initialKvStores;
        if (kvStoreVal != null && kvStoreVal) {
            return kvStoreVal.filter(
                (curItm) => curItm.key === key).map((val) => val.value as string).reduce(
                (a, b, idx) => idx === 0 ? b : a);
            //TODO: analyze which handling could be better, now selects first
        }
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PureImgUploader);
