import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GeoJsonEditor from './GeoJsonEditor';
import * as serviceWorker from './serviceWorker';
import { HotKeys } from "react-hotkeys";
import 'mapbox-gl/dist/mapbox-gl.css';

const initViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  width: 0,
  zoom: 11
};

const keyMap = {
  SHIFT_DOWN: { sequence: 'shift', action: 'keydown' },
  SHIFT_UP: { sequence: 'shift', action: 'keyup' },
  ALT_DOWN: { sequence: 'alt', action: 'keydown' },
  ALT_UP: { sequence: 'alt', action: 'keyup' },
  ENTER: 'enter',
  DEL: ['del', 'backspace']
};


ReactDOM.render(
  <HotKeys keyMap={keyMap}>
    <GeoJsonEditor viewport={initViewport} />
  </HotKeys>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
