import React from 'react';
import uuidv4 from 'uuid/v4';
import Styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { addLayer, removeLayer, setBaseGeom } from '@/store/actions/geojson-editor';
import UploadField from '@/components/commons/upload-field';
import LayerItem from './layer-item';

const StyledLayerManager = Styled.section`
  background: rgb(36, 39, 48);
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
    margin: 16px;
  }
`


function LayerList(props) {
  const dispatch = useDispatch();
  const { layers } = useSelector(state => ({
    layers: state.layers,
  }));
  function updateGeom(files) {
    const reader = new FileReader();
    const nameArr = files[0].name.split('.');
    nameArr.pop();
    const name = nameArr.join('.');
    reader.readAsText(files[0]);
    reader.onload = (e) => {
      const layer = {
        id: uuidv4(),
        name,
        data: JSON.parse(e.target.result),
        pickable: false,
        stroked: false,
        filled: true,
        extruded: false,
        lineWidthScale: 1,
        lineWidthMinPixels: 2,
        lineWidthMaxPixels: 3,
        getFillColor: [],
        getRadius: 100,
        getLineWidth: 1,
        getElevation: 30,
        hidden: false,
      }
      dispatch(addLayer(layer));
    }
  }
  return (
    <StyledLayerManager>
      <UploadField 
        onFiles={updateGeom}
        uploadProps={{
          accept: '.json,.geojson',
        }}
      >
        <div className="button">添加新图层</div>
      </UploadField>
      {layers.map(layer => (<LayerItem key={layer.id} layer={layer} />))}
    </StyledLayerManager>
  )
}

export default LayerList;