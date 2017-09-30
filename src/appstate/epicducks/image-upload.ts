import { Action, Store } from 'redux';
import { ActionsObservable, Epic, Options } from 'redux-observable';
import { AjaxError, Observable } from 'rxjs/Rx';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { LDError, LDErrorMsgState } from './../LDError';

export const IMG_UPLOAD_REQUEST = 'shnyder/IMG_UPLOAD_REQUEST';
export const IMG_UPLOAD_RESULT = 'shnyder/IMG_UPLOAD_RESULT';
export const IMG_UPLOAD_ERROR = 'shnyder/IMG_UPLOAD_ERROR';

//Action factories
export const uploadImgAction = (fileList: FileList) => ({
    type: IMG_UPLOAD_REQUEST,
    imgUL: fileList
})

export const uploadImgResultAction = (imgULpayload: IWebResource) => ({
    type: IMG_UPLOAD_RESULT,
    imgULpayload
});

export const loadImgFailure = (message: string): LDErrorMsgState => ({
    type: IMG_UPLOAD_ERROR,
    message
})

//for the loading-indicating part of the state
export const isUploadingImgReducer = function isUploadingImg(
    state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case IMG_UPLOAD_REQUEST:
            return true
        case IMG_UPLOAD_RESULT:
        case IMG_UPLOAD_ERROR:
            return false
        default:
            return state
    }
}

export const uploadImageEpic = (action$: ActionsObservable<any>, store: any, { imgULAPI }: any) => {
    return action$.ofType(IMG_UPLOAD_REQUEST)
        .do(() => console.log("uploading image epic..."))
        .mergeMap(action =>
            imgULAPI.postNewImage(action.imgUL)
                .map((response: IWebResource) => uploadImgResultAction(response))
                .catch((error: LDError): ActionsObservable<LDErrorMsgState> =>
                    ActionsObservable.of(loadImgFailure(
                        'An error occured during image uploading: ${error.message}'
                    )))
        );
}