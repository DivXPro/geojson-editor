import difference from '@turf/difference';
import booleanContains from '@turf/boolean-contains';

export function maskGeometry(geometry, sharp) {
  const actionIds = {
    modify: [],
    add: [],
    delete: [],
  }
  const features = geometry.features.filter(feature => {
    if (feature.geometry.type === 'MultiPolygon') {
      return true;
    }
    if (!booleanContains(sharp, feature)) {
      return true;
    }
    actionIds.delete.push(feature.id);
    return false;
  });
  return {
    geometry: {
      type: 'FeatureCollection',
      features: features.map(
        feature => {
          if (['Polygon', 'MultiPolygon'].findIndex(type => type === feature.geometry.type) > -1) {
            actionIds.modify.push(feature.id);
            return Object.assign(difference(feature, sharp), { id: feature.id });
          }
          return feature;
        }
      )
    },
    actionIds,
  }
}

export function multiGeoJson(features, type) {
  const actionIds = {
    modify: [],
    add: [],
    delete: [],
  };
  const mFeatures = {
    type: 'Feature',
    properties: {},
    geometry: {
      type,
      coordinates: [
        ...features.map(stringLine => stringLine.geometry.coordinates)
      ]
    }
  };
  features.forEach(stringLine => {
    actionIds.delete.push(stringLine.id);
  });
  actionIds.add.push(mFeatures);
  return {
    geometry: mFeatures,
    actionIds,
  };
}

export function multiStringLine(lines) {
  return multiGeoJson(lines, 'MultiStringLine');
}

export function multiPoint(points) {
  return multiGeoJson(points, 'MultiPoint');
}

export function multiPolygon(polygons) {
  return multiGeoJson(polygons, 'MultiPolygon');
}