import * as React from 'react';
import { IITPTNameObj } from '../new-itpt/newItptNodeDummy';

const CSS_CLASSNAME = "itpt-summary";

const TXT_USER = "User";
const TXT_PROJECT = "Project";
const TXT_BLOCK = "Block";

export const ITPTSummary = (props: IITPTNameObj) => {
	return <div className={CSS_CLASSNAME}>
		<span className="subheading">{TXT_USER}</span>
		<span className="info-itm">{props.userName}</span>
		<span className="subheading">{TXT_PROJECT}</span>
		<span className="info-itm">{props.projectName}</span>
		<span className="subheading">{TXT_BLOCK}</span>
		<span className="info-itm">{props.blockName}</span>
	</div>
}