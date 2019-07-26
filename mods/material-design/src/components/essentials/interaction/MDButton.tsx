import ldBlueprint, { } from 'ldaccess/ldBlueprint';
import { ButtonBpCfg, AbstractButton } from 'components/essentials/interaction/AbstractButton';
import { Button } from '@material-ui/core';
@ldBlueprint(ButtonBpCfg)
export class MDButton extends AbstractButton {

	protected renderButton(isIconVal: boolean, iconUrlVal: string, confirmTxt: string) {
		if (isIconVal) {
			return <Button
				accent
				floating
				icon={iconUrlVal ? iconUrlVal : null}
				onClick={() => this.onConfirmClick()} ></Button>;
		}
		return <Button
			icon={iconUrlVal ? iconUrlVal : null}
			onClick={() => this.onConfirmClick()}>{confirmTxt ? confirmTxt : "confirm"}</Button>;
	}
}
