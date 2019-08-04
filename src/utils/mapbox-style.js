export const mapStyle = {
  version: 8,
  sources: {
    composite: {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7'
    }
  },
  layers: [
    {
      id: 'background',
      layout: {},
      paint: { 'background-color': 'hsl(55, 11%, 96%)'},
      type: 'background'
    }
  ]
}