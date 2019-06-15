import ldBlueprint, {  } from 'ldaccess/ldBlueprint';
import { NavProcessAtomBpCfg, AbstractNavProcessAtom } from 'components/essentials/navigation/AbstractNavProcessAtom';

@ldBlueprint(NavProcessAtomBpCfg)
export class MDNavProcessAtom extends AbstractNavProcessAtom {

	protected renderCore() {
		return <div>NavProcessAtom</div>;
		/*
<div className="bottom-nav">
			<AppBar
				title={headerText ? headerText : "cancel"}
				leftIcon="arrow_back"
				onLeftIconClick={() => this.onCancelClick()}
				className={classNamesLD(null, localValues)}
			/>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
			{isHideBottom ? null :
				<div className="bottom-nav-tabs flex-container">
					<Button className="flex-filler"
						label={cancelTxt ? cancelTxt : "cancel"} onClick={() => this.onCancelClick()} />
					<Button className="flex-filler"
						label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />
				</div>
			}
		</div>;
		*/
	}
}
