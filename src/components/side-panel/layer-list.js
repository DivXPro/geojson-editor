import React from 'react';
import Styled from 'styled-components';
import UploadField from '@/components/commons/upload-field';

const WrapperLayerList = Styled.section`
  background: rgb(36, 39, 48);
  padding: 16px;
  min-height 480px;
  .button {
    align-items: center;
    background-color: rgb(106, 116, 133);
    color: rgb(255, 255, 255);
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    font-weight: 500;
    -webkit-box-pack: center;
    justify-content: center;
    letter-spacing: 0.3px;
    line-height: 14px;
    text-align: center;
    vertical-align: middle;
    width: 105px;
    opacity: 1;
    pointer-events: all;
    border-radius: 2px;
    outline: 0px;
    padding: 9px 12px;
    transition: all 0.4s ease 0s;
  }
`


function LayerList(props) {
  function updateGeom(files) {
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (e) => {
      props.setBaseGeom(JSON.parse(e.target.result));
    }
  }
  return (
    <WrapperLayerList>
      <UploadField 
        onFiles={updateGeom}
        uploadProps={{
          accept: '.json,.geojson',
        }}
      >
        <div className="button">添加底图</div>
      </UploadField>
    </WrapperLayerList>
  )
}

export default LayerList;