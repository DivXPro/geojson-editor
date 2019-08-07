import React, { useState } from 'react';
import Immutable from 'immutable';
import { Form, Input } from 'antd';

export default function MarkerProperties(props) {
  const [editMarker, setEditMarker] = useState(props.marker);

  const setProperty = (e, key) => {
    const value = e.target.value;
    setEditMarker(Immutable.set(editMarker, key, value));
    props.onChange(key, value);
  }

  return (
    <Form>
      <Form.Item label="ID">
        <Input value={editMarker.id} onChange={e => setProperty(e, 'id')}></Input>
      </Form.Item>
      <Form.Item label="设备编号">
        <Input value={editMarker.sid} onChange={e => setProperty(e, 'sid')}></Input>
      </Form.Item>
      <Form.Item label="设备类型">
        <Input value={editMarker.type} onChange={e => setProperty(e, 'type')}></Input>
      </Form.Item>
      <Form.Item label="流媒体地址">
        <Input value={editMarker.url} onChange={e => setProperty(e, 'url')}></Input>
      </Form.Item>
    </Form>
  );
}