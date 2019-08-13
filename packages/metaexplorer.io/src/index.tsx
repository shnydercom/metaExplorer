import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import * as serviceWorker from './serviceWorker';
import { AppRoot, rootSetup } from '@metaexplorer/core';
import { setupRequiredMods } from './setup/requiredMods';

rootSetup(setupRequiredMods());

ReactDOM.render(
	<AppRoot />
	, document.getElementById('app'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
