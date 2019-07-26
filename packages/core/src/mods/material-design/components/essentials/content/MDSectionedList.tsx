import ldBlueprint from "ldaccess/ldBlueprint";
import { AbstractSectionedList, SectionedListCfg, sectionElements, sectionHeadings } from "components/essentials/content/AbstractSectionedList";
import { List, ListSubheader } from "@material-ui/core";
import { Fragment } from "react";

@ldBlueprint(SectionedListCfg)
export class MDSectionedList extends AbstractSectionedList {

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
		return <List>
			{
				listSections.map((listSection, idx) => {
					if (!listSection) return null;
					const sectHeader = (sectHeadStrngs && idx < sectHeadStrngs.length) ? sectHeadStrngs[idx] : null;
					//<Fragment> is the same as <></>, just fixes a warning about missing keys:
					return <Fragment key={"frag" + idx}>
						{sectHeader ? <ListSubheader key={"lh" + idx}>{sectHeader}</ListSubheader> : null}
						{listSection}
					</Fragment>;
				}
				)
			}
		</List>;
	}
}
