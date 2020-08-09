import { ButtonBpCfg, AbstractButton, ldBlueprint } from '@metaexplorer/core';
import { Button } from '@material-ui/core';
import React from 'react';

export const MDButtonName: string = "metaexplorer.io/material-design/Button";
@ldBlueprint({...ButtonBpCfg,
nameSelf: MDButtonName})
export class MDButton extends AbstractButton {

	protected renderButton(isIconVal: boolean, iconUrlVal: string, confirmTxt: string) {
		if (isIconVal) {
			return <Button
				onClick={() => this.onConfirmClick()} >
				{iconUrlVal ? <img src={iconUrlVal} /> : null}
			</Button>;
		}
		return <Button
			onClick={() => this.onConfirmClick()}>
			{iconUrlVal ? <img src={iconUrlVal} /> : null}
			{confirmTxt ? confirmTxt : "confirm"}
		</Button>;
	}
}
