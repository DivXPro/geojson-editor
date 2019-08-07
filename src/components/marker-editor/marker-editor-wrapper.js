import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import markerEditorApp from '@/store/reducers/marker-editor';
import MarkerEditor from './marker-editor';

export default class MarkerEditorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(markerEditorApp, 
      {
        markers: [
          {
            id: 'mk-0001',
            coordinates: [
              102.79056549072259,
              35.19961732209277
            ],
            icon: 'marker'
          },
          {
            id: 'dd37893d-bcfe-452c-8e13-ec8560690aab',
            coordinates: [
              113.29589843749989,
              33.456359450351925
            ],
            icon: 'marker'
          }
        ]
      },
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
  render() {
    return (
      <Provider store={this.store}>
        <MarkerEditor viewport={this.props.viewport}/>
      </Provider>
    );
  }
}
