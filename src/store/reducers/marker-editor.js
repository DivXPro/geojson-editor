import Immutable from 'immutable';
import { ADD_MARKER, REMOVE_MARKER } from '../actions/marker-editor';

function markerEditorApp(state, action) {
  switch (action.type) {
    case ADD_MARKER:
      return Immutable.set(state, 'markers', addMarker(state.markers, action.marker));
    case REMOVE_MARKER:
      return Immutable.set(state, 'markers', removeMarker(state.markers, action.id));
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

function removeMarker(markers, id) {
  const index = markers.findIndex(m => m.id === id);
  if (index > -1) {
    return Immutable.remove(markers, index);
  }
  return markers;
}

export default markerEditorApp;