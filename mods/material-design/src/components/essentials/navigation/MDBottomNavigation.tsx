import { ldBlueprint, BottomNavW5ChoicesBpCfg, AbstractBottomNavigation, cleanRouteString, classNamesLD } from '@metaexplorer/core';
import { Redirect, Route } from 'react-router';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import React from 'react';

@ldBlueprint(BottomNavW5ChoicesBpCfg)
export class MDBottomNavigation extends AbstractBottomNavigation {
	generateTab(imgSrcActive, imgSrcInActive: string, route: string, isActive: boolean, key: string, label: string): JSX.Element {
		//const mustRedirect = match && isActive && (match.params.lastPath !== undefined || match.params.lastPath !== null) && match.params.lastPath !== route;
		let icon = null;
		if (imgSrcActive && imgSrcInActive) {
			if (isActive) {
				icon = <img src={imgSrcActive} style={{ height: "24px" }} />;
			} else {
				icon = <img src={imgSrcInActive} style={{ height: "24px" }} />;
			}
		}
		return <BottomNavigationAction key={key} label={label} icon={icon}/>
		/*<Tab label='' key={key} className="bottom-nav-tab" icon={isActive
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
			<div className="bottom-nav-topfree mdscrollbar">
				{tabs.length > 0 ? this.generateRedirect(tabIdx) : null}
				<Route component={this.renderInputContainer} />
				{this.props.children}
			</div>
			<BottomNavigation
				value={tabIdx}
				onChange={(event, newValue) => {
					this.onTabChanged(newValue);
				}}
				showLabels
			>
				{tabs}
			</BottomNavigation>
		</div>;
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
