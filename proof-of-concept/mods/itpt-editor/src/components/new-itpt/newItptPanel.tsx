import React from "react";

const NEWITPT_PANEL_CLASS = "newitpt-panel";

export interface NewItptPanelProps {}

export const NewItptPanel = (props: React.PropsWithChildren<NewItptPanelProps>) => {
	return (
		<div className={NEWITPT_PANEL_CLASS}>
			{props.children}
		</div>
	)
}