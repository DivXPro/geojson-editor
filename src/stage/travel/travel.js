/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import { PhongMaterial } from '@luma.gl/core';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { PolygonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import store from 'store2';
import ControlPlanel from './control-panel';

// Set your mapbox token here
const MAPBOX_TOKEN = store('mapboxAccessToken');

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
  TRIPS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json' // eslint-disable-line
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const material = new PhongMaterial({
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
});

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

export default class Travel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      play: false,
      loopLength: 1800,
      animationSpeed: 1,
      startTime: 0,
    };
  }

  componentDidMount() {
    this.state.play && this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    if (this.state.time > this.state.loopLength ) {
      this.setState({ time: 0 });
    } else {
      this.setState({
        time: this.state.time + this.state.animationSpeed
      });
    }
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _renderLayers() {
    const { buildings = DATA_URL.BUILDINGS, trips = DATA_URL.TRIPS, trailLength = 180 } = this.props;

    return [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength,
        currentTime: this.state.time
      }),
      new PolygonLayer({
        id: 'buildings',
        data: buildings,
        extruded: true,
        wireframe: false,
        opacity: 0.5,
        getPolygon: f => f.polygon,
        getElevation: f => f.height,
        getFillColor: [74, 80, 87],
        material
      })
    ];
  }

  togglePlay(e) {
    this.setState({ play: !this.state.play });
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    } else {
      this._animate();
    }
  }

  setCurrentTime(timePercent) {
    this.setState({ time: timePercent * this.state.loopLength / 100 });
  }

  render() {
    const { viewState, mapStyle = 'mapbox://styles/mapbox/dark-v9' } = this.props;

    return (
      <React.Fragment>
        <DeckGL
          layers={this._renderLayers()}
          effects={[lightingEffect]}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={true}
        >
          <StaticMap
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
        <ControlPlanel current={this.state.time} length={this.state.loopLength} play={this.state.play} togglePlay={this.togglePlay.bind(this)} handleSliderChange={this.setCurrentTime.bind(this)} />
      </React.Fragment>
    );
  }
}