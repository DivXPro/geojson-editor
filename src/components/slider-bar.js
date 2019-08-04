import React from 'react';
import styled from 'styled-components';
import JsonEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'


const StyledSliderBar = styled.div`
  position: absolute;
  z-index: 1000;
  width: 300px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  transition: left 250ms ease 0s, right 250ms ease 0s;
  background: white;
  top: 40px;
  right: 20px;
  >h3 {
    text-align: center;
  }
`;

const StyledcodeEditorContainer = styled.div`
  background-color: #c6d2e1 !important;
  padding: 10px;
`


function SliderBar (props) {
  function handleChange(data) {
    try {
      JSON.parse(data);
      props.setCurrentGeoJson(data, props.index);
    } catch (error) {
      console.log('error', error); 
    }
  }

  return <StyledSliderBar>
    <h3>GeoJson</h3>
    {(props.index != null && props.index > -1 && props.geojson) &&
      <StyledcodeEditorContainer>
        <JsonEditor
          value={JSON.stringify(props.geojson)}
          onValueChange={handleChange}
          highlight={data => highlight(data, languages.json)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            fontWeight: 'bolder',
            background: 'white',
            overflow: 'auto',
            minHeight: '160px',
            maxHeight: '380px'
          }}
  />
      </StyledcodeEditorContainer>
    }
  </StyledSliderBar>
}

export default SliderBar;
