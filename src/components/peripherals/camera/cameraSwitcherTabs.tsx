import { Component } from 'react';

export interface CameraSwitcherTabsProps {
	activeCameraId: string;
	vidDeviceList: MediaDeviceInfo[];
	onTabChanged: (newActiveId: string) => void;
}

export class CameraSwitcherTabs extends Component<CameraSwitcherTabsProps, {}>{
	selectedImgLink: string = "/dist/static/camera_white.svg";
	unselectedImgLink: string = "/dist/static/camera_grey.svg";
	render() {
		let { vidDeviceList, activeCameraId, onTabChanged } = this.props;
		let reactComps = vidDeviceList.map((itm, idx) => {
			const isSelected: boolean = itm.deviceId === activeCameraId;
			let imgSrc: string = isSelected ? this.selectedImgLink : this.unselectedImgLink;
			return <div key={itm.deviceId} className="sub-tab"
				onClick={
					isSelected ? () => { return; } : () => { onTabChanged(itm.deviceId); }
				} >
				<img className="switcher-icon" src={imgSrc} />
			</div>;
		});
		return (
			<div className="md-camera-switcher-tabs">
				{reactComps}
			</div>
		);
	}
}
