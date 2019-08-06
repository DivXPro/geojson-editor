import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import GeoJsonEditorWrapper from './components/geojson-editor/geojson-editor-wrapper';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import "./icons";


const initViewport = {
  bearing: 0,
  height: 0,
  latitude: 40,
  longitude: 110,
  pitch: 0,
  width: 0,
  zoom: 3
};

ReactDOM.render(
  <GeoJsonEditorWrapper viewport={initViewport} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
