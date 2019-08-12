import http from './http';
import store from 'store2';

export function getFeatureList(dataset_id, start, limit = 100) {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.get(`datasets/v1/${username}/${dataset_id}/features`, {
    params: { access_token, start, limit }
  });
}

export function getFeature(dataset_id, feature_id) {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.get(`dataset/v1/${username}/${dataset_id}/features/${feature_id}`, {
    params: { access_token }
  });
}

export function setFeature(dataset_id, feature_id, feature) {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.put(`dataset/v1/${username}/${dataset_id}/features/${feature_id}`, feature, {
    params: { access_token }
  });
}

export function deleteFeature(dataset_id, feature_id) {
  const access_token = store('mapboxAccessToken');
  const username = store('mapboxUsername');
  return http.delete(`dataset/v1/${username}/${dataset_id}/features/${feature_id}`, {
    params: { access_token }
  });
}
