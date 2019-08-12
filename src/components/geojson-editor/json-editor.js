import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { setFeature } from '@/store/actions/geojson-editor';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'

export default function JsonEditor() {
  const dispatch = useDispatch();
  const { index, currentLayer } = useSelector(state => ({
    index: state.selectedFeatureIndexes[0],
    currentLayer: state.layers.find(l => l.id === state.currentLayerId)
  }));

  function setCurrentFeature(data) {
    dispatch(setFeature(index, JSON.parse(data)));
  }

  return (
      (index != null && index > -1 && currentLayer) ?
      <CodeEditor
        value={JSON.stringify(currentLayer.data.features[index])}
        onValueChange={setCurrentFeature}
        highlight={data => highlight(data, languages.json)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          fontWeight: 'bolder',
          background: 'white',
          overflow: 'auto',
          minHeight: '160px',
          maxHeight: '380px',
          outline: 'none'
        }}
      /> : null
  )
}
