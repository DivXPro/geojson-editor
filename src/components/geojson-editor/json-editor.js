import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { setFeature } from '@/store/actions';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'

export default function JsonEditor() {
  const dispatch = useDispatch();
  const { index, feature } = useSelector(state => ({
    index: state.selectedFeatureIndexes[0],
    feature: JSON.stringify(state.geometry.features[state.selectedFeatureIndexes[0]]),
  }));

  function setCurrentFeature(data) {
    dispatch(setFeature(index, JSON.parse(data)));
  }

  return (
      (index != null && index > -1 && feature) ?
      <CodeEditor
        value={feature}
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
      /> : <div></div>
  )
}
