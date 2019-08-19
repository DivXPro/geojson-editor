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

const styleCode = {
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center',
  fontSize: '42px',
  color: 'rgb(31,186,214)'
};

const appStyle = {
  height: '100%',
  display: 'flex',
  'flexDirection': 'column',
  'justifyContent': 'center',
  'alignItems': 'center'
}

function App(props) {
  return (
    <div style={appStyle}>
      <Link to="/geo_editor">
        <h1 style={styleCode}>GeoJSON Editor</h1>
      </Link>
      <span>这是一个帮大家更方便地画GeoJSON格式地图的工具，可以导入本地文件也可以导入Mapbox中的Dataset</span>
      {/* <ul>
        <li><Link to="/geo_editor">GeoJSON Editor</Link></li>
        <li><Link to="/marker_editor">Marker Editor</Link></li>
        <li><Link to="/travel">Travel</Link></li>
      </ul> */}
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
