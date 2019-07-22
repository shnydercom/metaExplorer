import { Action } from 'redux';
import { ActionsObservable, ofType } from 'redux-observable';
import { LDError, LDErrorMsgState } from './../LDError';
import { tap, mergeMap } from 'rxjs/operators';
import { ILDWebResource } from 'ldaccess/ildresource';

export const IMG_UPLOAD_REQUEST = 'shnyder/IMG_UPLOAD_REQUEST';
export const IMG_UPLOAD_RESULT = 'shnyder/IMG_UPLOAD_RESULT';
export const IMG_UPLOAD_ERROR = 'shnyder/IMG_UPLOAD_ERROR';

//Action factories
export const uploadImgRequestAction = (fileList: FileList, targetUrl: string) => ({
    type: IMG_UPLOAD_REQUEST,
    imgUL: fileList,
    targetUrl: targetUrl
});

export const uploadImgResultAction = (imgULpayload: ILDWebResource) => ({
    type: IMG_UPLOAD_RESULT,
    imgULpayload
});

export const loadImgFailure = (message: string): LDErrorMsgState => ({
    type: IMG_UPLOAD_ERROR,
    message
});

//for the loading-indicating part of the state
export const isUploadingImgReducer = function isUploadingImg(
    state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case IMG_UPLOAD_REQUEST:
            return true;
        case IMG_UPLOAD_RESULT:
        case IMG_UPLOAD_ERROR:
            return false;
        default:
            return state;
    }
};

export const uploadImageEpic = (action$: ActionsObservable<any>, store: any, { imgULAPI }: any) => {
    return action$.pipe(
        ofType(IMG_UPLOAD_REQUEST),
        tap(() => console.log("uploading image epic...")),
        mergeMap((action) =>
            imgULAPI.postNewImage(action.imgUL, action.targetUrl)
                .map((response: ILDWebResource) => uploadImgResultAction(response))
                .catch((error: LDError): ActionsObservable<LDErrorMsgState> =>
                    ActionsObservable.of(loadImgFailure(
                        'An error occured during image uploading: ${error.message}'
                    )))
        )
    );
};
