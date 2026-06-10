const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'property.json');

app.use(express.json({ limit: '500mb' })); // import archives bundle all photos as base64
app.use(express.static(path.join(__dirname, 'public')));

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      plan: {
        owner: {
          accountNumber: '', name: '', address: '', cityStateZip: '',
          phone: '', tractName: '', majorityCounty: '', additionalCounties: ''
        },
        property: {
          legalDescription: '', location: '',
          highFence: 'no', highFenceDescription: '',
          totalAcreage: '', ecoregion: '',
          habitatTypes: {
            cropland: false, croplandAcres: '',
            bottomlandRiparian: false, bottomlandRiparianAcres: '',
            wetlands: false, wetlandsAcres: '',
            nonNativePasture: false, nonNativePastureAcres: '',
            pastureGrassland: false, pastureGrasslandAcres: '',
            timberlands: false, timberlandsAcres: '',
            nativeRangeBrush: false, nativeRangeBrushAcres: '',
            other: false, otherDescription: '', otherAcres: ''
          }
        },
        species: {
          deer: false, turkey: false, quail: false, songbirds: false,
          waterfowl: false, doves: false, bats: false,
          neotropical: false, neotropical_list: '',
          reptiles: false, reptiles_list: '',
          amphibians: false, amphibians_list: '',
          smallMammals: false, smallMammals_list: '',
          insects: false, insects_list: '',
          speciesOfConcern: false, speciesOfConcern_list: '',
          other: false, other_list: ''
        },
        goals: '',
        qualifyingActivities: {
          habitatControl: false, erosionControl: false, predatorControl: false,
          censusCountsPopulation: false, supplementalWater: false,
          supplementalFood: false, supplementalShelter: false
        },
        deerManagement: {
          huntingIncluded: false,
          huntingType: '',
          harvestHistory: [
            { year: '', bucks: '', does: '' },
            { year: '', bucks: '', does: '' },
            { year: '', bucks: '', does: '' }
          ],
          targetDensity: '', targetSexRatio: '', targetProduction: '',
          otherGoals: '', harvestStrategy: ''
        },
        association: {
          managementAssociation: false, propertyAssociation: false,
          associationName: ''
        }
      },
      activities: {
        habitatControl: {
          grazingManagement: false, grazingSystem: '',
          grazingSystemOther: '', grazingInfo: '',
          prescribedBurning: false, burnAcres: '', burnDate: '', burnInfo: '',
          rangeEnhancement: false, reseededAcres: '', reseededDate: '',
          seedingMethod: '', seedingMixture: '', reseededFertilized: false,
          reseededWeedControl: false, reseededInfo: '',
          brushManagement: false, brushAcres: '', brushMechanical: false,
          brushMechanicalMethods: [], brushChemical: false,
          brushChemicalKind: '', brushChemicalRate: '',
          brushDesign: '', brushStripsWidth: '', brushStripsLength: '', brushInfo: '',
          fenceModification: false, fenceTargetSpecies: '',
          fenceTechnique: '', fenceGapWidth: '', fenceMiles: '', fenceInfo: '',
          riparian: false, riparianFencing: '', riparianDeferment: '',
          riparianDefermentSeason: '', riparianVegetation: false,
          riparianTrees: '', riparianShrubs: '', riparianHerbaceous: '', riparianInfo: '',
          wetlandEnhancement: false, wetlandType: [], wetlandOther: '', wetlandInfo: '',
          habitatProtection: false, habitatProtectionMethods: [],
          habitatProtectionOther: '', habitatProtectionInfo: '',
          prescribedControl: false, prescribedControlVegetation: false,
          prescribedControlAnimals: false, prescribedControlSpecies: '',
          prescribedControlMethod: '', prescribedControlInfo: '',
          wildlifeRestoration: false, restorationHabitat: false,
          restorationWildlife: false, restorationTargetSpecies: '',
          restorationMethod: '', restorationInfo: ''
        },
        erosionControl: {
          pondConstruction: false, pondSurfaceArea: '', pondCubicYards: '',
          pondDamLength: '', pondDate: '', pondInfo: '',
          gullyShaping: false, gullyAcres: '', gullyAcresAnnual: '',
          gullySeedingMix: '', gullyDate: '', gullyInfo: '',
          streamside: false, streamsideTechniques: [], streamsideOther: '',
          streamsideDate: '', streamsideInfo: '',
          plantEstablishment: false, plantEstablishmentMethods: [], plantEstablishmentInfo: '',
          dikeLevee: false, dikeMethods: [], dikeInfo: '',
          waterDiversion: false, waterDiversionType: '', waterDiversionSlope: '',
          waterDiversionLength: '', waterDiversionVegetated: false,
          waterDiversionNative: '', waterDiversionCrop: '', waterDiversionInfo: ''
        },
        predatorControl: {
          fireAnts: false,
          cowbirds: false, cowbirdsMethod: [],
          grackles: false,
          coyotes: false, feralHogs: false, raccoon: false, skunk: false,
          bobcat: false, mountainLion: false, ratSnakes: false, feralCatsDogs: false,
          mammalMethod: [], mammalMethodOther: '', additionalInfo: ''
        },
        supplementalWater: {
          marshWetland: false, marshWetlandTypes: [], marshDate: '', marshInfo: '',
          wellTrough: false, drillNewWell: false, wellDepth: '', wellGPM: '',
          windmill: false, pump: false, pipeline: false, pipelineSize: '', pipelineLength: '',
          modifyExisting: false, modifyMethods: [],
          distanceBetween: '', facilityTypes: {}, facilityInfo: '',
          springDevelopment: false, springMethods: [], springOther: '', springInfo: ''
        },
        supplementalFood: {
          grazingManagement: false, prescribedBurning: false, rangeEnhancement: false,
          foodPlots: false, foodPlotSize: '', foodPlotFenced: false, foodPlotIrrigated: false,
          coolSeasonCrops: false, coolSeasonCropsDetail: '',
          warmSeasonCrops: false, warmSeasonCropsDetail: '',
          annualNativeMix: false, annualNativeMixDetail: '',
          perennialNativeMix: false, perennialNativeMixDetail: '', foodPlotInfo: '',
          feeders: false, feederPurpose: '', feederTargetSpecies: '',
          feedType: '', mineralType: '', feederType: '', feederCount: '',
          mineralMethod: '', mineralLocations: '',
          feederYearRound: false, feederWhen: '', feederInfo: '',
          tamePasture: false, tamePastureOverseeding: false,
          tamePastureDisturbance: false, tamePastureNoTill: false, tamePastureInfo: '',
          tameGrass: false, tameGrassSpecies: [], tameGrassOther: '', tameGrassInfo: ''
        },
        supplementalShelter: {
          nestBoxes: false, nestBoxTargetSpecies: '',
          nestBoxCavity: false, nestBoxCavityCount: '',
          nestBoxBat: false, nestBoxBatCount: '',
          nestBoxRaptor: false, nestBoxRaptorCount: '', nestBoxInfo: '',
          brushPiles: false, brushPileType: [], brushPilePerAcre: '', brushPileInfo: '',
          fenceLineMgmt: false, fenceLineLength: '', fenceLineInitial: false,
          fenceLinePlantTypes: [], fenceLineInfo: '',
          hayMeadow: false, hayMeadowAcres: '', hayMeadowShelterTypes: [],
          hayMeadowVegType: '', hayMeadowSpeciesMix: '',
          deferredMowing: false, deferredMowingPeriod: '',
          mowing: false, mowingAcres: '', noTill: false, hayMeadowInfo: '',
          halfCutting: false, halfCuttingAcres: '', halfCuttingCount: '', halfCuttingInfo: '',
          woodyPlant: false, woodyPattern: '', woodyStripsWidth: '',
          woodyAcresLength: '', woodySpacing: '', woodySpecies: '', woodyInfo: '',
          snagDevelopment: false, snagSpecies: '', snagSize: '',
          snagPerAcre: '', snagInfo: ''
        },
        census: {
          spotlightCounts: false, spotlightSpecies: '', spotlightRouteLength: '',
          spotlightVisibility: '', spotlightDateA: '', spotlightDateB: '',
          spotlightDateC: '', spotlightInfo: '',
          incidentalObservations: false, incidentalSpecies: '',
          incidentalSources: [], incidentalDates: '', incidentalInfo: '',
          standCounts: false, standCountStands: '', standCountDates: '', standCountInfo: '',
          aerialCounts: false, aerialSpecies: '', aerialType: '', aerialCoverage: '',
          aerialCoverageOther: '', aerialInfo: '',
          trackCounts: false, trackCountTypes: [], trackCountInfo: '',
          daylightCounts: false, daylightSpecies: [], daylightInfo: '',
          harvestData: false, harvestTypes: [], harvestAttributes: [], harvestInfo: '',
          browseUtilization: false, browseInfo: '',
          endangeredCensus: false, endangeredSpecies: '', endangeredMethod: '', endangeredInfo: '',
          nongameCensus: false, nongameSpecies: '', nongameMethod: '', nongameInfo: '',
          miscCounts: false, miscSpecies: '', miscMethods: [], miscInfo: ''
        }
      },
      reports: {},
      log: []
    };
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return migrateData(defaultData);
  }
  return migrateData(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
}

