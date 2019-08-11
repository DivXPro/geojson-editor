import http from './http';

const username = process.env.MAPBOX_USERNAME || 'divx';
const access_token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw';

export function getFeatureList(dataset_id, start, limit = 100) {
  return http.get(`datasets/v1/${username}/${dataset_id}/features`, {
    params: { access_token, start, limit }
  });
}

export function getFeature(dataset_id, feature_id) {
  return http.get(`dataset/v1/${username}/${dataset_id}/features/${feature_id}`, {
    params: { access_token }
  });
}

export function setFeature(dataset_id, feature_id, feature) {
  return http.put(`dataset/v1/${username}/${dataset_id}/features/${feature_id}`, feature, {
    params: { access_token }
  });
}

export function deleteFeature(dataset_id, feature_id) {
  return http.delete(`dataset/v1/${username}/${dataset_id}/features/${feature_id}`, {
    params: { access_token }
  });
}
