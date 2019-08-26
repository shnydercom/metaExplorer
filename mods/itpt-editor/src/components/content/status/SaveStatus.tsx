import React from "react";

const CSS_CLASS_NAME = "savestatus";

export const TXT_INIT = "...initialising";
export const TXT_SAVED = "saved";
export const TXT_SAVING_ERROR = "couldn't save:"

export interface ISaveStatusProps {
	statusTxt: string;
	message?: string;
	status: 'ok' | 'error' | 'warning';
}

export const SaveStatus = (props: ISaveStatusProps) => {
	return (
		<div className={`${CSS_CLASS_NAME} ${CSS_CLASS_NAME}-${props.status}`}>
			<span>{props.statusTxt}</span>
			{props.message ? <p>{props.message}</p> : null}
		</div>
	)
}