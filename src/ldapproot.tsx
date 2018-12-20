import { BaseContainerRewrite } from "components/generic/baseContainer-rewrite";
import { Route } from "react-router";
import { LDRouteProps, LDOwnProps, LDConnectedDispatch, LDConnectedState } from "appstate/LDProps";
import ThemeProvider from "react-toolbox/lib/ThemeProvider";
import { appTheme } from "styles/appTheme/appTheme";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { AIDProps } from "components/itpt-designer/appitpt-designer";
import { Component } from "react";
import { addBlueprintToRetriever, intrprtrTypeInstanceFromBlueprint } from "appconfig/retrieverAccessFns";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";

//demo
/*
import * as threeIconBottomBar from '../demos/three-icon-bottombar.json';
import * as fourIconBottomBar from '../demos/four-icon-bottombar.json';
import * as testImage from '../demos/test-image.json';
import * as chartsImage from '../demos/charts-image.json';
import * as singleChoiceGame from '../demos/single-choice-game.json';
import * as actionPanel from '../demos/actionpanel.json';
import * as usersPanel from '../demos/users-panel.json';

import * as popoverCard from '../demos/popover-card.json';
import * as barcodeScanPanel from '../demos/camerascanpanel.json';
import * as expenseFormPanel from '../demos/expense-form-panel.json';
import * as bookingFormPanel from '../demos/booking-form-panel.json';

import * as bookingBuyFlight from '../demos/booking-flight-summary.json';
import * as bookingBuyTrain from '../demos/booking-train-summary.json';
import * as bookingBuyBus from '../demos/booking-bus-summary.json';

import * as bookingSelectionTrain from '../demos/booking-sel-train.json';
import * as bookingSelectionFlight from '../demos/booking-sel-flight.json';
import * as bookingSelectionBus from '../demos/booking-sel-bus.json';
import * as bookingSelectionPanel from '../demos/booking-selection-panel.json';
import * as timetrackingPanel from '../demos/timetracking-form-panel.json';
import * as mainScreen from '../demos/main-screen.json';
import * as gameScreen from '../demos/game-screen.json';
import * as searchScreen from '../demos/search-screen.json';
import * as expenseScreen from '../demos/expense-screen.json';
import * as timeTrackingScreen from '../demos/timetracking-screen.json';
import * as bookingScreen from '../demos/booking-screen.json';
import * as appMain from '../demos/app-main.json';
import * as routehowto from '../demos/route-howto.json';
import * as htmlhowto from '../demos/html-howto.json';
import * as parisTrain from '../demos/img-paris-train.json';
import * as londonBus from '../demos/img-london-bus.json';
import * as planeLanding from '../demos/img-plane-landing.json';
import * as shnyderlogo from '../demos/img-shnyderlogo.json';
import * as shnyderlogoOnWhite from '../demos/img-shnyderlogo-on-white.json';

import * as aToBtravels from '../demos/img-a-to-b-travels.json';*/
/*
import * as gsheetsTester from '../demos/gsheets-tester.json';

import * as shnyderWebsiteEditorBtn from '../demos/shnyder-website/goto-editor-btn.json';
import * as shnyderWebsiteGallery from '../demos/shnyder-website/welcome-gallery.json';
import * as languageSelection from '../demos/shnyder-website/language-selection.json';
import * as shnyderWebsiteContent from '../demos/shnyder-website/main-content.json';
import * as shnyderWebsiteMain from '../demos/shnyder-website/main-page.json';
import * as imgWebsiteNode from '../demos/img-website-node.json';

import * as englishActivities from '../demos/video/englishactivities.json';
import * as chineseActivities from '../demos/video/chineseactivities.json';
import * as imgBerlin from '../demos/video/img-berlin.json';
import * as overview from '../demos/video/overview.json';*/

import { itptLoadApi } from "appstate/store";

import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { DemoCompleteReceiver } from "approot";
import appItptRetrFn from "appconfig/appItptRetriever";
import { LDError } from "appstate/LDError";

