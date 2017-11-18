/*import * as ExplorerStore from 'appstate/store'

import * as React from 'react';

const mapStateToProps = (state: state.All, ownProps: OwnProps): ConnectedState => ({
    counter: state.counter,
    isSaving: state.isSaving,
    isLoading: state.isLoading,
    error: state.error,
})

const mapDispatchToProps = (dispatch: redux.Dispatch<state.All>): ConnectedDispatch => ({
    increment: (n: number) =>
        dispatch(incrementCounter(n)),
    load: () =>
        dispatch(loadCount()),
    save: (value: number) =>
        dispatch(saveCount({ value })),
})

class PureCounter extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}> {
    render() {
        const { counter, isSaving, isLoading, error } = this.props
        return <div>
            <div className='hero'>
                <strong>{counter.value}</strong>
            </div>
            <form>
                <button ref='increment' onClick={this._onClickIncrement}>click me!</button>
                <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
                <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{isLoading ? 'loading...' : 'load'}</button>
                {error ? <div className='error'>{error}</div> : null}
                <pre>
                    {JSON.stringify({
                        counter,
                        isSaving,
                        isLoading,
                    }, null, 2)}
                </pre>
            </form>
        </div>
    }
}

const isLoading = (p: ConnectedState & ConnectedDispatch & OwnProps) =>
    p.isLoading || p.isSaving

// Invoke `loadable` manually pending decorator support
// See: https://github.com/Microsoft/TypeScript/issues/4881
const LoadableCounter = loadable(isLoading)(PureCounter)

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8787
export const Counter = connect(mapStateToProps, mapDispatchToProps)(LoadableCounter)
*/

import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import ImgDisplay from './imagedisplay-component';
import { BlueprintConfig } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';

type OwnProps = {
};
type ConnectedState = {
};

type ConnectedDispatch = {
    fileChange: (fileList: FileList, url: string) => void;
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
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
 * 	"target": "'http://localhost:1111/rest/ysj/media/upload';"
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
        value: 'http://localhost:1111/rest/ysj/media/upload',
        ldType: LDDict.EntryPoint
    },
    {
        key: LDDict.result,
        value: undefined,
        ldType: LDDict.ImageObject
    }];
var bpCfg: BlueprintConfig = {
    //consumeWebResource: (ldOptions: ILDOptions) => { return; },
    forType: cfgType,
    nameSelf: "shnyder/imageUpload",
    interpreterRetrieverFn: appIntprtrRetr,
    initialKvStores: initialKVStores,
    getInterpretableKeys: () => cfgIntrprtKeys,
    crudSkills: "Crud"
};

@ldBlueprint(bpCfg)
class PureImgUploader extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
    implements IBlueprintInterpreter {
    cfg: BlueprintConfig;
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
            <ImgDisplay singleImage="" />
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
