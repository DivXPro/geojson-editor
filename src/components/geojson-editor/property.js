import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Form, Input, Button, Modal } from 'antd';
import { map } from 'lodash';
import { setLayer } from '@/store/actions/geojson-editor';
import SvgIcon from '@/components/commons/svg-icon';

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  labelAlign: 'left',
};

const StyledPropertyItem = styled.div.attrs({
  className: 'geojson-property'
})`
  display: flex;
  align-items: center;
  justify-content: space-around;
  .field {
    width: 45%;
    padding-right: 5px;
  }
  .value {
    width: 45%;
    padding-right: 5px;
  }
  .operator {
    width: 10%;
    display: flex;
    alignItems: center;
    &:hover {
      cursor: pointer;
    }
  }
`;

function Property(props) {
  const [newField, setNewField] = useState('');
  const [newValue, setNewValue] = useState(null);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { layer, index } = useSelector(state => ({
    layer: state.layers.find(l => l.id === state.currentLayerId),
    index: state.selectedFeatureIndexes[0],
  }));
  const setPropertyValue = (key, value) => {
    layer.data.features[index]['properties'][key] = value;
    dispatch(setLayer(layer));
  }

  const handleAddProp = () => {
    setVisible(true);
  }

  const saveProfile = () => {
    layer.data.features[index]['properties'][newField] = newValue;
    dispatch(setLayer(layer));
    setNewField('');
    setNewValue(null);
    setVisible(false);
  }

  const removeProperty = (field) => {
    delete layer.data.features[index]['properties'][field];
    dispatch(setLayer(layer));
  }

  const propItems = (properties) => {
    return map(properties, (value, field) => (<StyledPropertyItem key={field}>
      <div className="field">{field}</div>
      <div className="value">
        <Input size="small" value={value} onChange={e => setPropertyValue(field, e.target.value)}></Input>
      </div>
      <div onClick={e => removeProperty(field)} className="operator">
        <SvgIcon fill="rgb(106,116,133)" hoverFill="white" name="delete" />
      </div>
    </StyledPropertyItem>));
  }
  
  return (
    (layer && index > -1 && layer.data.features[index]) ?
    <React.Fragment>
      { propItems(layer.data.features[index]['properties']) }
      <Button type="primary" style={{ width: '100%', marginTop: '10px' }} onClick={handleAddProp}>添加新属性</Button>
      <Modal title="添加属性" visible={visible} onOk={saveProfile} onCancel={e => setVisible(false)}>
        <Form {...formLayout}>
          <Form.Item label="Field">
              <Input size="small" value={newField} onChange={e => setNewField(e.target.value)}></Input>
          </Form.Item>
          <Form.Item label="Value">
              <Input size="small" value={newValue} onChange={e => setNewValue(e.target.value)}></Input>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
    : null
  );
}

export default Property;