// Fill in any keys added since the data file was created — also covers the
// freshly regenerated defaults after Clear All Data (photoQuality: balanced)
function migrateData(d) {
  if (!d.log) d.log = [];
  if (!d.propertyImages) d.propertyImages = [];
  if (!d.routes) d.routes = [];
  if (!d.settings) d.settings = {};
  if (!d.settings.photoQuality) d.settings.photoQuality = 'balanced';
  return d;
}

function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/data', (req, res) => {
  res.json(loadData());
});

app.post('/api/data', (req, res) => {
  saveData(req.body);
  res.json({ ok: true });
});

app.get('/api/years', (req, res) => {
  const data = loadData();
  res.json(Object.keys(data.reports || {}).sort().reverse());
});

app.post('/api/reports/:year', (req, res) => {
  const data = loadData();
  if (!data.reports) data.reports = {};
  data.reports[req.params.year] = req.body;
  saveData(data);
  res.json({ ok: true });
});

app.delete('/api/reports/:year', (req, res) => {
  const data = loadData();
  if (!data.reports || !data.reports[req.params.year]) {
    return res.status(404).json({ error: 'Report not found' });
  }
  delete data.reports[req.params.year];
  saveData(data);
  res.json({ ok: true });
});

// ── Log API ──

const PHOTOS_DIR = path.join(__dirname, 'data', 'photos');

app.use('/photos', express.static(PHOTOS_DIR));

app.get('/api/log', (req, res) => {
  const data = loadData();
  res.json(data.log || []);
});

app.post('/api/log', (req, res) => {
  const data = loadData();
  const entry = req.body;
  entry.id = String(Date.now());
  data.log.push(entry);
  saveData(data);
  res.json({ ok: true, id: entry.id });
});

app.put('/api/log/:id', (req, res) => {
  const data = loadData();
  const idx = data.log.findIndex(function(e) { return e.id === req.params.id; });
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  data.log[idx] = req.body;
  data.log[idx].id = req.params.id;
  saveData(data);
  res.json({ ok: true });
});

app.delete('/api/log/:id', (req, res) => {
  const data = loadData();
  const entry = data.log.find(function(e) { return e.id === req.params.id; });
  if (entry && entry.photos) {
    entry.photos.forEach(function(f) {
      var fp = path.join(PHOTOS_DIR, f);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
      var tp = path.join(PHOTOS_DIR, 'thumb-' + f);
      if (fs.existsSync(tp)) fs.unlinkSync(tp);
    });
  }
  data.log = data.log.filter(function(e) { return e.id !== req.params.id; });
  saveData(data);
  res.json({ ok: true });
});

app.post('/api/photos', (req, res) => {
  var dataUrl = req.body.dataUrl || '';
  var origName = req.body.filename || 'photo.jpg';
  var ext = origName.split('.').pop().toLowerCase() || 'jpg';
  var id = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
  var base64 = dataUrl.replace(/^data:image\/[^;]+;base64,/, '');
  if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  fs.writeFileSync(path.join(PHOTOS_DIR, id), Buffer.from(base64, 'base64'));
  // Small thumbnail (generated client-side) saved alongside as thumb-<id>
  var thumbUrl = req.body.thumbUrl || '';
  if (thumbUrl) {
    var thumb64 = thumbUrl.replace(/^data:image\/[^;]+;base64,/, '');
    fs.writeFileSync(path.join(PHOTOS_DIR, 'thumb-' + id), Buffer.from(thumb64, 'base64'));
  }
  res.json({ ok: true, filename: id });
});

app.delete('/api/photos/:filename', (req, res) => {
  var fp = path.join(PHOTOS_DIR, req.params.filename);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  var tp = path.join(PHOTOS_DIR, 'thumb-' + req.params.filename);
  if (fs.existsSync(tp)) fs.unlinkSync(tp);
  res.json({ ok: true });
});

// ── Property images (settings) ──
// Past images are kept forever so historic events can still reference them.

const PROPERTY_IMAGES_DIR = path.join(__dirname, 'data', 'property-images');

app.use('/property-images', express.static(PROPERTY_IMAGES_DIR));

app.get('/api/property-images', (req, res) => {
  const data = loadData();
  res.json({ images: data.propertyImages, currentId: data.currentPropertyImageId || null });
});

app.post('/api/property-images', (req, res) => {
  var dataUrl = req.body.dataUrl || '';
  var origName = req.body.filename || 'property.jpg';
  var ext = origName.split('.').pop().toLowerCase() || 'jpg';
  var id = Date.now() + '-' + Math.random().toString(36).slice(2);
  var filename = id + '.' + ext;
  var base64 = dataUrl.replace(/^data:image\/[^;]+;base64,/, '');
  if (!fs.existsSync(PROPERTY_IMAGES_DIR)) fs.mkdirSync(PROPERTY_IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(PROPERTY_IMAGES_DIR, filename), Buffer.from(base64, 'base64'));
  var thumbUrl = req.body.thumbUrl || '';
  if (thumbUrl) {
    var thumb64 = thumbUrl.replace(/^data:image\/[^;]+;base64,/, '');
    fs.writeFileSync(path.join(PROPERTY_IMAGES_DIR, 'thumb-' + filename), Buffer.from(thumb64, 'base64'));
  }

  const data = loadData();
  data.propertyImages.push({
    id: id, filename: filename, name: origName,
    uploadedAt: new Date().toISOString()
  });
  data.currentPropertyImageId = id;
  saveData(data);
  res.json({ ok: true, id: id, filename: filename });
});

app.post('/api/property-images/:id/activate', (req, res) => {
  const data = loadData();
  const img = data.propertyImages.find(function(i) { return i.id === req.params.id; });
  if (!img) return res.status(404).json({ error: 'Image not found' });
  data.currentPropertyImageId = img.id;
  saveData(data);
  res.json({ ok: true });
});

// ── Routes (census survey routes drawn on a property image) ──

app.get('/api/routes', (req, res) => {
  const data = loadData();
  res.json(data.routes);
});

app.post('/api/routes', (req, res) => {
  const data = loadData();
  const route = {
    id: String(Date.now()),
    name: req.body.name || 'Unnamed Route',
    imageId: req.body.imageId || null,
    points: req.body.points || [], // [{x, y}] as 0-1 fractions of the image
    createdAt: new Date().toISOString()
  };
  data.routes.push(route);
  saveData(data);
  res.json(route);
});

app.put('/api/routes/:id', (req, res) => {
  const data = loadData();
  const route = data.routes.find(function(r) { return r.id === req.params.id; });
  if (!route) return res.status(404).json({ error: 'Route not found' });
  if (req.body.name !== undefined) route.name = req.body.name;
  if (req.body.points !== undefined) route.points = req.body.points;
  saveData(data);
  res.json(route);
});

app.delete('/api/routes/:id', (req, res) => {
  const data = loadData();
  data.routes = data.routes.filter(function(r) { return r.id !== req.params.id; });
  saveData(data);
  res.json({ ok: true });
});

// ── Data export / import / clear ──
// Archive format: a single JSON file holding property.json plus every photo
// and property image base64-encoded. `version` gates what imports we accept.

const EXPORT_FORMAT = 'wildlife-mgmt-export';
const EXPORT_VERSION = 1;
const SUPPORTED_IMPORT_VERSIONS = [1];

function readDirBase64(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir).forEach(function(f) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isFile()) out[f] = fs.readFileSync(fp).toString('base64');
  });
  return out;
}

function writeDirBase64(map, dir, skipExisting) {
  if (!map) return;
  fs.mkdirSync(dir, { recursive: true });
  Object.keys(map).forEach(function(f) {
    const fp = path.join(dir, path.basename(f));
    if (skipExisting && fs.existsSync(fp)) return;
    fs.writeFileSync(fp, Buffer.from(map[f], 'base64'));
  });
}

function clearDir(dir) {
  if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true });
}

app.get('/api/export', (req, res) => {
  const archive = {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: loadData(),
    files: {
      photos: readDirBase64(PHOTOS_DIR),
      'property-images': readDirBase64(PROPERTY_IMAGES_DIR)
    }
  };
  const fname = 'wildlife-mgmt-backup-v' + EXPORT_VERSION + '-' + new Date().toISOString().slice(0, 10) + '.json';
  res.setHeader('Content-Disposition', 'attachment; filename="' + fname + '"');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(archive));
});

