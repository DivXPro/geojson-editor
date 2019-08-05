import React from 'react';
import DeckGL from '@deck.gl/react';
import { fromJS } from 'immutable';
import MapGL from 'react-map-gl';
import { GlobalHotKeys } from 'react-hotkeys';
import { EditableGeoJsonLayer } from 'nebula.gl';
import { GeoJsonLayer } from '@deck.gl/layers';

import exportJson from '@/utils/export-json';
import cutGeometry from '@/utils/cutGeometry';
import ControlPlanel from './control-panel';
import SideBar from './side-panel/side-bar';

const DRAW_LINE_STRING = 'drawLineString';
const DRAW_PROLYGON = 'drawPolygon';
const DRAW_POINT = 'drawPoint';
const DRAW_CIRCLE_FROM_CENTER = 'drawCircleFromCenter';
const MODIFY_MODE = 'modify';
const EXTRUDE_MODE = 'extrude';
const SPLIT_MODE = 'split'
const SCALE_MODE = 'scale';
const ROTATE_MODE = 'rotate';
const TRANSLATE_MODE = 'translate';
const VIEW_MODE = 'view';
const CUT_MODE = 'cut';

const keyMap = {
  SHIFT_DOWN: { sequence: 'shift', action: 'keydown' },
  SHIFT_UP: { sequence: 'shift', action: 'keyup' },
  ALT_DOWN: { sequence: 'alt', action: 'keydown' },
  ALT_UP: { sequence: 'alt', action: 'keyup' },
  ENTER: 'enter',
  DEL: ['del', 'backspace']
};


