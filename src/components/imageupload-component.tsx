/*import * as ExplorerStore from 'appstate/store'

import * as React from 'react';

const mapStateToProps = (state: state.All, ownProps: OwnProps): ConnectedState => ({
    counter: state.counter,
    isSaving: state.isSaving,
    isLoading: state.isLoading,
    error: state.error,
})

const mapDispatchToProps = (dispatch: redux.Dispatch<state.All>): ConnectedDispatch => ({
    increment: (n: number) =>
        dispatch(incrementCounter(n)),
    load: () =>
        dispatch(loadCount()),
    save: (value: number) =>
        dispatch(saveCount({ value })),
})


class PureCounter extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}> {
    render() {
        const { counter, isSaving, isLoading, error } = this.props
        return <div>
            <div className='hero'>
                <strong>{counter.value}</strong>
            </div>
            <form>
                <button ref='increment' onClick={this._onClickIncrement}>click me!</button>
                <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
                <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{isLoading ? 'loading...' : 'load'}</button>
                {error ? <div className='error'>{error}</div> : null}
                <pre>
                    {JSON.stringify({
                        counter,
                        isSaving,
                        isLoading,
                    }, null, 2)}
                </pre>
            </form>
        </div>
    }
}


const isLoading = (p: ConnectedState & ConnectedDispatch & OwnProps) =>
    p.isLoading || p.isSaving

// Invoke `loadable` manually pending decorator support
// See: https://github.com/Microsoft/TypeScript/issues/4881
const LoadableCounter = loadable(isLoading)(PureCounter)

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8787
export const Counter = connect(mapStateToProps, mapDispatchToProps)(LoadableCounter)
*/