app.post('/api/import', (req, res) => {
  const archive = req.body.archive;
  const mode = req.body.mode; // 'replace' | 'append'
  if (!archive || archive.format !== EXPORT_FORMAT) {
    return res.status(400).json({ error: 'Not a Wildlife Management Tool export file.' });
  }
  if (SUPPORTED_IMPORT_VERSIONS.indexOf(archive.version) === -1) {
    return res.status(400).json({ error: 'Unsupported export version ' + archive.version + '. This app supports: ' + SUPPORTED_IMPORT_VERSIONS.join(', ') + '.' });
  }
  const files = archive.files || {};
  const summary = { log: 0, reports: 0, propertyImages: 0, routes: 0 };

  if (mode === 'replace') {
    clearDir(PHOTOS_DIR);
    clearDir(PROPERTY_IMAGES_DIR);
    saveData(archive.data || {});
    writeDirBase64(files.photos, PHOTOS_DIR, false);
    writeDirBase64(files['property-images'], PROPERTY_IMAGES_DIR, false);
    const d = archive.data || {};
    summary.log = (d.log || []).length;
    summary.reports = Object.keys(d.reports || {}).length;
    summary.propertyImages = (d.propertyImages || []).length;
    summary.routes = (d.routes || []).length;
  } else {
    const cur = loadData();
    const inc = archive.data || {};
    (inc.log || []).forEach(function(e) {
      // Same id = same entry (ids are creation timestamps) — skip so
      // importing the same archive twice doesn't duplicate everything
      if (cur.log.some(function(x) { return x.id === e.id; })) return;
      cur.log.push(e);
      summary.log++;
    });
    if (!cur.reports) cur.reports = {};
    Object.keys(inc.reports || {}).forEach(function(y) {
      if (!cur.reports[y]) { cur.reports[y] = inc.reports[y]; summary.reports++; }
    });
    (inc.propertyImages || []).forEach(function(img) {
      if (!cur.propertyImages.some(function(x) { return x.id === img.id; })) {
        cur.propertyImages.push(img);
        summary.propertyImages++;
      }
    });
    if (!cur.currentPropertyImageId && inc.currentPropertyImageId) {
      cur.currentPropertyImageId = inc.currentPropertyImageId;
    }
    (inc.routes || []).forEach(function(r) {
      if (!cur.routes.some(function(x) { return x.id === r.id; })) {
        cur.routes.push(r);
        summary.routes++;
      }
    });
    saveData(cur);
    writeDirBase64(files.photos, PHOTOS_DIR, true);
    writeDirBase64(files['property-images'], PROPERTY_IMAGES_DIR, true);
  }
  res.json({ ok: true, mode: mode, summary: summary });
});

app.post('/api/clear-data', (req, res) => {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  clearDir(PHOTOS_DIR);
  clearDir(PROPERTY_IMAGES_DIR);
  res.json({ ok: true });
});

// ── App settings ──

app.get('/api/settings', (req, res) => {
  res.json(loadData().settings);
});

app.post('/api/settings', (req, res) => {
  const data = loadData();
  Object.keys(req.body || {}).forEach(function(k) { data.settings[k] = req.body[k]; });
  saveData(data);
  res.json(data.settings);
});

// Serve the settings page
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Serve the log page
app.get('/log', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'log.html'));
});

// Serve the plan form
app.get('/plan', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'plan.html'));
});

// Serve the annual report form
app.get('/report/:year', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'report.html'));
});

// ── Print helper functions (server-side equivalents of public/print-helpers.js) ──

