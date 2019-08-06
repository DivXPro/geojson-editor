import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import geometryApp from '@/store/reducers';
import MapContainer from './map-container';

export class GeoJsonEditor extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(geometryApp, 
      {
        geometry: {
          type: 'FeatureCollection',
          features: []
        },
        baseGeom: {
          type: 'FeatureCollection',
          features: []
        },
        selectedFeatureIndexes: [],
        mode: 'view',
      },
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
  render() {
    return (
      <Provider store={this.store}>
        <MapContainer viewport={this.props.viewport}/>
      </Provider>
    );
  }
}

export default GeoJsonEditor;