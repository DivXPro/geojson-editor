import axios from 'axios';

const access_token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw';

export function next(url) {
  return axios.get(url, {
    params: { access_token }
  });
}