function esc(v) {
  if (!v) return '';
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function cb(checked) {
  return `<span class="box-check${checked ? ' checked' : ''}"></span>`;
}

function cbItem(label, checked) {
  return `<div class="cb">${cb(checked)} ${esc(label)}</div>`;
}

function field(label, value, style) {
  style = style || '';
  return `<div class="field" style="${style}"><label>${label}</label><div class="line">${esc(value) || '&nbsp;'}</div></div>`;
}

function fieldMulti(label, value) {
  return `<div class="field"><label>${label}</label><div class="multiline">${esc(value) || '&nbsp;'}</div></div>`;
}

function renderOwner(owner) {
  return `
    <div class="box">
      <div class="field-row">
        <div class="field"><label>Owner's Name</label><div class="line">${esc(owner.name)}</div></div>
        <div class="field"><label>Account Number</label><div class="line">${esc(owner.accountNumber)}</div></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Current Mailing Address</label><div class="line">${esc(owner.address)}</div></div>
      </div>
      <div class="field-row">
        <div class="field" style="flex:2"><label>City, Town, Post Office, State and Zip Code</label><div class="line">${esc(owner.cityStateZip)}</div></div>
        <div class="field"><label>Phone Number</label><div class="line">${esc(owner.phone)}</div></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Tract Name</label><div class="line">${esc(owner.tractName)}</div></div>
        <div class="field"><label>Majority County</label><div class="line">${esc(owner.majorityCounty)}</div></div>
        <div class="field"><label>Additional Counties (if any)</label><div class="line">${esc(owner.additionalCounties)}</div></div>
      </div>
    </div>`;
}

function renderQualifying(qa) {
  return `
    <div class="box">
      <div class="checkbox-row" style="flex-direction:column;gap:5pt">
        ${cbItem('Habitat control', qa.habitatControl)}
        ${cbItem('Erosion control', qa.erosionControl)}
        ${cbItem('Predator control', qa.predatorControl)}
        ${cbItem('Making census counts to determine population.', qa.censusCountsPopulation)}
        ${cbItem('Provide supplemental supplies of water', qa.supplementalWater)}
        ${cbItem('Provide supplemental supplies of food', qa.supplementalFood)}
        ${cbItem('Provide shelters', qa.supplementalShelter)}
      </div>
    </div>`;
}

function activityRow(label, checked, detailHtml) {
  return `
    <div style="margin-bottom:6pt; padding-bottom:5pt; border-bottom:0.5pt solid #ddd;">
      <div class="cb" style="font-weight:${checked?'700':'400'}">${cb(checked)} <em>${esc(label)}</em></div>
      ${checked ? detailHtml : ''}
    </div>`;
}

function renderActivitiesPrint(a) {
  var hc = a.habitatControl || {};
  var ec = a.erosionControl || {};
  var pc = a.predatorControl || {};
  var sw = a.supplementalWater || {};
  var sf = a.supplementalFood || {};
  var ss = a.supplementalShelter || {};
  var ce = a.census || {};

  return `
    <!-- Habitat Control -->
    <div class="activity-block">
      <div class="activity-header">1. HABITAT CONTROL</div>
      <div class="activity-body">
        ${activityRow('Grazing Management', hc.grazingManagement, `
          <div class="indent">
            <div class="checkbox-row">
              ${cbItem('1 herd/3 pasture', hc.grazingSystem==='1herd3pasture')}
              ${cbItem('1 herd/4 pasture', hc.grazingSystem==='1herd4pasture')}
              ${cbItem('1 herd/multiple pasture', hc.grazingSystem==='1herdMultiple')}
              ${cbItem('High intensity/low frequency (HILF)', hc.grazingSystem==='hilf')}
              ${cbItem('Short duration system', hc.grazingSystem==='shortDuration')}
              ${cbItem('Other', hc.grazingSystem==='other')}
            </div>
            <div style="margin-top:3pt"><em>Additional Information:</em> ${esc(hc.grazingInfo)}</div>
          </div>`)}
        ${activityRow('Prescribed Burning', hc.prescribedBurning, `
          <div class="indent field-row">
            ${field('Acres to be burned', hc.burnAcres)}
            ${field('Planned burn date', hc.burnDate)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(hc.burnInfo)}</div>`)}
        ${activityRow('Range Enhancement (Range Reseeding)', hc.rangeEnhancement, `
          <div class="indent field-row">
            ${field('Acres to be seeded', hc.reseededAcres)}
            ${field('Date to be seeded', hc.reseededDate)}
          </div>
          <div class="indent" style="margin-top:3pt">
            Seeding Method: ${cbItem('Broadcast', hc.seedingMethod==='broadcast')} ${cbItem('Drilled', hc.seedingMethod==='drilled')} ${cbItem('Native Hay', hc.seedingMethod==='nativeHay')}
          </div>
          <div class="indent field-row" style="margin-top:3pt">
            ${field('Seeding mixture', hc.seedingMixture)}
            <div class="field">Fertilized: ${cbItem('Yes', String(hc.reseededFertilized)==='true')} ${cbItem('No', String(hc.reseededFertilized)==='false')}</div>
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(hc.reseededInfo)}</div>`)}
        ${activityRow('Brush Management', hc.brushManagement, `
          <div class="indent field-row">
            ${field('Acres to be treated', hc.brushAcres)}
            <div class="field">
              ${cbItem('Mechanical', hc.brushMechanical)}
              ${cbItem('Chemical', hc.brushChemical)}
            </div>
          </div>
          <div class="indent"><em>Methods/Details:</em> ${esc(hc.brushMechanicalDetail)}</div>
          <div class="indent field-row">
            ${field('Chemical kind', hc.brushChemicalKind)}
            ${field('Rate', hc.brushChemicalRate)}
            ${field('Design', hc.brushDesign)}
            ${field('Width', hc.brushStripsWidth)}
            ${field('Length', hc.brushStripsLength)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(hc.brushInfo)}</div>`)}
        ${activityRow('Fence Modification', hc.fenceModification, `
          <div class="indent">${esc(hc.fenceInfo)}</div>`)}
        ${activityRow('Riparian Management and Enhancement', hc.riparian, `
          <div class="indent">
            Fencing: ${cbItem('Complete', hc.riparianFencing==='complete')} ${cbItem('Partial', hc.riparianFencing==='partial')}
            &nbsp; Deferment: ${cbItem('Complete', hc.riparianDeferment==='complete')} ${cbItem('Partial', hc.riparianDeferment==='partial')}
            &nbsp; Season deferred: ${esc(hc.riparianDefermentSeason)}
          </div>
          <div class="indent field-row" style="margin-top:3pt">
            ${field('Trees', hc.riparianTrees)}
            ${field('Shrubs', hc.riparianShrubs)}
            ${field('Herbaceous', hc.riparianHerbaceous)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(hc.riparianInfo)}</div>`)}
        ${activityRow('Wetland Enhancement', hc.wetlandEnhancement, `
          <div class="indent checkbox-row">
            ${cbItem('Provide seasonal water', hc.wetlandSeasonal)}
            ${cbItem('Provide permanent water', hc.wetlandPermanent)}
            ${cbItem('Moist soil management', hc.wetlandMoistSoil)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(hc.wetlandInfo)}</div>`)}
        ${activityRow('Habitat Protection for Species of Concern', hc.habitatProtection, `
          <div class="indent checkbox-row">
            ${cbItem('Fencing', hc.hpFencing)} ${cbItem('Firebreaks', hc.hpFirebreaks)}
            ${cbItem('Prescribed burning', hc.hpBurning)} ${cbItem('Control of nest parasites', hc.hpNestParasites)}
            ${cbItem('Habitat manipulation', hc.hpHabManip)} ${cbItem('Native/exotic ungulate control', hc.hpUngulate)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(hc.habitatProtectionInfo)}</div>`)}
        ${activityRow('Prescribed Control of Native, Exotic and Feral Species', hc.prescribedControl, `
          <div class="indent checkbox-row">
            ${cbItem('Control of vegetation', hc.prescribedControlVegetation)}
            ${cbItem('Control of animal species', hc.prescribedControlAnimals)}
          </div>
          <div class="indent field-row">
            ${field('Species being controlled', hc.prescribedControlSpecies)}
            ${field('Method of control', hc.prescribedControlMethod)}
          </div>`)}
        ${activityRow('Wildlife Restoration', hc.wildlifeRestoration, `
          <div class="indent checkbox-row">
            ${cbItem('Habitat restoration', hc.restorationHabitat)}
            ${cbItem('Wildlife restoration', hc.restorationWildlife)}
          </div>
          <div class="indent field-row">
            ${field('Target species', hc.restorationTargetSpecies)}
            ${field('Method', hc.restorationMethod)}
          </div>`)}
      </div>
    </div>

    <!-- Erosion Control -->
    <div class="activity-block">
      <div class="activity-header">2. EROSION CONTROL</div>
      <div class="activity-body">
        ${activityRow('Pond Construction and Repair', ec.pondConstruction, `
          <div class="indent field-row">
            ${field('Surface area (acres)', ec.pondSurfaceArea)}
            ${field('Cubic yards of soil', ec.pondCubicYards)}
            ${field('Dam length (ft)', ec.pondDamLength)}
            ${field('Planned date', ec.pondDate)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(ec.pondInfo)}</div>`)}
        ${activityRow('Gully Shaping', ec.gullyShaping, `
          <div class="indent field-row">
            ${field('Total acres', ec.gullyAcres)}
            ${field('Acres annually', ec.gullyAcresAnnual)}
            ${field('Planned date', ec.gullyDate)}
          </div>
          <div class="indent">${field('Seeding mix', ec.gullySeedingMix)}</div>`)}
        ${activityRow('Streamside, Pond, and Wetland Revegetation', ec.streamside, `
          <div class="indent checkbox-row">
            ${cbItem('Native hay bales', ec.streamsideHayBales)}
            ${cbItem('Fencing', ec.streamsideFencing)}
            ${cbItem('Filter strips', ec.streamsideFilterStrips)}
            ${cbItem('Seeding upland buffer', ec.streamsideUplandBuffer)}
            ${cbItem('Rip-rap', ec.streamsideRiprap)}
            ${cbItem('Stream crossings', ec.streamsideCrossings)}
          </div>
          <div class="indent field-row">
            ${field('Other', ec.streamsideOther)}
            ${field('Planned date', ec.streamsideDate)}
          </div>`)}
        ${activityRow('Herbaceous/Woody Plant Establishment on Critical Areas', ec.plantEstablishment, `
          <div class="indent checkbox-row">
            ${cbItem('Establish windbreak', ec.peWindbreak)}
            ${cbItem('Establish shrub mottes', ec.peShrubMottes)}
            ${cbItem('Improve plant diversity', ec.pePlantDiversity)}
            ${cbItem('Improve wildlife habitat', ec.peWildlifeHabitat)}
            ${cbItem('Conservation/no-till', ec.peNoTill)}
            ${cbItem('Manage CRP cover', ec.peCRP)}
          </div>`)}
        ${activityRow('Dike/Levee Construction/Management', ec.dikeLevee, `
          <div class="indent checkbox-row">
            ${cbItem('Reshaping/repairing', ec.dikeReshaping)}
            ${cbItem('Revegetating/stabilize', ec.dikeReveg)}
            ${cbItem('Install water control structure', ec.dikeWaterControl)}
            ${cbItem('Fencing', ec.dikeFencing)}
          </div>`)}
        ${activityRow('Establish Water Diversion', ec.waterDiversion, `
          <div class="indent">
            Type: ${cbItem('Channel', ec.waterDiversionType==='channel')} ${cbItem('Ridge', ec.waterDiversionType==='ridge')}
            &nbsp; Slope: ${cbItem('Level', ec.waterDiversionSlope==='level')} ${cbItem('Graded', ec.waterDiversionSlope==='graded')}
            &nbsp; Length: ${esc(ec.waterDiversionLength)} ft
          </div>
          <div class="indent field-row" style="margin-top:3pt">
            ${field('Native vegetation', ec.waterDiversionNative)}
            ${field('Crop', ec.waterDiversionCrop)}
          </div>`)}
      </div>
    </div>

    <!-- Predator Control -->
    <div class="activity-block">
      <div class="activity-header">3. PREDATOR CONTROL</div>
      <div class="activity-body">
        <div class="checkbox-row">
          ${cbItem('Imported red fire ants', pc.fireAnts)}
          ${cbItem('Control of cowbirds', pc.cowbirds)}
          ${cbItem('Grackle/starling/house sparrow control', pc.grackles)}
        </div>
        <div style="margin:3pt 0">Bird control method:
          <span class="checkbox-row" style="display:inline-flex">
            ${cbItem('Trapping', pc.birdTrapping)}
            ${cbItem('Shooting', pc.birdShooting)}
            ${cbItem('Baiting', pc.birdBaiting)}
            ${cbItem('Scare tactics', pc.birdScare)}
          </span>
        </div>
        <div class="checkbox-row">
          ${cbItem('Coyotes', pc.coyotes)} ${cbItem('Feral hogs', pc.feralHogs)}
          ${cbItem('Raccoon', pc.raccoon)} ${cbItem('Skunk', pc.skunk)}
          ${cbItem('Bobcat', pc.bobcat)} ${cbItem('Mountain lion', pc.mountainLion)}
          ${cbItem('Rat snakes', pc.ratSnakes)} ${cbItem('Feral cats/dogs', pc.feralCatsDogs)}
        </div>
        <div style="margin:3pt 0">Mammal control method:
          <span class="checkbox-row" style="display:inline-flex">
            ${cbItem('Trapping', pc.mammalTrapping)}
            ${cbItem('Shooting', pc.mammalShooting)}
            ${cbItem('M-44 (licensed)', pc.mammalM44)}
            ${cbItem('Poison collars (1080)', pc.mammalPoison)}
          </span>
        </div>
        <div><em>Additional Information:</em> ${esc(pc.additionalInfo)}</div>
      </div>
    </div>

    <!-- Supplemental Water -->
    <div class="activity-block">
      <div class="activity-header">4. SUPPLEMENTAL WATER</div>
      <div class="activity-body">
        ${activityRow('Marsh/Wetland Restoration or Development', sw.marshWetland, `
          <div class="indent checkbox-row">
            ${cbItem('Greentree reservoirs', sw.mwGreentree)}
            ${cbItem('Shallow roost pond', sw.mwRoostPond)}
            ${cbItem('Seasonally flooded crops', sw.mwFloodedCrops)}
            ${cbItem('Artificially created wetlands', sw.mwArtificial)}
            ${cbItem('Marsh restoration/development/protection', sw.mwMarshRestore)}
            ${cbItem('Prairie pothole restoration', sw.mwPrairiePothole)}
            ${cbItem('Moist soil management units', sw.mwMoistSoil)}
          </div>
          <div class="indent">${field('Planned date', sw.marshDate)}</div>`)}
        ${activityRow('Well/Trough/Windmill/Other Wildlife Watering Facilities', sw.wellTrough, `
          <div class="indent checkbox-row">
            ${cbItem('Drill new well', sw.drillNewWell)}
            ${cbItem('Windmill', sw.windmill)}
            ${cbItem('Pump', sw.pump)}
            ${cbItem('Pipeline', sw.pipeline)}
          </div>
          <div class="indent field-row">
            ${field('Depth', sw.wellDepth)} ${field('GPM', sw.wellGPM)}
            ${field('Pipeline size', sw.pipelineSize)} ${field('Pipeline length', sw.pipelineLength)}
          </div>
          <div class="indent">${field('Modifications to existing source', sw.modifyDetail)}</div>
          <div class="indent">${field('Distance between water sources', sw.distanceBetween)}</div>
          <div class="indent">${fieldMulti('Wildlife watering facilities/types', sw.facilityInfo)}</div>`)}
        ${activityRow('Spring Development and/or Enhancement', sw.springDevelopment, `
          <div class="indent checkbox-row">
            ${cbItem('Fencing', sw.springFencing)}
            ${cbItem('Water diversion/pipeline', sw.springDiversion)}
            ${cbItem('Brush removal', sw.springBrushRemoval)}
            ${cbItem('Spring clean out', sw.springCleanOut)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(sw.springInfo)}</div>`)}
      </div>
    </div>

    <!-- Supplemental Food -->
    <div class="activity-block">
      <div class="activity-header">5. PROVIDING SUPPLEMENTAL FOOD</div>
      <div class="activity-body">
        <div class="checkbox-row">
          ${cbItem('Grazing management', sf.grazingManagement)}
          ${cbItem('Prescribed burning', sf.prescribedBurning)}
          ${cbItem('Range enhancement', sf.rangeEnhancement)}
        </div>
        ${activityRow('Food Plots', sf.foodPlots, `
          <div class="indent field-row">
            ${field('Size', sf.foodPlotSize)}
            <div class="field">Fenced: ${cbItem('Yes', String(sf.foodPlotFenced)==='true')} ${cbItem('No', String(sf.foodPlotFenced)==='false')}</div>
            <div class="field">Irrigated: ${cbItem('Yes', String(sf.foodPlotIrrigated)==='true')} ${cbItem('No', String(sf.foodPlotIrrigated)==='false')}</div>
          </div>
          <div class="indent field-row">
            ${field('Cool season annual crops', sf.coolSeasonCropsDetail)}
            ${field('Warm season annual crops', sf.warmSeasonCropsDetail)}
          </div>
          <div class="indent field-row">
            ${field('Annual mix of native plants', sf.annualNativeMixDetail)}
            ${field('Perennial mix of native plants', sf.perennialNativeMixDetail)}
          </div>`)}
        ${activityRow('Feeders and Mineral Supplementation', sf.feeders, `
          <div class="indent">
            Purpose: ${cbItem('Supplementation', sf.feederPurpose==='supplementation')} ${cbItem('Harvesting of wildlife', sf.feederPurpose==='harvesting')}
          </div>
          <div class="indent field-row">
            ${field('Targeted species', sf.feederTargetSpecies)}
            ${field('Feed type', sf.feedType)}
            ${field('Mineral type', sf.mineralType)}
          </div>
          <div class="indent field-row">
            ${field('Feeder type', sf.feederType)}
            ${field('# feeders', sf.feederCount)}
            ${field('Mineral method', sf.mineralMethod)}
            ${field('# mineral locations', sf.mineralLocations)}
          </div>
          <div class="indent">
            Year round: ${cbItem('Yes', String(sf.feederYearRound)==='true')} ${cbItem('No', String(sf.feederYearRound)==='false')}
            &nbsp; If not: ${esc(sf.feederWhen)}
          </div>`)}
        ${activityRow('Managing Tame Pasture, Old Fields and Croplands', sf.tamePasture, `
          <div class="indent checkbox-row">
            ${cbItem('Overseeding legumes/small grains', sf.tamePastureOverseeding)}
            ${cbItem('Periodic disturbance', sf.tamePastureDisturbance)}
            ${cbItem('Conservation/no-till', sf.tamePastureNoTill)}
          </div>`)}
        ${activityRow('Transition Management of Tame Grass Monocultures', sf.tameGrass, `
          <div class="indent">
            Species: ${cbItem('Clover', sf.tameGrassClover)} ${cbItem('Peas', sf.tameGrassPeas)} ${cbItem('Vetch', sf.tameGrassVetch)}
            &nbsp; Other: ${esc(sf.tameGrassInfo)}
          </div>`)}
      </div>
    </div>

    <!-- Supplemental Shelter -->
    <div class="activity-block">
      <div class="activity-header">6. PROVIDING SUPPLEMENTAL SHELTER</div>
      <div class="activity-body">
        ${activityRow('Nest Boxes', ss.nestBoxes, `
          <div class="indent field-row">
            ${field('Target species', ss.nestBoxTargetSpecies)}
          </div>
          <div class="indent">
            ${cbItem('Cavity type', ss.nestBoxCavity)} # ${esc(ss.nestBoxCavityCount)}
            &nbsp; ${cbItem('Bat boxes', ss.nestBoxBat)} # ${esc(ss.nestBoxBatCount)}
            &nbsp; ${cbItem('Raptor pole', ss.nestBoxRaptor)} # ${esc(ss.nestBoxRaptorCount)}
          </div>`)}
        ${activityRow('Brush Piles and Slash Retention', ss.brushPiles, `
          <div class="indent">
            ${cbItem('Slash', ss.brushPileType==='slash')} ${cbItem('Brush piles', ss.brushPileType==='brushPiles')}
            &nbsp; Number per acre: ${esc(ss.brushPilePerAcre)}
          </div>`)}
        ${activityRow('Fence Line Management', ss.fenceLineMgmt, `
          <div class="indent field-row">
            ${field('Length', ss.fenceLineLength)}
            <div class="field">Initial establishment: ${cbItem('Yes', String(ss.fenceLineInitial)==='true')} ${cbItem('No', String(ss.fenceLineInitial)==='false')}</div>
          </div>
          <div class="indent">
            Plant type: ${cbItem('Trees', ss.flTrees)} ${cbItem('Shrubs', ss.flShrubs)} ${cbItem('Forbs', ss.flForbs)} ${cbItem('Grasses', ss.flGrasses)}
          </div>`)}
        ${activityRow('Hay Meadow, Pasture and Cropland Management for Wildlife', ss.hayMeadow, `
          <div class="indent field-row">
            ${field('Acres treated', ss.hayMeadowAcres)}
            <div class="field">
              ${cbItem('Roadside mgmt', ss.hmRoadside)} ${cbItem('Terrace/wind breaks', ss.hmTerrace)}
              ${cbItem('Field borders', ss.hmFieldBorders)} ${cbItem('Shelterbelts', ss.hmShelterbelts)}
              ${cbItem('CRP mgmt', ss.hmCRP)}
            </div>
          </div>
          <div class="indent">
            Veg type: ${cbItem('Annual', ss.hayMeadowVegType==='annual')} ${cbItem('Perennial', ss.hayMeadowVegType==='perennial')}
            &nbsp; ${field('Species/mixture', ss.hayMeadowSpeciesMix)}
          </div>
          <div class="indent">
            ${cbItem('Deferred mowing', ss.deferredMowing)} Period: ${esc(ss.deferredMowingPeriod)}
            &nbsp; ${cbItem('Mowing', ss.mowing)} Acres: ${esc(ss.mowingAcres)}
            &nbsp; ${cbItem('No till/minimum till', ss.noTill)}
          </div>`)}
        ${activityRow('Half-Cutting Trees or Shrubs', ss.halfCutting, `
          <div class="indent field-row">
            ${field('Acreage treated annually', ss.halfCuttingAcres)}
            ${field('Number of half-cuts annually', ss.halfCuttingCount)}
          </div>`)}
        ${activityRow('Woody Plant/Shrub Establishment', ss.woodyPlant, `
          <div class="indent">
            Pattern: ${cbItem('Block', ss.woodyPattern==='block')} ${cbItem('Mosaic', ss.woodyPattern==='mosaic')} ${cbItem('Strips', ss.woodyPattern==='strips')}
          </div>
          <div class="indent field-row">
            ${field('Acreage/length', ss.woodyAcresLength)}
            ${field('Spacing', ss.woodySpacing)}
            ${field('Species used', ss.woodySpecies)}
          </div>`)}
        ${activityRow('Natural Cavity/Snag Development', ss.snagDevelopment, `
          <div class="indent field-row">
            ${field('Species of snag', ss.snagSpecies)}
            ${field('Size of snags', ss.snagSize)}
            ${field('Number/acre', ss.snagPerAcre)}
          </div>`)}
      </div>
    </div>

    <!-- Census -->
    <div class="activity-block">
      <div class="activity-header">7. CENSUS</div>
      <div class="activity-body">
        ${activityRow('Spotlight Counts', ce.spotlightCounts, `
          <div class="indent field-row">
            ${field('Targeted species', ce.spotlightSpecies)}
            ${field('Length of route', ce.spotlightRouteLength)}
            ${field('Visibility', ce.spotlightVisibility)}
          </div>
          <div class="indent field-row">
            ${field('Date A', ce.spotlightDateA)}
            ${field('Date B', ce.spotlightDateB)}
            ${field('Date C', ce.spotlightDateC)}
          </div>`)}
        ${activityRow('Standardized Incidental Observations', ce.incidentalObservations, `
          <div class="indent field-row">
            ${field('Targeted species', ce.incidentalSpecies)}
          </div>
          <div class="indent">
            From: ${cbItem('Feeders', ce.incidentalFeeders)} ${cbItem('Food plots', ce.incidentalFoodPlots)}
            ${cbItem('Blinds', ce.incidentalBlinds)} ${cbItem('Vehicle', ce.incidentalVehicle)}
            &nbsp; Dates: ${esc(ce.incidentalDates)}
          </div>`)}
        ${activityRow('Stand Counts of Deer (5 one-hour counts per stand required)', ce.standCounts, `
          <div class="indent field-row">
            ${field('Number of stands', ce.standCountStands)}
            ${field('Dates', ce.standCountDates)}
          </div>`)}
        ${activityRow('Aerial Counts', ce.aerialCounts, `
          <div class="indent field-row">
            ${field('Species counted', ce.aerialSpecies)}
            <div class="field">Type: ${cbItem('Helicopter', ce.aerialType==='helicopter')} ${cbItem('Fixed-wing', ce.aerialType==='fixedWing')}</div>
            <div class="field">Coverage: ${cbItem('Total', ce.aerialCoverage==='total')} ${cbItem('50%', ce.aerialCoverage==='50pct')} ${cbItem('Other', ce.aerialCoverage==='other')}</div>
          </div>`)}
        ${activityRow('Track Counts', ce.trackCounts, `
          <div class="indent checkbox-row">
            ${cbItem('Predators', ce.trackPredators)}
            ${cbItem('Furbearers', ce.trackFurbearers)}
            ${cbItem('Deer', ce.trackDeer)}
          </div>
          <div class="indent"><em>Additional Information:</em> ${esc(ce.trackCountInfo)}</div>`)}
        ${activityRow('Daylight Deer Herd/Wildlife Composition Counts', ce.daylightCounts, `
          <div class="indent checkbox-row">
            ${cbItem('Deer', ce.daylightDeer)} ${cbItem('Turkey', ce.daylightTurkey)}
            ${cbItem('Dove', ce.daylightDove)} ${cbItem('Quail', ce.daylightQuail)}
          </div>`)}
        ${activityRow('Harvest Data Collection/Record Keeping', ce.harvestData, `
          <div class="indent checkbox-row">
            ${cbItem('Deer', ce.harvestDeer)} ${cbItem('Game birds', ce.harvestGameBirds)}
            ${cbItem('Age', ce.harvestAge)} ${cbItem('Weight', ce.harvestWeight)}
            ${cbItem('Sex', ce.harvestSex)} ${cbItem('Antler data', ce.harvestAntler)}
            ${cbItem('Harvest date', ce.harvestDate)}
          </div>`)}
        ${activityRow('Browse Utilization Surveys (thirty 12-foot circular plots required)', ce.browseUtilization, `
          <div class="indent"><em>Additional Information:</em> ${esc(ce.browseInfo)}</div>`)}
        ${activityRow('Census of Endangered, Threatened, or Protected Wildlife', ce.endangeredCensus, `
          <div class="indent field-row">
            ${field('Species', ce.endangeredSpecies)}
            ${field('Method and dates', ce.endangeredMethod)}
          </div>`)}
        ${activityRow('Census and Monitoring of Nongame Wildlife Species', ce.nongameCensus, `
          <div class="indent field-row">
            ${field('Species', ce.nongameSpecies)}
            ${field('Method and dates', ce.nongameMethod)}
          </div>`)}
        ${activityRow('Miscellaneous Counts', ce.miscCounts, `
          <div class="indent">${field('Species being counted', ce.miscSpecies)}</div>
          <div class="indent checkbox-row">
            ${cbItem('Remote detection (cameras)', ce.miscCameras)}
            ${cbItem('Hahn (walking) line', ce.miscHahn)}
            ${cbItem('Roost counts', ce.miscRoost)}
            ${cbItem('Booming ground counts', ce.miscBooming)}
            ${cbItem('Time/area counts', ce.miscTimeArea)}
            ${cbItem('Songbird transects', ce.miscSongbird)}
            ${cbItem('Quail call/covey counts', ce.miscQuailCall)}
            ${cbItem('Point counts', ce.miscPointCounts)}
            ${cbItem('Small mammal traps', ce.miscSmallMammalTraps)}
            ${cbItem('Drift fences/pitfall traps', ce.miscDriftFences)}
            ${cbItem('Bat departures', ce.miscBatDepartures)}
            ${cbItem('Dove call counts', ce.miscDoveCall)}
            ${cbItem('Chachalaca counts', ce.miscChachalaca)}
            ${cbItem('Turkey hen/poultry counts', ce.miscTurkeyHen)}
            ${cbItem('Waterfowl/water bird counts', ce.miscWaterfowl)}
            ${cbItem('Alligator nest/census counts', ce.miscAlligator)}
          </div>`)}
      </div>
    </div>
  `;
}

