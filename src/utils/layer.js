
import uuidv4 from 'uuid/v4';

export function makeDeckGeoJsonLayer(layer) {
  const id = uuidv4();
  return Object.assign({}, {
    uid: id,
    id: id,
    name: 'untitled',
    data: {
      type: 'FeatureCollection',
      features: []
    },
    pickable: true,
    autoHighlight: true,
    color: '#F5A623',
    getFillColor: [245, 166, 35, 100],
    lineWidthScale: 2,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 2,
  }, layer);
}

export function makeGeoJsonLayer(layer) {
  const id = uuidv4();
  return Object.assign({}, {
    id: id,
    deckId: id,
    name: 'untitled',
    data: {
      type: 'FeatureCollection',
      features: []
    },
    pickable: false,
    stroked: false,
    filled: true,
    extruded: false,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 3,
    getFillColor: [],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
    hidden: false,
  }, layer);
}

export function edit2Geojson(layer) {
  return {
    uid: layer.uid,
    id: uuidv4(),
    sourceId: layer.sourceId,
    name: layer.name,
    data: layer.data,
    pickable: true,
    autoHighlight: false,
    stroked: false,
    filled: true,
    extruded: false,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 3,
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
    hidden: false,
    color: layer.color || '#000',
    getFillColor: layer.getFillColor || [],
    getLineColor: layer.getLineColor || [],
  };
}

export function geojson2Edit(layer) {
  return {
    uid: layer.uid,
    id: uuidv4(),
    sourceId: layer.sourceId,
    name: layer.name,
    data: layer.data,
    pickable: true,
    autoHighlight: true,
    color: layer.color || '#000',
    getFillColor: layer.getFillColor || [],
    getLineColor: layer.getLineColor || [],
    lineWidthScale: 2,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 2,
  };
}
