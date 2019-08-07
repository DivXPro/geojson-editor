import React from 'react';
import MarkerEditorWrapper from '@/components/marker-editor/marker-editor-wrapper';

const initViewport = {
  bearing: 0,
  height: 0,
  latitude: 40,
  longitude: 110,
  pitch: 0,
  width: 0,
  zoom: 3
};

function MarkerEditorView(props) {
  return <MarkerEditorWrapper viewport={initViewport} />;
}

export default MarkerEditorView;