function renderLogEntries(entries, propertyImages, routes) {
  if (!entries || !entries.length) return '<div style="font-size:9pt;color:#666;font-style:italic">No log entries for this year.</div>';

  function propImgFile(id) {
    var imgs = propertyImages || [];
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].id === id) return imgs[i].filename;
    }
    return null;
  }

  function routeById(id) {
    var rs = routes || [];
    for (var i = 0; i < rs.length; i++) {
      if (rs[i].id === id) return rs[i];
    }
    return null;
  }

  function entryTitle(e) {
    if (e.type === 'General') return e.name || e['f-name'] || 'General Entry';
    if (e.type === 'Harvest') {
      var t = (e['hv-species'] || 'Harvest') + (e['hv-sex'] ? ' — ' + e['hv-sex'] : '');
      if (e['hv-points']) t += ' (' + e['hv-points'] + '-pt)';
      return t;
    }
    if (e.type === 'Sighting') return (e['si-count'] ? e['si-count'] + '× ' : '') + (e['si-species'] || 'Sighting');
    if (e.type === 'Activity') return e['ac-name'] || e['ac-category'] || 'Activity';
    if (e.type === 'Census') return (e['ce-surveyType'] || 'Census') + (e['ce-species'] ? ' — ' + e['ce-species'] : '');
    if (e.type === 'Predator Control') return (e['pc-species'] || 'Predator Control') + (e['pc-method'] ? ' (' + e['pc-method'] + ')' : '');
    if (e.type === 'Maintenance') return e['ma-item'] || 'Maintenance';
    if (e.type === 'Purchase') {
      var pt = e['pu-item'] || 'Purchase';
      if (e['pu-cost']) pt += ' — $' + Number(e['pu-cost']).toLocaleString();
      return pt;
    }
    return e.type;
  }

  function fmtDate(s) {
    if (!s) return '';
    var d = new Date(s);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function fmtEighths(v) {
    var whole = Math.floor(v + 1e-9);
    var eighths = Math.round((v - whole) * 8);
    if (eighths === 8) { whole += 1; eighths = 0; }
    return eighths ? whole + ' ' + eighths + '/8' : String(whole);
  }

  function detailPairs(e) {
    var pairs = [];
    if (e.type === 'General') {
      if (e.description || e['f-description']) pairs.push(['Notes', e.description || e['f-description']]);
    } else if (e.type === 'Harvest') {
      if (e['hv-age']) pairs.push(['Age Class', e['hv-age']]);
      if (e['hv-weight']) pairs.push(['Weight', e['hv-weight'] + ' lbs']);
      if (e['hv-tag']) pairs.push(['MLDP Tag #', e['hv-tag']]);
      if (e['hv-hunter']) pairs.push(['Hunter', e['hv-hunter']]);
      if (e['hv-location']) pairs.push(['Location', e['hv-location']]);
      if (e['hv-method']) pairs.push(['Method', e['hv-method']]);
      if (e['hv-species'] === 'White-tailed Deer') {
        if (e['hv-points']) pairs.push(['Total Points', e['hv-points']]);
        var antler = [e['hv-mainBeam'] && 'Beam: '+e['hv-mainBeam']+' in', e['hv-tines'] && 'Tines: '+e['hv-tines'], e['hv-spread'] && 'Spread: '+e['hv-spread']+' in'].filter(Boolean).join(' | ');
        if (antler) pairs.push(['Antler', antler]);
        if (parseFloat(e['hv-bc-net']) > 0)
          pairs.push(['B&C Score', fmtEighths(parseFloat(e['hv-bc-net'])) + ' net (' + (e['hv-bc-mode'] === 'Non-Typical' ? 'Non-Typical' : 'Typical') + ')']);
      }
      if (e['hv-notes']) pairs.push(['Notes', e['hv-notes']]);
    } else if (e.type === 'Sighting') {
      if (e['si-sexAge']) pairs.push(['Detail', e['si-sexAge']]);
      if (e['si-location']) pairs.push(['Location', e['si-location']]);
      if (e['si-method']) pairs.push(['Method', e['si-method']]);
      if (e['si-notes']) pairs.push(['Notes', e['si-notes']]);
    } else if (e.type === 'Activity') {
      if (e['ac-category']) pairs.push(['Category', e['ac-category']]);
      if (e['ac-acres']) pairs.push(['Acres', e['ac-acres']]);
      if (e['ac-notes']) pairs.push(['Notes', e['ac-notes']]);
    } else if (e.type === 'Census') {
      if (e['ce-route']) pairs.push(['Route/Stand', e['ce-route']]);
      if (e['ce-total']) pairs.push(['Observed', e['ce-total']]);
      if (e['ce-conditions']) pairs.push(['Conditions', e['ce-conditions']]);
      if (e['ce-notes']) pairs.push(['Notes', e['ce-notes']]);
    } else if (e.type === 'Predator Control') {
      if (e['pc-count']) pairs.push(['Removed', e['pc-count']]);
      if (e['pc-notes']) pairs.push(['Notes', e['pc-notes']]);
    } else if (e.type === 'Maintenance') {
      if (e['ma-action']) pairs.push(['Action', e['ma-action']]);
      if (e['ma-notes']) pairs.push(['Notes', e['ma-notes']]);
    } else if (e.type === 'Purchase') {
      if (e['pu-category']) pairs.push(['Category', e['pu-category']]);
      if (e['pu-vendor']) pairs.push(['Vendor', e['pu-vendor']]);
      if (e['pu-qty']) pairs.push(['Quantity', e['pu-qty']]);
      if (e['pu-cost']) pairs.push(['Cost', '$' + Number(e['pu-cost']).toLocaleString()]);
      if (e['pu-practice']) pairs.push(['Practice', e['pu-practice']]);
      if (e['pu-notes']) pairs.push(['Notes', e['pu-notes']]);
    }
    return pairs;
  }

  return entries.map(function(e) {
    var pairs = detailPairs(e);
    var detailHtml = pairs.map(function(p) {
      return '<span style="margin-right:12pt"><strong>' + esc(p[0]) + ':</strong> ' + esc(String(p[1])) + '</span>';
    }).join('');
    var photosHtml = '';
    if (e.photos && e.photos.length) {
      photosHtml = '<div style="margin-top:6pt;display:grid;grid-template-columns:1fr 1fr;gap:6pt">' +
        e.photos.map(function(f) {
          return '<img src="/photos/' + esc(f) + '" style="width:100%;height:auto;display:block;border:0.5pt solid #ccc;border-radius:3pt">';
        }).join('') +
      '</div>';
    }
    var locHtml = '';
    if (e.loc && e.loc.img && propImgFile(e.loc.img)) {
      locHtml = '<div style="font-size:7pt;font-weight:700;color:#666;text-transform:uppercase;margin-bottom:2pt">Location</div>' +
        '<div style="position:relative;max-width:240pt;border:0.5pt solid #ccc;border-radius:3pt;overflow:hidden">' +
          '<img src="/property-images/' + esc(propImgFile(e.loc.img)) + '" style="width:100%;height:auto;display:block">' +
          '<span style="position:absolute;left:' + (e.loc.x * 100) + '%;top:' + (e.loc.y * 100) + '%;transform:translate(-50%,-50%);color:#e01818;font-size:16pt;font-weight:700;line-height:1;text-shadow:0 0 2pt #fff,0 0 4pt #fff">&#10010;</span>' +
        '</div>';
    }
    // Census route map
    var route = e['ce-routeId'] ? routeById(e['ce-routeId']) : null;
    if (route && route.points && route.points.length && propImgFile(route.imageId)) {
      var rpts = route.points.map(function(p) { return (p.x * 100) + ',' + (p.y * 100); }).join(' ');
      locHtml += '<div style="font-size:7pt;font-weight:700;color:#666;text-transform:uppercase;margin:4pt 0 2pt">Route: ' + esc(route.name) + '</div>' +
        '<div style="position:relative;max-width:240pt;border:0.5pt solid #ccc;border-radius:3pt;overflow:hidden">' +
          '<img src="/property-images/' + esc(propImgFile(route.imageId)) + '" style="width:100%;height:auto;display:block">' +
          '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;top:0;left:0;width:100%;height:100%">' +
            '<polyline points="' + rpts + '" fill="none" stroke="#e01818" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>' +
          '</svg>' +
        '</div>';
    }
    return '<div style="border:0.5pt solid #ccc;border-radius:3pt;margin-bottom:6pt;overflow:hidden;page-break-inside:avoid">' +
      '<div style="background:#f0f0f0;padding:4pt 8pt;display:flex;gap:8pt;align-items:baseline">' +
        '<span style="font-size:7pt;font-weight:700;padding:1pt 5pt;border-radius:8pt;background:#ddd;white-space:nowrap">' + esc(e.type) + '</span>' +
        '<span style="font-weight:700;font-size:9pt">' + esc(entryTitle(e)) + '</span>' +
        '<span style="margin-left:auto;font-size:8pt;color:#666">' + esc(fmtDate(e.datetime)) + '</span>' +
      '</div>' +
      (detailHtml ? '<div style="padding:4pt 8pt 2pt;font-size:8pt">' + detailHtml + '</div>' : '') +
      (locHtml ? '<div style="padding:4pt 8pt">' + locHtml + '</div>' : '') +
      (photosHtml ? '<div style="padding:0 8pt 8pt">' + photosHtml + '</div>' : '') +
    '</div>';
  }).join('');
}

