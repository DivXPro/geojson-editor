import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import GeoJsonEditor from './components/geojson-editor';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import "./icons";


const initViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  width: 0,
  zoom: 11
};

ReactDOM.render(
  <GeoJsonEditor viewport={initViewport} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
