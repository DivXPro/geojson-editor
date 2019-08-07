import Immutable from 'immutable';
import { ADD_MARKER, SET_MARKER, REMOVE_MARKER, SET_CURRENT_MARKER, SET_CURRENT_COORDINATE } from '../actions/marker-editor';

function markerEditorApp(state, action) {
  switch (action.type) {
    case ADD_MARKER:
      return Immutable.set(state, 'markers', addMarker(state.markers, action.marker));
    case SET_MARKER:
      return Immutable.set(state, 'markers', setMarker(state.markers, action.marker));
    case REMOVE_MARKER:
      return Immutable.set(state, 'markers', removeMarker(state.markers, action.id));
    case SET_CURRENT_MARKER:
      return Immutable.set(state, 'currentMarker', action.marker);
    case SET_CURRENT_COORDINATE:
      return Immutable.set(state, 'currentCoordinate', action.coordinate);
    default:
      return state;
  }
}

function addMarker(markers, marker) {
  if (markers.findIndex(m => m.id === marker.id) === -1) {
    return Immutable.set(markers, markers.length, marker);
  }
  return markers;
}

function setMarker(markers, marker) {
  const index = markers.findIndex(m => m.id === marker.id);
  if (index > -1) {
    return Immutable.set(markers, index, marker);
  }
  return markers;
}

function removeMarker(markers, id) {
  const index = markers.findIndex(m => m.id === id);
  if (index > -1) {
    return Immutable.remove(markers, index);
  }
  return markers;
}

export default markerEditorApp;