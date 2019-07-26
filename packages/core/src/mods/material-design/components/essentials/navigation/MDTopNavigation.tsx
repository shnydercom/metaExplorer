import ldBlueprint from "ldaccess/ldBlueprint";
import { TopNavW5ChoicesBpCfg } from "components/essentials/navigation/AbstractNavW5Choices";
import { MDBottomNavigation } from "./MDBottomNavigation";
import { classNamesLD } from "components/reactUtils/compUtilFns";
import { Route } from "react-router";
import { BottomNavigation } from "@material-ui/core";

@ldBlueprint(TopNavW5ChoicesBpCfg)
export class MDTopNavigation extends MDBottomNavigation {
	render() {
		const { numTabs, isGenerateAtPositions, localValues, iconEnabledURLs, iconDisabledURLs, labels, routes, tabIdx } = this.state;

		let tabs = [];
		let cleanedTabIdx = tabIdx;
		for (let idx = 0; idx < numTabs; idx++) {
			const isGen = isGenerateAtPositions[idx];
			if (!isGen) {
				cleanedTabIdx++;
				continue;
			}
			let newTab = this.generateTab(
				iconEnabledURLs[idx],
				iconDisabledURLs[idx],
				routes[idx],
				cleanedTabIdx === idx,
				"t-" + idx,
				labels[idx]
			);
			tabs.push(newTab);
		}
		return <div className={classNamesLD("bottom-nav", localValues)}>
			<BottomNavigation
				value={tabIdx}
				onChange={(event, newValue) => {
					this.onTabChanged(newValue);
				}}
				showLabels
			>
				{tabs}
			</BottomNavigation>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.generateRedirect(tabIdx)}
				<Route component={this.renderInputContainer} />
				{this.props.children}
			</div>
		</div>;
	}
}
