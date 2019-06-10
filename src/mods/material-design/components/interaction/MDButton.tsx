import ldBlueprint, {  } from 'ldaccess/ldBlueprint';
import { Redirect } from 'react-router';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { cleanRouteString } from 'components/routing/route-helper-fns';
import { ButtonBpCfg, AbstractButton, isIcon } from 'components/md/content/AbstractButton';
@ldBlueprint(ButtonBpCfg)
export class MDButton extends AbstractButton {
	render() {
		const { isDoRedirectConfirm, localValues } = this.state;
		const routeSendConfirm = localValues.get(VisualKeysDict.routeSend_confirm);
		let isIconVal = localValues.get(isIcon);
		isIconVal = !!isIconVal;
		if (isDoRedirectConfirm && routeSendConfirm) {
			let route: string = cleanRouteString(routeSendConfirm, this.props.routes);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirectConfirm: false });
			return <Redirect to={route} />;
		}
		return <div>MdButton</div>;
		/*if (isIconVal) {
			return <Button accent floating icon={iconUrlVal ? iconUrlVal : null} onClick={() => this.onConfirmClick()} ></Button>;
		}
		return <Button icon={iconUrlVal ? iconUrlVal : null} label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />;
		*/
	}
}
