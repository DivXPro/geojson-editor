import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Styled from 'styled-components';
import { Form, Input, InputNumber } from 'antd';
import Immutable from 'immutable';

import { setMarker } from '@/store/actions/marker-editor';


const StyledMarkerProfile = Styled.section`
  background: rgb(36, 39, 48);
  padding: 16px;
  min-height 480px;
  textarea {
    outline: none;
  }
`

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

const markProps = [
  { key: 'id', name: 'ID', type: 'string', required: true },
  { key: 'sid', name: '设备号', type: 'number' },
  { key: 'type', name: '设备类型', type: 'string', required: true },
  { key: 'url', name: '流媒体地址', type: 'string' },
]

function MarkerProfile(props) {
  const dispatch = useDispatch();
  const { editMarker } = useSelector(state => ({
    editMarker: state.markers.find(marker => marker.id === state.currentMarkerId),
  }));

  const setProperty = (value, key) => {
    dispatch(setMarker(Immutable.set(editMarker, key, value)));
  }

  const { getFieldDecorator } = props.form;

  return (
    <StyledMarkerProfile>
      {editMarker &&
        <Form {...formLayout}>
          {
            markProps.map(m => 
              <Form.Item label={m.name} key={m.key}>
                {
                  m.type === 'string' &&
                  getFieldDecorator(m.key, {
                    initialValue: editMarker[m.key],
                    rules: [
                      {
                        required: m.required,
                        message: '必须输入值',
                      },
                    ],
                  })(
                    <Input size="small"  onChange={e => setProperty(e.target.value, m.key)}></Input>
                  )
                }
                {
                  m.type === 'number' &&
                  getFieldDecorator(m.key, {
                    initialValue: editMarker[m.key],
                    rules: [
                      {
                        required: m.required,
                        message: '必须输入值',
                      },
                    ],
                  })(
                    <InputNumber size="small" onChange={value => setProperty(value, m.key)} style={{width: '100%'}}></InputNumber>
                  )
                }
              </Form.Item>
            )
          }
        </Form>
      }
    </StyledMarkerProfile>
  )
}

export default Form.create()(MarkerProfile);