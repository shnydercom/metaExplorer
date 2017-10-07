import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';

type OwnProps = {
	singleImage;
};
type ConnectedState = {
};

type ConnectedDispatch = {
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});

class PureImgDisplay extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>{
	render() {
		const { singleImage } = this.props;
		return <div>
			<img alt="" src={singleImage}/>
		</div>;
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(PureImgDisplay);
