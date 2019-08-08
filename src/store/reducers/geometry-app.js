import Immutable from 'immutable';
import {
  SET_GEOMETRY,
  SET_SELECT_FEATURE_INDEXES,
  ADD_FEATURE,
  SET_FEATURE,
  SET_BASE_GEOM,
  SET_MODE
} from '../actions/geojson-editor';

function geometryApp (state, action) {
  switch (action.type) {
    case SET_GEOMETRY:
      return Immutable.set(state, 'geometry', action.geometry);
    case ADD_FEATURE:
      return Immutable.set(
        state,
        'geometry',
        addFeature(state.geometry, action.feature),
      );
    case SET_SELECT_FEATURE_INDEXES:
      return Immutable.set(
        state,
        'selectedFeatureIndexes',
        action.indexes
      );
    case SET_FEATURE:
      return Immutable.set(
        state,
        'geometry',
        setFeature(state.geometry, action.index, action.feature),
      );
    case SET_BASE_GEOM:
      return Immutable.set(
        state,
        'baseGeom',
        action.data,
      );
    case SET_MODE:
      return Immutable.set(state, 'mode', action.mode);
    default:
      return state;
  }
}

function addFeature(geometry, feature) {
  return Immutable.set(
    geometry,
    'features',
    Immutable.set(geometry.features, geometry.features.length, feature),
  );
}

function setFeature(geometry, index, feature) {
  return Immutable.set(
    geometry,
    'features',
    Immutable.set(geometry.features, index, feature),
  );
}

export default geometryApp;