import React from 'react';
import { BlueprintConfig, OutputKVMap } from '../ldaccess/ldBlueprint';
import { ldBlueprint, IBlueprintItpt } from '../ldaccess/ldBlueprint';
import { ILDOptions } from '../ldaccess/ildoptions';

import { IKvStore } from '../ldaccess/ikvstore';
import { LDDict } from '../ldaccess/LDDict';
import { Component } from 'react';
//import { Dispatch, Action } from 'redux';

type OwnProps = {
};
type ConnectedState = {
};

type ConnectedDispatch = {
    fileChange: (fileList: FileList, url: string) => void;
};
/*
const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>): ConnectedDispatch => ({
    fileChange: (fileList: FileList, url: string) => {
        dispatch(uploadImgRequestAction(fileList, url));
        return;
    }
});*/

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
    nameSelf: "metaexplorer.io/imageUpload",
    initialKvStores: initialKVStores,
    interpretableKeys: cfgIntrprtKeys,
    crudSkills: "Crud"
};

@ldBlueprint(bpCfg)
export class PureImgUploader extends Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
    implements IBlueprintItpt {
    cfg: BlueprintConfig;
    outputKVMap: OutputKVMap;
    initialKvStores: IKvStore[];
    consumeLDOptions: (ldOptions: ILDOptions) => any;
    onClickFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        let fileList: FileList = (e.target as HTMLInputElement).files;
        if (fileList.length > 0) {
            var url: string = this.getStringValFromKey(LDDict.target);
            this.props.fileChange(fileList, url);
        }
    }
    render() {
        return <div>
            <input type="file" onChange={(evt) => this.onClickFileChange(evt)}
                placeholder="Upload file" accept=".jpg,.png,.txt" />
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