export interface LDApprootProps {
	initiallyDisplayedItptName: string | null;
}
export interface LDApprootState {
	hasCompletedFirstRender: boolean;
	initiallyDisplayedItptName: string;
}

export class PureLDApproot extends Component<LDApprootProps & LDConnectedState & LDConnectedDispatch & LDOwnProps & DemoCompleteReceiver, LDApprootState>  {
	public static APP_KEY = "app";
	constructor(props?: any) {
		super(props);
		const { initiallyDisplayedItptName } = this.props;
		this.state = { initiallyDisplayedItptName, hasCompletedFirstRender: false };
	}
	componentDidMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}
	componentDidUpdate(prevProps: AIDProps & LDConnectedState & LDConnectedDispatch & LDOwnProps & DemoCompleteReceiver) {
		if (!this.state.hasCompletedFirstRender && prevProps.isInitDemo) {
			//generate demos for compound itpts
			/*let prefilledData: any[] = [
				planeLanding, parisTrain, londonBus, aToBtravels, shnyderlogo, shnyderlogoOnWhite,
				fourIconBottomBar, threeIconBottomBar, testImage, chartsImage, singleChoiceGame, popoverCard,
				actionPanel, barcodeScanPanel, usersPanel, expenseFormPanel, timetrackingPanel, bookingFormPanel, bookingSelectionPanel,
				bookingSelectionFlight, bookingSelectionTrain, bookingSelectionBus,
				bookingBuyFlight, bookingBuyTrain, bookingBuyBus,
				mainScreen, searchScreen, expenseScreen, gameScreen, timeTrackingScreen, bookingScreen,
				routehowto, htmlhowto, appMain,

				englishActivities, chineseActivities, imgBerlin, overview,

				gsheetsTester,
				imgWebsiteNode,
				shnyderWebsiteEditorBtn,
				shnyderWebsiteGallery,
				languageSelection,
				shnyderWebsiteContent,
				shnyderWebsiteMain
			];
			for (let i = 0; i < prefilledData.length; i++) {
				this.generatePrefilled(prefilledData[i]);
			}*/
			itptLoadApi.getItptsForCurrentUser()().then((val) => {
				let numItpts = val.itptList.length;
				val.itptList.forEach((itpt) => {
					addBlueprintToRetriever(itpt);
				});
				if (numItpts > 0) {
					//this.generatePrefilled(val.itptList[numItpts - 1]);
					let newItpt = appItptRetrFn().getItptByNameSelf(this.state.initiallyDisplayedItptName);
					if (!newItpt) throw new LDError("error in interpreterAPI: could not find " + this.state.initiallyDisplayedItptName);
					let newItptCfg = newItpt.cfg as BlueprintConfig;
					let newType = newItptCfg.canInterpretType;
					let dummyInstance = intrprtrTypeInstanceFromBlueprint(newItptCfg);
					let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
					newLDOptions.resource.kvStores = [
						{ key: PureLDApproot.APP_KEY, ldType: newType, value: dummyInstance }
					];
					this.props.notifyLDOptionsChange(newLDOptions);
				}
				this.setState({ ...this.state, hasCompletedFirstRender: true });
				this.props.notifyDemoComplete();
			}).catch((reason) => {
				console.log(reason);
			});
		}
	}
	/*generatePrefilled = (input: any) => {
		let nodesBPCFG: BlueprintConfig = input as BlueprintConfig;
		let dummyInstance = intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		addBlueprintToRetriever(nodesBPCFG);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: PureLDApproot.APP_KEY, ldType: newType, value: dummyInstance }
		];
		this.props.notifyLDOptionsChange(newLDOptions);
	}*/
	render() {
		return <ThemeProvider theme={appTheme}>
			<div className="app-content">
				<Route path="/" render={(routeProps: LDRouteProps) => {
					return <>
						<BaseContainerRewrite routes={routeProps} ldTokenString={this.props.ldTokenString} />
					</>;
				}} />
			</div>
		</ThemeProvider>;
	}
}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps & DemoCompleteReceiver>(mapStateToProps, mapDispatchToProps)(PureLDApproot);
