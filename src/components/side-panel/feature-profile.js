import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Styled from 'styled-components';
import JsonEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { setFeature } from '@/store/actions';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'

const WrapperFeatureProfile = Styled.section`
  background: rgb(36, 39, 48);
  padding: 16px;
  min-height 480px;
  textarea {
    outline: none;
  }
`

function FeatureProfile(props) {
  const dispatch = useDispatch();
  const { index, feature } = useSelector(state => ({
    index: state.selectedFeatureIndexes[0],
    feature: JSON.stringify(state.geometry.features[state.selectedFeatureIndexes[0]]),
  }));

  function setCurrentFeature(data) {
    dispatch(setFeature(index, JSON.parse(data)));
  }

  return (
    <WrapperFeatureProfile>
      {
        (index != null && index > -1 && feature) ?
        <JsonEditor
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
      }
    </WrapperFeatureProfile>
  )
}

export default FeatureProfile;