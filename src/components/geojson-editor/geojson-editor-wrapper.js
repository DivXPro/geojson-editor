import React from 'react';
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import geometryApp from '@/store/reducers/geometry-app';
import { loadDataset } from '@/store/epics/geojson-editor';
import MapEditor from './map-editor';

const rootEpic = combineEpics(loadDataset);

const epicMiddleware = createEpicMiddleware();

// const rootReducer = combineReducers({
//   geometryApp,
// });

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default class GeoJsonEditor extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      geometryApp, 
      composeEnhancers(
        applyMiddleware(epicMiddleware)
      )
    );
    epicMiddleware.run(rootEpic);
  }
  render() {
    return (
      <Provider store={this.store}>
        <MapEditor viewport={this.props.viewport}/>
      </Provider>
    );
  }
}
