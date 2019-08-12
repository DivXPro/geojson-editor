import http from './http';
import store from 'store2';

export function getDatasetList() {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.get(`datasets/v1/${username}`, {
    params: { access_token }
  });
}

export function getDataset(dataset_id) {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.get(`datasets/v1/${username}/${dataset_id}`, {
    params: { access_token }
  });
}

export function updateDataset(dataset_id, name, description) {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.patch(`datasets/v1/${username}/${dataset_id}`, { name, description }, {
    params: { access_token }
  });
}