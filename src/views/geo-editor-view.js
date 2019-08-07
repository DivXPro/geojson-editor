import React from 'react';
import GeoJsonEditorWrapper from '../components/geojson-editor/geojson-editor-wrapper';

const initViewport = {
  bearing: 0,
  height: 0,
  latitude: 40,
  longitude: 110,
  pitch: 0,
  width: 0,
  zoom: 3
};

function GeoEditorView(props) {
  return <GeoJsonEditorWrapper viewport={initViewport} />;
}

export default GeoEditorView;
