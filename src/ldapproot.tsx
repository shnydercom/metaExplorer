import { BaseContainerRewrite } from "components/generic/baseContainer-rewrite";
import { Route } from "react-router";
import { LDRouteProps, LDOwnProps, LDConnectedDispatch, LDConnectedState } from "appstate/LDProps";
import ThemeProvider from "react-toolbox/lib/ThemeProvider";
import { appTheme } from "styles/appTheme/appTheme";
import { Component } from "react";

import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";

export interface LDApprootProps {
	initiallyDisplayedItptName: string | null;
}
export interface LDApprootState {
	hasCompletedFirstRender: boolean;
	initiallyDisplayedItptName: string;
}

export class PureLDApproot extends Component<LDApprootProps & LDConnectedState & LDConnectedDispatch & LDOwnProps, LDApprootState>  {
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
	render() {
		return <ThemeProvider theme={appTheme}>
			<div className="app-content" style={{background: "white"}}>
				<Route path="/" render={(routeProps: LDRouteProps) => {
					return <>
						<BaseContainerRewrite routes={routeProps} ldTokenString={this.props.ldTokenString} />
					</>;
				}} />
			</div>
		</ThemeProvider>;
	}
}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureLDApproot);
