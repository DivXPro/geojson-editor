import axios from 'axios';

const access_token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw';

const http = axios.create({
  baseURL: 'https://api.mapbox.com/',
  timeout: 5000,
  params: { access_token },
});

export default http;