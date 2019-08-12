import axios from 'axios';

const http = axios.create({
  baseURL: 'https://api.mapbox.com/',
  timeout: 5000,
});

export default http;