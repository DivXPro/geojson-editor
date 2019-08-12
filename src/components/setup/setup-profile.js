import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import store from 'store2'

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

function SetupProfile(props) {
  const [mapboxAccessToken, setMapboxAccessToken] = useState(store('mapboxAccessToken'));
  const [mapboxUsername, setMapboxUsername] = useState(store('mapboxUsername'));
  const saveProfile = () => {
    store({ mapboxAccessToken, mapboxUsername });
    props.finish();
  }

  return (
    <Modal title="设置Mapbox" visible={props.visible} onOk={saveProfile} onCancel={props.finish}>
      <Form {...formLayout}>
        <Form.Item label="Mapbox AccessToken">
          <Input size="small" value={mapboxAccessToken} onChange={e => setMapboxAccessToken(e.target.value)}></Input>
        </Form.Item>
        <Form.Item label="Mapbox Username">
          <Input size="small" value={mapboxUsername} onChange={e => setMapboxUsername(e.target.value)}></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(SetupProfile);