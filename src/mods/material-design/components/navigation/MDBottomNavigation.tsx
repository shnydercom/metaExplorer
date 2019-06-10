import ldBlueprint, { } from 'ldaccess/ldBlueprint';
import { Redirect } from 'react-router';
import { BottomNavW5ChoicesBpCfg, AbstractBottomNavigation, TopNavW5ChoicesBpCfg } from 'components/md/navigation/AbstractNavW5Choices';
import { cleanRouteString } from 'components/routing/route-helper-fns';

@ldBlueprint(BottomNavW5ChoicesBpCfg)
export class MDBottomNavigation extends AbstractBottomNavigation {
	generateTab(): JSX.Element {
		//const mustRedirect = match && isActive && (match.params.lastPath !== undefined || match.params.lastPath !== null) && match.params.lastPath !== route;
		return <div>this is a Tab</div>; /*<Tab label='' key={key} className="bottom-nav-tab" icon={isActive
			? <img src={imgSrcActive} style={{ height: "inherit" }} />
			: <img src={imgSrcInActive} style={{ height: "inherit" }} />}>
		</Tab>;*/
	}
	generateRedirect(tabIdx: number): JSX.Element {
		if (!this.props.routes || !this.state.hasTabChanged) return null;
		const { location } = this.props.routes;
		let cleanedTabIdx: number = tabIdx;
		for (let idx = tabIdx; idx >= 0; idx--) {
			if (!this.state.isGenerateAtPositions[idx]) {
				cleanedTabIdx++;
			}
		}
		let route: string = this.state.routes[cleanedTabIdx];
		//if (match.params.nextPath === undefined) match.params.nextPath = route;
		let newPath: string = cleanRouteString(route, this.props.routes);
		this.setState({ ...this.state, hasTabChanged: false });
		if (location.pathname === newPath) return null;
		return <Redirect to={newPath} />;
	}

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
		return <div>BottomNav</div>;
		/*
		<div className={classNamesLD("bottom-nav", localValues)}>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.generateRedirect(tabIdx)}
				<Route component={this.renderInputContainer} />
				{this.props.children}
			</div>
			<Tabs index={tabIdx} onChange={this.onTabChanged} fixed className="bottom-nav-tabs">
				{tabs}
			</Tabs>
		</div>;
		*/
	}
}
