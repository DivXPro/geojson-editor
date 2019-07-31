import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import MapGL from 'react-map-gl';

import { EditableGeoJsonLayer } from 'nebula.gl';
import ControlPlanel from './ControlPlnel';

const DRAW_LINE_STRING = 'drawLineString';
const DRAW_PROLYGON = 'drawPolygon';
const VIEW = 'view';

function GeoEditor(props) {
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);
  const [mode, setMode] = useState(DRAW_LINE_STRING);
  const [pointsRemovable, setPointsRemovable] = useState(true);
  const [geo, setGeo] = useState(
    {
      type: 'FeatureCollection',
      features: [
        { "type": "Feature", "properties": { "marker-color": "#ff0000", "marker-size": "medium", "marker-symbol": "" }, "geometry": { "type": "Point", "coordinates": [-122.44477272033691, 37.79906910652822] } },
        { "type": "Feature", "properties": { "marker-color": "#0000ff", "marker-size": "large", "marker-symbol": "" }, "geometry": { "type": "Point", "coordinates": [-122.42451667785645, 37.8019175085504] } },
        { "type": "Feature", "properties": { "marker-size": "small" }, "geometry": { "type": "MultiPoint", "coordinates": [[-122.46923446655273, 37.803273851858656], [-122.46957778930665, 37.79934038764369], [-122.46434211730958, 37.80313821864869], [-122.46451377868652, 37.8001542250124]] } },
        { "type": "Feature", "properties": { "stroke": "#ff0000", "stroke-width": 10, "stroke-opacity": 1 }, "geometry": { "type": "LineString", "coordinates": [[-122.40880966186523, 37.783536601521924], [-122.43893623352051, 37.779669924659004], [-122.43515968322752, 37.7624370109886], [-122.42348670959471, 37.77180027337861], [-122.4250316619873, 37.778584505321376], [-122.42314338684082, 37.778652344496926], [-122.42357254028322, 37.77987343901049], [-122.41198539733887, 37.78109451335266]] } },
      ]
    }
  );
  const [viewport, setViewport] = useState(props.viewport);
  const [editableGeoJsonLayer, setEditableGeoJsonLayer] = useState(new EditableGeoJsonLayer({
    id: 'draw-layer',
    data: geo,
    selectedFeatureIndexes: [],
    mode,
    modeConfig: {
      drawAtFront: true,
    },
    pickable: true,
    onHover: (obj) => {
      console.log('obj', obj);
    },
    onEdit
  }));

  function makeEditGeoJsonLayer(data) {
    return new EditableGeoJsonLayer({
      id: 'draw-layer',
      data: data || geo,
      selectedFeatureIndexes,
      mode,
      pickable: true,
      onHover: (obj) => {
        console.log('obj', obj);
      },
      onEdit
    })
  }

  function onEdit({ updatedData, editType, featureIndexes, editContext }) {
    console.log('onEdit', updatedData);
    let updatedSelectedFeatureIndexes = selectedFeatureIndexes;
    if (editType === 'removePosition' && !pointsRemovable) {
      return;
    }
    if (editType === 'addFeature' && mode !== 'duplicate') {
      // TODO: once we refactor EditableGeoJsonLayer to use new EditMode interface, this check can go away
      featureIndexes = featureIndexes || editContext.featureIndexes;
      // Add the new feature to the selection
      updatedSelectedFeatureIndexes = [...selectedFeatureIndexes, ...featureIndexes];
      console.log('updatedSelectedFeatureIndexes', updatedSelectedFeatureIndexes);
    }
    setGeo(updatedData);
    setSelectedFeatureIndexes(updatedSelectedFeatureIndexes);
    setEditableGeoJsonLayer(makeEditGeoJsonLayer(updatedData));
  }



  // const [geojsonLayer, setGeojsonLayer] = useState(new GeoJsonLayer({
  //   id: 'geojson-layer',
  //   data: geo,
  //   pickable: true,
  //   stroked: false,
  //   filled: true,
  //   extruded: true,
  //   lineWidthScale: 20,
  //   lineWidthMinPixels: 2,
  //   getFillColor: [160, 160, 180, 200],
  //   getRadius: 100,
  //   getLineWidth: 1,
  //   getElevation: 30,
  //   onHover: ({ object, x, y }) => {
  //     console.log('obj', object);
  //   }
  // }));

  function renderStaticMap(viewport: Object) {
    return <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={({ viewState }) => setViewport(viewState)}
    />;
  }

  return <React.Fragment>
    <DeckGL
      width="100%"
      height="100%"
      initialViewState={viewport}
      // getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
      layers={[editableGeoJsonLayer]}
      controller={true}>
      {renderStaticMap(viewport)}
    </DeckGL>
    <ControlPlanel></ControlPlanel>
  </React.Fragment>;
}

export default GeoEditor;