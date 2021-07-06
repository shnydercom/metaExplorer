import * as React from 'react';
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

export interface FourOhFournomatchProps {
	routes: RouteComponentProps<{}>;
}

export class FourOhFournomatch extends Component<FourOhFournomatchProps> {

	constructor(props: FourOhFournomatchProps) {
		super(props);
	}
	render() {
		return <div>
			<h2>404</h2>
			<p>Sorry, but we didn't find anything here</p>
			<p>
				<span>Were you looking for a demo? Have a look at these two</span><br/>
				<Link to="/tinyentrepreneur">Tiny entrepreneur</Link><br/>
				<Link to="/generaldemo">a general demo</Link>
			</p>
		</div>;
	}
}
