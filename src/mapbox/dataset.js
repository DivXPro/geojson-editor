import http from './http';

const username = process.env.MAPBOX_USERNAME || 'divx';
const access_token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw';

export function getDatasetList() {
  return http.get(`datasets/v1/${username}`, {
    params: { access_token }
  });
}

export function getDataset(dataset_id) {
  return http.get(`datasets/v1/${username}/${dataset_id}`, {
    params: { access_token }
  });
}

export function updateDataset(dataset_id, name, description) {
  return http.patch(`datasets/v1/${username}/${dataset_id}`, { name, description }, {
    params: { access_token }
  });
}