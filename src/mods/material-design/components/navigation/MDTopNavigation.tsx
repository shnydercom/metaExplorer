import ldBlueprint from "ldaccess/ldBlueprint";
import { TopNavW5ChoicesBpCfg } from "components/md/navigation/AbstractNavW5Choices";
import { MDBottomNavigation } from "./MDBottomNavigation";

@ldBlueprint(TopNavW5ChoicesBpCfg)
export class MDTopNavigation extends MDBottomNavigation {
	render() {
		const { numTabs, isGenerateAtPositions, iconEnabledURLs, iconDisabledURLs, routes, tabIdx } = this.state;

		let tabs = [];
		let cleanedTabIdx = tabIdx;
		for (let idx = 0; idx < numTabs; idx++) {
			const isGen = isGenerateAtPositions[idx];
			if (!isGen) {
				cleanedTabIdx++;
				continue;
			}
			let newTab = this.generateTab(
				);
			tabs.push(newTab);
		}
		return <div>TopNav</div>;
		/*<div className="top-nav">
			<Tabs index={tabIdx} onChange={this.onTabChanged} fixed className={classNamesLD("top-nav-tabs", localValues)}>
				{tabs}
			</Tabs>
			<div className="mdscrollbar top-nav-bottomfree">
				{this.generateRedirect(tabIdx)}
				<Route component={this.renderInputContainer} />
				{this.props.children}
			</div>
		</div>;*/
	}
}
