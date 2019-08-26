import React from "react";
import { IAsyncRequestWrapper } from '@metaexplorer/core';

const CSS_CLASS_NAME = "savestatus";

export const TXT_INIT = "...initialising";
export const TXT_SAVED = "saved";
export const TXT_SAVING_ERROR = "couldn't save:"

export const SaveStatus = (props: IAsyncRequestWrapper) => {
	return (
		<div className={`${CSS_CLASS_NAME} ${CSS_CLASS_NAME}-${props.status}`}>
			<span>{props.statusPayload}</span>
			{props.message ? <p>{props.message}</p> : null}
		</div>
	)
}