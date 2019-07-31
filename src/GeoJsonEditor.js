import React from 'react';
import DeckGL from '@deck.gl/react';
import MapGL from 'react-map-gl';
import { HotKeys } from "react-hotkeys";
import { EditableGeoJsonLayer } from 'nebula.gl';
import ControlPlanel from './ControlPanel';

const DRAW_LINE_STRING = 'drawLineString';
const DRAW_PROLYGON = 'drawPolygon';
const VIEW_MODE = 'view';

export default class GeoJsonEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeatureIndexes: [],
      geo: {
        type: 'FeatureCollection',
        features: [
          { "type": "Feature", "properties": { "marker-color": "#ff0000", "marker-size": "medium", "marker-symbol": "" }, "geometry": { "type": "Point", "coordinates": [-122.44477272033691, 37.79906910652822] } },
          { "type": "Feature", "properties": { "marker-color": "#0000ff", "marker-size": "large", "marker-symbol": "" }, "geometry": { "type": "Point", "coordinates": [-122.42451667785645, 37.8019175085504] } },
          { "type": "Feature", "properties": { "marker-size": "small" }, "geometry": { "type": "MultiPoint", "coordinates": [[-122.46923446655273, 37.803273851858656], [-122.46957778930665, 37.79934038764369], [-122.46434211730958, 37.80313821864869], [-122.46451377868652, 37.8001542250124]] } },
          { "type": "Feature", "properties": { "stroke": "#ff0000", "stroke-width": 10, "stroke-opacity": 1 }, "geometry": { "type": "LineString", "coordinates": [[-122.40880966186523, 37.783536601521924], [-122.43893623352051, 37.779669924659004], [-122.43515968322752, 37.7624370109886], [-122.42348670959471, 37.77180027337861], [-122.4250316619873, 37.778584505321376], [-122.42314338684082, 37.778652344496926], [-122.42357254028322, 37.77987343901049], [-122.41198539733887, 37.78109451335266]] } },
        ]
      },
      mode: VIEW_MODE,
      pointsRemovable: true,
      viewport: props.viewport,
    }
  }

  shiftDownHandle(e) {
    console.log(e, 'shiftHandle');
  }

  enterHandle(e) {
    console.log('enter');
    this.setState({
      mode: VIEW_MODE,
      selectedFeatureIndexes: []
    });
  }

  altDownHandle(e) {
    console.log(e, 'alt down handle');
    this.setMode(DRAW_LINE_STRING);
  }

  altUpHandle(e) {
    console.log(e, 'alt up handle');
    this.setViewMode();
  }

  delHandle(e) {
    console.log(e, 'del handle');
  }

  setMode(mode) {
    this.setState({ mode });
  }

  setViewMode() {
    this.setState({ mode: VIEW_MODE, selectedFeatureIndexes: [] });
  }

  renderStaticMap(viewport: Object) {
    return <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    />;
  }
  

  render() {
    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'draw-layer',
      data: this.state.geo,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      mode: this.state.mode,
      pickable: true,
      autoHighlight: true,
      lineWidthScale: 6,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      onHover: ({ object, x, y, coordinate }) => {
        const index = this.state.geo.features.findIndex(d => d === object);
        console.log('hover', index);
      },
      onClick: ({ object, x, y, coordinate }) => {
        const index = this.state.geo.features.findIndex(d => d === object);
        console.log('select', index);
        if (this.state.mode === VIEW_MODE) {
          this.setState({
            selectedFeatureIndexes: [index]
          })
        }
      },
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        console.log('featureIndexes', featureIndexes);
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          return;
        }
        if (editType === 'addFeature' && this.state.mode !== 'duplicate') {
          featureIndexes = featureIndexes || editContext.featureIndexes;
          updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
        }
        this.setState({
          geo: updatedData,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      }
    });

    const handleKeyPress = {
      SHIFT_DOWN: this.shiftDownHandle.bind(this),
      ALT_DOWN: this.altDownHandle.bind(this),
      ALT_UP: this.altUpHandle.bind(this),
      DEL: this.delHandle.bind(this),
      ENTER: this.enterHandle.bind(this)
    };

    const toggles = [
      {
        text: 'STR',
        handle: this.altDownHandle.bind(this),
      },
      {
        text: 'VIEW',
        handle: this.enterHandle.bind(this),
      }
    ];

    
    return <React.Fragment>
      <HotKeys handlers={handleKeyPress}>
        <DeckGL
          width="100%"
          height="100%"
          initialViewState={this.props.viewport}
          onViewStateChange={({viewState}) => this.setState({ viewport: viewState })}
          // getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          pickingRadius={5}
          layers={[editableGeoJsonLayer]}
          controller={true}>
          {this.renderStaticMap(this.state.viewport)}
        </DeckGL>
        <ControlPlanel toggles={toggles} />
      </HotKeys>
    </React.Fragment>;
  }
}

