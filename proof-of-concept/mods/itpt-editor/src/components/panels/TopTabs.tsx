import * as React from 'react';
import { Tabs, ITabsProps, ITabData } from 'metaexplorer-react-components';

const TABS_CLASS = 'editor-tabs'

export interface TopTabsProps {
	tabSpecs: {
		name: string;
		component: React.ReactNode;
	}[];
	className: string;
}

export const TopTabs = (props: TopTabsProps) => {
	const [selectedIdx, setSelectedIdx] = React.useState(0);

	const tabs: ITabData<string>[] = props.tabSpecs.map((spec) => ({ label: spec.name, data: spec.name }));
	const tabsProps: ITabsProps<string> = {
		className: TABS_CLASS,
		selectedIdx: selectedIdx,
		onSelectionChange: (data, idx) => setSelectedIdx(idx),
		tabs
	}
	return (
		<div className={props.className}>
			<Tabs {...tabsProps} />
			{props.tabSpecs[selectedIdx]}
		</div>
	)
}