import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import GeoEditorView from './views/geo-editor-view';
import MarkerEditorView from './views/marker-editor-view';
import * as serviceWorker from './serviceWorker';
import Travel from './stage/travel/travel';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import './icons';

function App(props) {
  return (
    <div>
      <h1>GIS Worker</h1>
      <ul>
        <li><Link to="/geo_editor">GeoJSON Editor</Link></li>
        <li><Link to="/marker_editor">Marker Editor</Link></li>
        <li><Link to="/travel">Travel</Link></li>
      </ul>
    </div>
  );
}


ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Router>
      <Route path="/" exact component={App} />
      <Route path="/geo_editor" component={GeoEditorView} />
      <Route path="/marker_editor" component={MarkerEditorView} />
      <Route path="/travel" component={Travel} />
    </Router>
  </ConfigProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
