import React, { useState } from 'react';
import Immutable from 'immutable';
import { Form, Input, InputNumber } from 'antd';

function MarkerProperties(props) {
  const [editMarker, setEditMarker] = useState(props.marker);

  const setProperty = (value, key) => {
    setEditMarker(Immutable.set(editMarker, key, value));
    props.onChange(key, value);
  }

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
  ];

  const { getFieldDecorator } = props.form;

  return (
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
                <Input size="small" onChange={e => setProperty(e.target.value, m.key)}></Input>
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
                <InputNumber size="small" onChange={value => setProperty(value, m.key)} style={{ width: '100%' }}></InputNumber>
              )
            }
          </Form.Item>
        )
      }
    </Form>
  );
}

export default Form.create()(MarkerProperties);