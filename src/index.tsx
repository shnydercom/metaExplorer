import React from 'react'
import {render} from 'react-dom'
import {Observable} from 'rxjs';
import EntryPointDesignerContainer from 'components/entrypointdesigner-container'
//import { DiagramEngine } from 'storm-react-diagrams'
import './styles/styles.scss';

const App = () => {
  return (
    <div>
      <p>Hello wwworld!</p>
      <EntryPointDesignerContainer/>
    </div>
  )
}

var test : Observable<string> = Observable.of<string>();
console.log("this will be run at the start" );
console.dir(test);
console.dir(React);
console.dir(render);
console.log(React);
console.log(render);

render(<App />, document.getElementById('app'))