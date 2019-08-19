import { Component } from "react";
import React from "react";

const CSS_CLASS_NAME = "userinfo";

export interface UserInfoProps {
	userLabel: string;
	userIconSrc: string;
	projectLabel: string;
}

export interface UserInfoState {
}

export class UserInfo extends Component<UserInfoProps, UserInfoState> {

	constructor(props: UserInfoProps) {
		super(props);
		this.state = {
		};
	}

	render() {
		let { userLabel, userIconSrc, projectLabel } = this.props;
		userIconSrc = !!userIconSrc ? userIconSrc : "";
		return (
			<div className={`${CSS_CLASS_NAME} ${CSS_CLASS_NAME}-container`}>
				<div className={`${CSS_CLASS_NAME}-textcontainer`}>
					<span className={`${CSS_CLASS_NAME}-label`}>{userLabel}</span>
					<span className={`${CSS_CLASS_NAME}-project`}>{projectLabel}</span>
				</div>
				<div className={`${CSS_CLASS_NAME}-userimagecontainer`}>
					{userIconSrc ?
						<img className={`${CSS_CLASS_NAME}-userimage`} src={userIconSrc} />
						:
						<div className={`${CSS_CLASS_NAME}-userimage`} />
					}
				</div>
			</div>
		);
	}
}
