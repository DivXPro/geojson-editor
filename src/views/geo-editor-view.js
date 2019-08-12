import React from 'react';
import GeoJsonEditorWrapper from '../components/geojson-editor/geojson-editor-wrapper';

const initViewport = {
  bearing: 0,
  height: 0,
  latitude: 30.901,
  longitude: 121.936,
  pitch: 0,
  width: 0,
  zoom: 14
};

function GeoEditorView(props) {
  return <GeoJsonEditorWrapper viewport={initViewport} />;
}

export default GeoEditorView;
