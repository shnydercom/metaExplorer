import React from 'react';
import { render } from 'react-dom';

import { AppRoot } from 'approot';
//var test : Observable<string> = Observable.of<string>();

//if an error pops up here, check if the location of JSX.Element is something like '@types/some_module/node_modules/react
var approot: JSX.Element = <AppRoot />;
render(
	approot
	, document.getElementById('app'));