// ── End print helpers ──

// Print view for the plan (PWD 885)
app.get('/plan-print', (req, res) => {
  const data = loadData();
  const { plan, activities } = data;
  const owner = plan.owner;
  const prop = plan.property;
  const sp = plan.species;
  const qa = plan.qualifyingActivities;
  const dm = plan.deerManagement;
  const assoc = plan.association;
  const ht = prop.habitatTypes || {};

  res.send(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>PWD 885 - Wildlife Management Plan</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/print-shared.css">
</head><body>
<div class="print-btn-bar no-print">
  <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">Close</button>
  <span style="font-size:0.85rem;opacity:0.8">Use your browser's Print dialog → Save as PDF</span>
</div>
<div class="print-spacer"></div>

<div class="page">
  <div class="print-header">
    <div class="logo-area">
      <div class="tpwd-box">TEXAS<br>PARKS &amp;<br>WILDLIFE</div>
      <div>
        <h1>1-D-1 Open Space Agricultural Valuation</h1>
        <h2>Wildlife Management Plan for the Year(s) ____</h2>
        <div class="submit-note">Submit this plan to your County Chief Appraiser, not to Texas Parks and Wildlife Department</div>
      </div>
    </div>
  </div>

  <div class="section-head">Part I. Owner Information &nbsp;&nbsp;&nbsp; Account Number: <span style="font-weight:400">${esc(owner.accountNumber)}</span></div>
  ${renderOwner(owner)}

  <div class="section-head">Part II. Property Description</div>
  <div class="box">
    <div class="field-row">${field('Legal Description of Property', prop.legalDescription)}</div>
    <div class="field-row">${field('Location (distance/direction from nearest town; highway/road numbers)', prop.location)}</div>
    <div class="field-row">
      <div class="field">Is Acreage under high fence:
        ${cbItem('Yes', prop.highFence==='yes')} ${cbItem('No', prop.highFence==='no')} ${cbItem('Partial', prop.highFence==='partial')}
        ${prop.highFence==='partial' ? ' Describe: ' + esc(prop.highFenceDescription) : ''}
      </div>
      ${field('Total Acreage', prop.totalAcreage)}
      ${field('Ecoregion', prop.ecoregion)}
    </div>
    <div>Habitat Types and Amounts of Acres:</div>
    <div class="checkbox-row" style="margin-top:4pt">
      ${cbItem('Cropland', ht.cropland)} <span style="font-size:9pt">${esc(ht.croplandAcres)} ac</span>
      &nbsp;${cbItem('Bottomland/Riparian (Native)', ht.bottomlandRiparian)} <span style="font-size:9pt">${esc(ht.bottomlandRiparianAcres)} ac</span>
      &nbsp;${cbItem('Wetlands', ht.wetlands)} <span style="font-size:9pt">${esc(ht.wetlandsAcres)} ac</span>
      &nbsp;${cbItem('Non-native Pasture', ht.nonNativePasture)} <span style="font-size:9pt">${esc(ht.nonNativePastureAcres)} ac</span>
      &nbsp;${cbItem('Pasture/Grassland', ht.pastureGrassland)} <span style="font-size:9pt">${esc(ht.pastureGrasslandAcres)} ac</span>
      &nbsp;${cbItem('Timberlands', ht.timberlands)} <span style="font-size:9pt">${esc(ht.timberlandsAcres)} ac</span>
      &nbsp;${cbItem('Native Range/Brush', ht.nativeRangeBrush)} <span style="font-size:9pt">${esc(ht.nativeRangeBrushAcres)} ac</span>
      &nbsp;${cbItem('Other', ht.other)} ${esc(ht.otherDescription)} <span style="font-size:9pt">${esc(ht.otherAcres)} ac</span>
    </div>
  </div>

  <div class="section-head">Part III. Species Targeted for Management</div>
  <div class="box">
    <div class="checkbox-row">
      ${cbItem('Deer', sp.deer)} ${cbItem('Turkey', sp.turkey)} ${cbItem('Quail', sp.quail)}
      ${cbItem('Songbirds', sp.songbirds)} ${cbItem('Waterfowl', sp.waterfowl)}
      ${cbItem('Doves', sp.doves)} ${cbItem('Bats', sp.bats)}
    </div>
    <div class="field-row" style="margin-top:4pt">
      ${field('Neotropical Songbirds', sp.neotropical_list)}
      ${field('Reptiles', sp.reptiles_list)}
      ${field('Amphibians', sp.amphibians_list)}
    </div>
    <div class="field-row">
      ${field('Small Mammals', sp.smallMammals_list)}
      ${field('Insects', sp.insects_list)}
      ${field('Species of Concern', sp.speciesOfConcern_list)}
      ${field('Other', sp.other_list)}
    </div>
  </div>

  <div class="section-head">Part IV. Management Plan Goals and Objectives</div>
  <div class="box">${fieldMulti('', plan.goals)}</div>

  <div class="section-head">Part V. Qualifying Wildlife Management Activities</div>
  <div class="box">
    <div style="font-size:9pt;margin-bottom:4pt">Check the wildlife management practices to be implemented during the coming year. A minimum of three practices is required.</div>
    ${renderQualifying(qa)}
  </div>

  <div class="section-head">Part VI. White-tail Deer and Mule Deer Population Management</div>
  <div class="box">
    <div class="field-row">
      <div class="field">Is hunting to be a part of this wildlife management plan?
        ${cbItem('Yes', String(dm.huntingIncluded)==='true')} ${cbItem('No', String(dm.huntingIncluded)==='false')}
      </div>
      <div class="field">If YES, type:
        ${cbItem('Lease hunting', dm.huntingType==='lease')}
        ${cbItem('Family/guests only', dm.huntingType==='family')}
        ${cbItem('Both', dm.huntingType==='both')}
      </div>
    </div>
    <div style="margin:4pt 0 2pt">List deer harvest for past three seasons:</div>
    <table style="width:100%;border-collapse:collapse;font-size:9pt">
      <tr><th style="border:1pt solid #000;padding:3pt;background:#eee">Year</th><th style="border:1pt solid #000;padding:3pt;background:#eee">Bucks</th><th style="border:1pt solid #000;padding:3pt;background:#eee">Does</th></tr>
      ${(dm.harvestHistory||[]).map(r=>`<tr><td style="border:1pt solid #000;padding:3pt">${esc(r.year)}</td><td style="border:1pt solid #000;padding:3pt">${esc(r.bucks)}</td><td style="border:1pt solid #000;padding:3pt">${esc(r.does)}</td></tr>`).join('')}
    </table>
    <div class="field-row" style="margin-top:4pt">
      ${field('Target Density (fall pre-season)', dm.targetDensity)}
      ${field('Target Sex Ratio (does/buck)', dm.targetSexRatio)}
      ${field('Target Production (fawns/doe)', dm.targetProduction)}
    </div>
    <div class="field-row">${field('Other goals (age, weight, antler, browse, etc.)', dm.otherGoals)}</div>
    <div class="field-row">${fieldMulti('Deer Harvest Strategy', dm.harvestStrategy)}</div>
  </div>

  <div class="section-head">Part VII. Wildlife Management Association Membership</div>
  <div class="box">
    <div>Are you a member of a wildlife management association (co-op)?
      ${cbItem('Yes', String(assoc.managementAssociation)==='true')} ${cbItem('No', String(assoc.managementAssociation)==='false')}
    </div>
    <div style="margin-top:3pt">Are you a member of a wildlife property association?
      ${cbItem('Yes', String(assoc.propertyAssociation)==='true')} ${cbItem('No', String(assoc.propertyAssociation)==='false')}
    </div>
    <div style="margin-top:3pt">${field('Name of wildlife property co-op/association, if YES', assoc.associationName)}</div>
  </div>
</div>

<div class="page">
  <div class="section-head">Part VIII. Wildlife Management Activities</div>
  <div style="font-size:9pt;margin-bottom:8pt">Check the activities you intend to implement during the year to support each of the wildlife management activities listed in Part V.</div>
  ${renderActivitiesPrint(activities, '')}

  <div class="section-head">Part IX. Additional Supporting Information (Optional)</div>
  <div class="box" style="min-height:80pt">Attach any other supporting information, such as maps or photographs that you believe to be relevant to this wildlife management plan.</div>

  <div class="sig-area">
    <div style="font-size:9pt">I certify that the above information provided by me in this application is to the best of my knowledge and belief, true and complete.</div>
    <div class="sig-row">
      <div class="sig-field"><div class="sig-line"></div><label>Landowner Signature</label></div>
      <div class="sig-field"><div class="sig-line"></div><label>Date</label></div>
    </div>
    <div style="margin-top:12pt;font-size:9pt;font-weight:700">This area for use only if the wildlife management plan was prepared for the above landowner for a fee by a wildlife professional or consultant.*</div>
    <div class="box" style="margin-top:6pt">
      <div class="sig-row">
        <div class="sig-field"><div class="sig-line"></div><label>Signature of person preparing wildlife management plan</label></div>
        <div class="sig-field"><div class="sig-line"></div><label>Date</label></div>
      </div>
      <div class="sig-row">
        <div class="sig-field"><div class="sig-line"></div><label>Company</label></div>
        <div class="sig-field"><div class="sig-line"></div><label>Phone Number</label></div>
      </div>
      <div style="font-size:8.5pt;margin-top:4pt">*Signature by TPWD not required for this plan to be valid.</div>
    </div>
  </div>
  <div class="footer-note">Texas Parks and Wildlife does not maintain the information collected through this form. This completed form is only provided to the County Tax Appraiser. Please inquire with your County Central Appraisal District on any local laws concerning any information collected through this form.</div>
  <div class="form-num">PWD 885-W7000 (07/08)</div>
</div>

<script src="/print-helpers.js"></script>
</body></html>`);
});

// Print view for annual report (PWD 888)
app.get('/report-print/:year', (req, res) => {
  const data = loadData();
  const year = req.params.year;
  const owner = data.plan.owner;
  const reportData = (data.reports && data.reports[year]) || {};
  const qa = reportData.qualifyingActivities || {};
  const assoc = reportData.association || {};
  const activities = reportData;
  const excludedIds = (reportData.excludedLogIds || []);
  const logEntries = (data.log || [])
    .filter(function(e) { return e.datetime && e.datetime.startsWith(year); })
    .filter(function(e) { return excludedIds.indexOf(e.id) === -1; })
    .sort(function(a, b) { return a.datetime < b.datetime ? -1 : 1; });

  // Per-type counts for the Supporting Documentation note
  const logStats = {};
  logEntries.forEach(function(e) { logStats[e.type] = (logStats[e.type] || 0) + 1; });
  const logStatsLine = Object.keys(logStats).sort().map(function(t) {
    return logStats[t] + ' ' + t;
  }).join(', ');

  res.send(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>PWD 888 - ${year} Annual Report</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/print-shared.css">
</head><body>
<div class="print-btn-bar no-print">
  <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">Close</button>
  <span style="font-size:0.85rem;opacity:0.8">Use your browser's Print dialog → Save as PDF</span>
</div>
<div class="print-spacer"></div>

<div class="page">
  <div class="print-header">
    <div class="logo-area">
      <div class="tpwd-box">TEXAS<br>PARKS &amp;<br>WILDLIFE</div>
      <div>
        <h1>1-D-1 Open Space Agricultural Valuation</h1>
        <h2>Wildlife Management Annual Report for the Year(s) ${esc(year)}</h2>
        <div class="submit-note">Submit this plan to your County Tax Appraiser, not to Texas Parks and Wildlife Department</div>
      </div>
    </div>
  </div>

  <div class="section-head">Part I. Owner Information &nbsp;&nbsp;&nbsp; Account Number: <span style="font-weight:400">${esc(owner.accountNumber)}</span></div>
  ${renderOwner(owner)}

  <div class="section-head">Part II. Qualifying Wildlife Management Activities</div>
  <div class="box">
    <div style="font-size:9pt;margin-bottom:4pt">Check the wildlife management practices implemented on the property during the year being reported. A minimum of three practices is required.</div>
    ${renderQualifying(qa)}
  </div>

  <div class="section-head">Part III. Wildlife Management Association Membership</div>
  <div class="box">
    <div>Are you a member of a wildlife property association?
      ${cbItem('Yes', String(assoc.propertyAssociation)==='true')} ${cbItem('No', String(assoc.propertyAssociation)==='false')}
    </div>
    <div style="margin-top:3pt">${field('Name of wildlife property co-op/association, if YES', assoc.associationName)}</div>
  </div>
</div>

<div class="page">
  <div class="section-head">Part IV. Wildlife Management Activities</div>
  <div style="font-size:9pt;margin-bottom:8pt">Check the activities you have implemented during the year to support each of the wildlife management activities listed in Part II.</div>
  ${renderActivitiesPrint(activities, '')}

  <div class="section-head">Part V. Supporting Documentation</div>
  <div class="box" style="min-height:80pt">
    <div>Attach copies of supporting documentation such as receipts, maps, photos, etc. Use additional pages if necessary.</div>
    ${reportData.supplementalNotes ? '<div style="margin-top:6pt;font-size:9pt;white-space:pre-wrap">' + esc(reportData.supplementalNotes) + '</div>' : ''}
    ${logEntries.length ? '<div style="margin-top:6pt;padding:5pt 8pt;background:#f0f4ee;border:0.5pt solid #b8c8b0;border-radius:3pt;font-size:9pt"><strong>Attached:</strong> An Activity Log for ' + esc(year) + ' follows this report — ' + logEntries.length + ' entr' + (logEntries.length === 1 ? 'y' : 'ies') + ' (' + esc(logStatsLine) + ') with photos and property locations.</div>' : ''}
  </div>

  <div class="sig-area">
    <div style="font-size:9pt">I certify that the above information provided by me is to the best of my knowledge and belief, true and complete.</div>
    <div class="sig-row">
      <div class="sig-field"><div class="sig-line"></div><label>Signature</label></div>
      <div class="sig-field"><div class="sig-line"></div><label>Date</label></div>
    </div>
  </div>
  <div class="footer-note">Texas Parks and Wildlife does not maintain the information collected through this form. This completed form is only provided to the County Tax Appraiser. Please inquire with your County Central Appraisal District on any local laws concerning any information collected through this form.</div>
  <div class="form-num">PWD 888-W7000 (07/08)</div>
</div>

<div class="page">
  <div class="section-head">Activity Log — ${esc(year)}</div>
  <div style="font-size:9pt;margin-bottom:6pt">Supporting documentation: entries recorded throughout the year. Photos and property locations are embedded below each entry.</div>
  ${renderLogEntries(logEntries, data.propertyImages, data.routes)}
</div>

<script src="/print-helpers.js"></script>
</body></html>`);
});

const server = app.listen(PORT, () => {
  console.log(`Wildlife Management Tool running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n Port ${PORT} is already in use.`);
    console.log(` The app is probably already running.`);
    console.log(` Open http://localhost:${PORT} in your browser.\n`);
    process.exit(0);
  } else {
    throw err;
  }
});
