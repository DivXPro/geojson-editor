import React from 'react';
import Styled from 'styled-components';
import JsonEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
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
  return (
    <WrapperFeatureProfile>
      {
        (props.index != null && props.index > -1 && props.feature) ?
        <JsonEditor
          value={JSON.stringify(props.feature)}
          onValueChange={props.setCurrentFeature}
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