export default class GeoJsonEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeatureIndexes: [],
      geo: {
        type: 'FeatureCollection',
        features: []
      },
      baseGeom: { "type": "FeatureCollection", "features": [{ "type": "Feature", "properties": {}, "geometry": { "type": "Polygon", "coordinates": [[[-122.44963851809501, 37.7618670837926], [-122.40611431241034, 37.75862907882892], [-122.43448269605638, 37.73491437873466], [-122.44963851809501, 37.7618670837926]]] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Polygon", "coordinates": [[[-122.44944003462525, 37.74728466970526], [-122.45027285634501, 37.74725231537432], [-122.45109765536945, 37.747155564055774], [-122.45190648634947, 37.74699534776765], [-122.45269155788039, 37.74677320988625], [-122.4534453076112, 37.74649129026699], [-122.45416047513898, 37.74615230461543], [-122.4548301719834, 37.745759518307985], [-122.45544794796623, 37.745316714915305], [-122.45600785335407, 37.74482815973281], [-122.4565044961659, 37.74429855867063], [-122.45693309409253, 37.743733012900144], [-122.45728952052845, 37.743136969695335], [-122.4575703442738, 37.74251616994331], [-122.4577728625256, 37.7418765928309], [-122.45789512684254, 37.741224398240846], [-122.45793596183563, 37.740565867413196], [-122.45789497640789, 37.73990734244393], [-122.45777256743743, 37.73925516520388], [-122.45756991587217, 37.73861561626635], [-122.45728897527661, 37.737994854431335], [-122.45693245294419, 37.737398857428545], [-122.45650378376003, 37.73683336436956], [-122.45600709706801, 37.736303820502684], [-122.45544717686366, 37.73581532480132], [-122.45482941569738, 37.73537258088978], [-122.45415976273308, 37.73497985177764], [-122.45344466646284, 37.73464091883759], [-122.45269101262849, 37.73435904542034], [-122.45190605794781, 37.73413694545595], [-122.45109736028127, 37.73397675734271], [-122.45027270591036, 37.73388002337417], [-122.44944003462525, 37.733847674901604], [-122.4486073633401, 37.73388002337417], [-122.4477827089692, 37.73397675734271], [-122.44697401130266, 37.73413694545595], [-122.44618905662198, 37.73435904542034], [-122.44543540278764, 37.73464091883759], [-122.44472030651738, 37.73497985177764], [-122.4440506535531, 37.73537258088978], [-122.44343289238682, 37.73581532480132], [-122.44287297218246, 37.736303820502684], [-122.44237628549045, 37.73683336436956], [-122.4419476163063, 37.737398857428545], [-122.44159109397387, 37.737994854431335], [-122.44131015337831, 37.73861561626635], [-122.44110750181305, 37.73925516520388], [-122.4409850928426, 37.73990734244393], [-122.44094410741485, 37.740565867413196], [-122.44098494240792, 37.741224398240846], [-122.44110720672488, 37.7418765928309], [-122.44130972497669, 37.74251616994331], [-122.44159054872203, 37.743136969695335], [-122.44194697515795, 37.743733012900144], [-122.44237557308458, 37.74429855867063], [-122.44287221589641, 37.74482815973281], [-122.44343212128425, 37.745316714915305], [-122.44404989726706, 37.745759518307985], [-122.44471959411152, 37.74615230461543], [-122.44543476163926, 37.74649129026699], [-122.4461885113701, 37.74677320988625], [-122.44697358290101, 37.74699534776765], [-122.44778241388101, 37.747155564055774], [-122.44860721290546, 37.74725231537432], [-122.44944003462525, 37.74728466970526]]] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Polygon", "coordinates": [[[-122.42999401926731, 37.77467688774497], [-122.4307012771076, 37.77464942199976], [-122.43140172210452, 37.77456728933515], [-122.43208860708627, 37.774431280913895], [-122.43275531558926, 37.774242706864214], [-122.43339542563169, 37.774003383651284], [-122.43400277160724, 37.77371561656855], [-122.43457150370172, 37.77338217751802], [-122.4350961442583, 37.77300627829432], [-122.43557164054798, 37.77259153963043], [-122.4359934134358, 37.772141956304374], [-122.4363574014748, 37.771661858643526], [-122.43666010000209, 37.771155870798374], [-122.43689859486228, 37.77062886618836], [-122.43707059043429, 37.770085920549754], [-122.43717443169233, 37.76953226303845], [-122.43720912009168, 37.76897322585901], [-122.43717432312748, 37.76841419290577], [-122.43707037747672, 37.767860547910715], [-122.4368982856958, 37.767317622597396], [-122.43665970650777, 37.76679064534062], [-122.43635693877447, 37.76628469082547], [-122.43599289931075, 37.76580463119056], [-122.4355710947557, 37.765355089125045], [-122.43509558777333, 37.76494039337069], [-122.43457095790946, 37.764564537056515], [-122.43400225748215, 37.764231139266535], [-122.43339496293132, 37.76394341020974], [-122.43275492209496, 37.763704120326814], [-122.43208829791978, 37.76351557363037], [-122.43140150914694, 37.7633795855344], [-122.43070116854275, 37.76329746538604], [-122.42999401926731, 37.763270003867056], [-122.42928686999188, 37.76329746538604], [-122.42858652938769, 37.7633795855344], [-122.42789974061486, 37.76351557363037], [-122.42723311643968, 37.763704120326814], [-122.4265930756033, 37.76394341020974], [-122.42598578105247, 37.764231139266535], [-122.42541708062517, 37.764564537056515], [-122.42489245076129, 37.76494039337069], [-122.42441694377892, 37.765355089125045], [-122.42399513922388, 37.76580463119056], [-122.42363109976016, 37.76628469082547], [-122.42332833202686, 37.76679064534062], [-122.4230897528388, 37.767317622597396], [-122.42291766105792, 37.767860547910715], [-122.42281371540716, 37.76841419290577], [-122.42277891844293, 37.76897322585901], [-122.42281360684231, 37.76953226303845], [-122.42291744810032, 37.770085920549754], [-122.42308944367232, 37.77062886618836], [-122.42332793853255, 37.771155870798374], [-122.42363063705983, 37.771661858643526], [-122.42399462509883, 37.772141956304374], [-122.42441639798665, 37.77259153963043], [-122.42489189427633, 37.77300627829432], [-122.4254165348329, 37.77338217751802], [-122.4259852669274, 37.77371561656855], [-122.42659261290294, 37.774003383651284], [-122.42723272294536, 37.774242706864214], [-122.42789943144835, 37.774431280913895], [-122.42858631643011, 37.77456728933515], [-122.42928676142704, 37.77464942199976], [-122.42999401926731, 37.77467688774497]]] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Polygon", "coordinates": [[[-122.41689411043858, 37.74646292973927], [-122.41740144810548, 37.74644322063592], [-122.41790389902917, 37.746384283166634], [-122.41839662355939, 37.7462866850242], [-122.41887487577699, 37.74615136628269], [-122.41933404922713, 37.74597963033823], [-122.41976972130591, 37.74577313134881], [-122.42017769587225, 37.74553385829434], [-122.42055404367362, 37.745264115810826], [-122.42089514019584, 37.744966501983775], [-122.42119770057232, 37.744643883314936], [-122.42145881121584, 37.7442993671041], [-122.42167595786918, 37.74393627151244], [-122.42184704980404, 37.743558093595865], [-122.42197043993613, 37.74316847561706], [-122.4220449406636, 37.74277116996067], [-122.4220698352769, 37.74237000299003], [-122.42204488483121, 37.74196883819363], [-122.42197033041694, 37.741571538976366], [-122.42184689080679, 37.74118193145414], [-122.4216757555041, 37.740803767609776], [-122.42145857325967, 37.74044068916514], [-122.42119743616958, 37.740096192517214], [-122.42089485950738, 37.73977359507534], [-122.42055375748613, 37.73947600332361], [-122.42017741518379, 37.73920628291544], [-122.41976945690317, 37.738967031087945], [-122.41933381127093, 37.73876055166142], [-122.41887467341189, 37.73858883286399], [-122.41839646456216, 37.73845352819468], [-122.41790378950996, 37.73835594050883], [-122.41740139227308, 37.738297009478686], [-122.41689411043858, 37.73827730254957], [-122.41638682860409, 37.738297009478686], [-122.4158844313672, 37.73835594050883], [-122.415391756315, 37.73845352819468], [-122.41491354746528, 37.73858883286399], [-122.41445440960624, 37.73876055166142], [-122.414018763974, 37.738967031087945], [-122.41361080569338, 37.73920628291544], [-122.41323446339102, 37.73947600332361], [-122.41289336136977, 37.73977359507534], [-122.41259078470758, 37.740096192517214], [-122.4123296476175, 37.74044068916514], [-122.41211246537306, 37.740803767609776], [-122.41194133007038, 37.74118193145414], [-122.41181789046023, 37.741571538976366], [-122.41174333604594, 37.74196883819363], [-122.41171838560027, 37.74237000299003], [-122.41174328021354, 37.74277116996067], [-122.41181778094104, 37.74316847561706], [-122.41194117107311, 37.743558093595865], [-122.41211226300797, 37.74393627151244], [-122.41232940966131, 37.7442993671041], [-122.41259052030483, 37.744643883314936], [-122.41289308068133, 37.744966501983775], [-122.41323417720353, 37.745264115810826], [-122.41361052500491, 37.74553385829434], [-122.41401849957126, 37.74577313134881], [-122.41445417165004, 37.74597963033823], [-122.41491334510017, 37.74615136628269], [-122.41539159731776, 37.7462866850242], [-122.415884321848, 37.746384283166634], [-122.41638677277169, 37.74644322063592], [-122.41689411043858, 37.74646292973927]]] } }] },
      mode: VIEW_MODE,
      pointsRemovable: true,
      viewport: props.viewport,
      currentIndex: null,
    }
  }

  get currentGeoJson() {
    return this.state.geo.features[this.state.currentIndex];
  }

  shiftDownHandle(e) {
    // TODO:
  }

  enterHandle() {
    if (this.state.mode !== VIEW_MODE) {
      this.setViewMode();
    }
  }

  altDownHandle() {
    this.setMode(DRAW_LINE_STRING);
  }

  altUpHandle() {
    this.setViewMode();
  }

  delHandle() {
    if (this.state.selectedFeatureIndexes.length > 0) {
      this.state.selectedFeatureIndexes.forEach(idx => {
        this.removeFeature(idx);
      });
      this.setState({
        selectedFeatureIndexes: [],
        currentIndex: null
      });
    }
  }

  setMode(mode) {
    this.setState({ mode });
  }

  setViewMode() {
    this.setState({
      mode: VIEW_MODE,
      selectedFeatureIndexes: [],
      currentIndex: null
    });
  }

  setDrawMode(mode) {
    this.setState({
      mode,
      selectedFeatureIndexes: [],
      currentIndex: null
    });
  }

  setEditMode(mode) {
    this.setState({ mode });
  }

  // 切割模式
  setCutMode() {
    this.setState({
      selectedFeatureIndexes: [],
      mode: CUT_MODE
    });
  }

  setBaseGeom(baseGeom) {
    this.setState({
      baseGeom
    });
  }

  setCurrentGeoJson(geojson: string, index: string) {
    const geoImmutable = fromJS(this.state.geo);
    this.setState({
      geo: geoImmutable.set('features', geoImmutable.get('features').set(index, JSON.parse(geojson))).toJS()
    });
  }

  removeFeature(index: number) {
    const geoImmutable = fromJS(this.state.geo);
    this.setState({
      geo: geoImmutable.set('features', geoImmutable.get('features').remove(index)).toJS()
    });
  }

  // 导出GeoJson格式文件
  exportGeoJson() {
    exportJson(JSON.stringify(this.state.geo));
  }

  handleDeckClick(e) {
    if (this.state.mode === MODIFY_MODE) {
      if (e.index === -1 && e.object == null)
        this.setViewMode();
    }
  }

  renderStaticMap(viewport: Object) {
    return <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGl2eCIsImEiOiJtdzN3dndvIn0.LKwcY4HJPVItRlDBfNodTw'}
    />;
  }

  get baseLayer() {
    return new GeoJsonLayer({
      id: 'geojson-layer',
      data: this.state.baseGeom,
      pickable: false,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 6,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      getFillColor: [160, 160, 180, 200],
      getRadius: 100,
      getLineWidth: 2,
      getElevation: 30,
    });
  }

  render() {
    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'draw-layer',
      data: this.state.geo,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      mode: this.state.mode === CUT_MODE ? DRAW_PROLYGON : this.state.mode,
      pickable: true,
      autoHighlight: true,
      lineWidthScale: 6,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      onHover: ({ object, x, y, coordinate }) => {
        // const index = this.state.geo.features.findIndex(d => d === object);
      },
      onClick: ({ object, x, y, coordinate }) => {
        const index = this.state.geo.features.findIndex(d => d === object);
        if (this.state.mode === VIEW_MODE) {
          this.setState({
            selectedFeatureIndexes: [index],
            currentIndex: index,
            mode: TRANSLATE_MODE
          })
        }
      },
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          return;
        }
        if (editType === 'addFeature') {
          if (this.state.mode === CUT_MODE) {
            updatedData = cutGeometry(updatedData, updatedData.features[featureIndexes[0]]);
            updatedSelectedFeatureIndexes = [];
            this.setState({
              geo: updatedData,
              selectedFeatureIndexes: updatedSelectedFeatureIndexes,
              mode: VIEW_MODE
            });
            return;
          } else if (this.state.mode !== 'duplicate') {
            featureIndexes = featureIndexes || editContext.featureIndexes;
            updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
          }
        }
        this.setState({
          geo: updatedData,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes,
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
        text: 'View',
        icon: 'view_simple',
        mode: VIEW_MODE,
        handle: this.setViewMode.bind(this)
      },
      {
        text: 'LineString',
        icon: 'arrow_right',
        mode: DRAW_LINE_STRING,
        handle: this.setDrawMode.bind(this, DRAW_LINE_STRING)
      },
      {
        text: 'Polygon',
        icon: 'sharp',
        mode: DRAW_PROLYGON,
        handle: this.setDrawMode.bind(this, DRAW_PROLYGON)
      },
      {
        text: 'Point',
        icon: 'pin_sharp_plus',
        mode: DRAW_POINT,
        handle: this.setDrawMode.bind(this, DRAW_POINT)
      },
      {
        text: 'CircleFromCenter',
        icon: 'plus_circle',
        mode: DRAW_CIRCLE_FROM_CENTER,
        handle: this.setDrawMode.bind(this, DRAW_CIRCLE_FROM_CENTER)
      },
      {
        text: 'Movement',
        icon: 'arrow_all',
        mode: TRANSLATE_MODE,
        handle: this.setEditMode.bind(this, TRANSLATE_MODE)
      },
      {
        text: 'Modify',
        icon: 'arrow_right_corner',
        mode: MODIFY_MODE,
        handle: this.setEditMode.bind(this, MODIFY_MODE)
      },
      {
        text: 'Rotate',
        icon: 'arrow_repeat',
        mode: ROTATE_MODE,
        handle: this.setEditMode.bind(this, ROTATE_MODE)
      },
      {
        text: 'Scale',
        icon: 'resize',
        mode: SCALE_MODE,
        handle: this.setEditMode.bind(this, SCALE_MODE)
      },
      {
        text: 'Split',
        icon: 'focus_horizontal',
        mode: SPLIT_MODE,
        handle: this.setEditMode.bind(this, SPLIT_MODE)
      },
      {
        text: 'Cut',
        icon: 'exclude',
        mode: CUT_MODE,
        handle: this.setCutMode.bind(this)
      }
    ];
    
    return <React.Fragment>
      <GlobalHotKeys keyMap={keyMap} handlers={handleKeyPress}>
        <DeckGL
          width="100%"
          height="100%"
          initialViewState={this.props.viewport}
          onViewStateChange={({viewState}) => this.setState({ viewport: viewState })}
          // getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          onClick={this.handleDeckClick.bind(this)}
          pickingRadius={5}
          layers={[editableGeoJsonLayer, this.baseLayer]}
          controller={true}>
          {this.renderStaticMap(this.state.viewport)}
        </DeckGL>
      </GlobalHotKeys>
      <ControlPlanel toggles={toggles} mode={this.state.mode} />
      <SideBar
        index={this.state.currentIndex}
        feature={this.currentGeoJson}
        setCurrentGeoJson={this.setCurrentGeoJson.bind(this)}
        setBaseGeom={this.setBaseGeom.bind(this)}
        exportGeoJson={this.exportGeoJson.bind(this)}
      />
    </React.Fragment>;
  }
}

