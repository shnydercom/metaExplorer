import ldBlueprint from 'ldaccess/ldBlueprint';
import { LDLocalState } from 'appstate/LDProps';
import { Redirect } from 'react-router';
import { AbstractNavSearchBar, NavSearchBarBpCfg } from 'components/md/navigation/AbstractNavSearchBar';
import { cleanRouteString } from 'components/routing/route-helper-fns';

export const NavSearchBarName = "shnyder/material-design/NavSearchBar";
export interface NavSearchBarState extends LDLocalState {
	searchValue: string;
	routeSendBack: string;
	isDoRedirect: boolean;
}
@ldBlueprint(NavSearchBarBpCfg)
export class MDNavSearchBar extends AbstractNavSearchBar {

	render() {
		const { isDoRedirect, routeSendBack } = this.state;
		if (isDoRedirect) {
			let route: string = cleanRouteString(routeSendBack, this.props.routes);
			this.setState({ ...this.state, isDoRedirect: false });
			return <Redirect to={route} />;
		}
		return (
			<div>NavSearchBar Dummy</div>
			/*
			<>
				<AppBar
					className={classNamesLD(null, localValues)}
				leftIcon='arrow_back' onLeftIconClick={() => this.onBackBtnClick()} rightIcon='search'>
					<Input type='text'
						className='searchbar-input'
						label=""
						name="searchInput"
						value={searchValue}
						onChange={(evt) => this.onSearchChange(evt)} />
				</AppBar>
				{this.renderInputContainer()}
			</>
			*/
			);
	}
}
