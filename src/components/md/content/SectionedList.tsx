import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';

import { initLDLocalState, getDerivedKVStateFromProps, generateItptFromCompInfo, getDerivedItptStateFromProps } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent, Fragment } from 'react';
import { List, ListSubHeader } from 'react-toolbox/lib/list';
import { LDDict } from 'ldaccess/LDDict';
import { UserDefDict } from 'ldaccess/UserDefDict';

export const SectionedListName = "shnyder/md/SectionedList";
const sectionHeadings = "section-headings";
const sectionElements = "section-elements";

let sectionedListItptKeys: string[] = [sectionElements];
let sectionedListValueKeys: string[] = [sectionHeadings];
let sectionedListInputKeys: string[] = [...sectionedListValueKeys, ...sectionedListItptKeys];
let initialKVStores: IKvStore[] = [
	{ key: sectionHeadings, value: undefined, ldType: LDDict.Text },
	{ key: sectionElements, value: undefined, ldType: UserDefDict.intrprtrClassType }
];
export const SectionedListCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: SectionedListName,
	initialKvStores: initialKVStores,
	interpretableKeys: sectionedListInputKeys,
	crudSkills: "cRud"
};
export interface SectionedListState extends LDLocalState {
}

@ldBlueprint(SectionedListCfg)
export class PureSectionedList extends Component<LDConnectedState
& LDConnectedDispatch & LDOwnProps, SectionedListState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SectionedListState): null | SectionedListState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, sectionedListItptKeys, [true]);
		let rvLocal = getDerivedKVStateFromProps(nextProps, prevState, sectionedListValueKeys, [true]);
		if (!rvLocal && !rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return { ...prevState, ...rvNew };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, sectionedListItptKeys, sectionedListValueKeys, [true], [true]);
		this.state = { ...ldState };
	}
	render() {
		const { localValues, compInfos } = this.state;
		let sectHeadStrngs: string[] | null = localValues.get(sectionHeadings);
		if (sectHeadStrngs && !Array.isArray(sectHeadStrngs)) {
			sectHeadStrngs = [sectHeadStrngs];
		}
		const sectionElems = compInfos.get(sectionElements);
		if (!sectionElems) return null;
		const { routes } = this.props;
		let listSections = [];
		if (Array.isArray(sectionElems)) {
			sectionElems.forEach((elem, displayIdx) => {
				listSections.push(this.renderSub(sectionElements, routes, displayIdx));
			}
			);
		} else {
			listSections.push(this.renderSub(sectionElements, routes));
		}

		return <List selectable ripple>
			{
				listSections.map((listSection, idx) => {
					if (!listSection) return null;
					const sectHeader = (sectHeadStrngs && idx < sectHeadStrngs.length) ? sectHeadStrngs[idx] : null;
					//<Fragment> is the same as <></>, just fixes a warning about missing keys:
					return <Fragment key={"frag" + idx}>
						{sectHeader ? <ListSubHeader key={"lh" + idx} caption={sectHeader} /> : null}
						{listSection}
					</Fragment>;
				}
				)
			}
		</List>;
	}
}
