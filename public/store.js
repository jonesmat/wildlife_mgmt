// Local data store: all app data lives in the browser (IndexedDB), no
// filesystem files. This script patches window.fetch so every existing
// '/api/...' call is served locally, and registers a service worker that
// serves '/photos/*' and '/property-images/*' images from the same store.
//
// Must be included BEFORE any other script that calls fetch.
(function() {
  'use strict';

  var DB_NAME = 'wildlife-mgmt';
  var DB_VERSION = 1;
  var EXPORT_FORMAT = 'wildlife-mgmt-export';
  var EXPORT_VERSION = 1;
  var SUPPORTED_IMPORT_VERSIONS = [1];

  // ── IndexedDB ──

  var dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function(resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function() {
        var db = req.result;
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      };
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
    return dbPromise;
  }

  function idb(storeName, mode, fn) {
    return openDb().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(storeName, mode);
        var store = tx.objectStore(storeName);
        var result = fn(store);
        tx.oncomplete = function() {
          resolve(result && result.result !== undefined ? result.result : undefined);
        };
        tx.onerror = function() { reject(tx.error); };
      });
    });
  }

  function kvGet(key) { return idb('kv', 'readonly', function(s) { return s.get(key); }); }
  function kvSet(key, val) { return idb('kv', 'readwrite', function(s) { s.put(val, key); }); }
  function filePut(path, b64, mime) { return idb('files', 'readwrite', function(s) { s.put({ b64: b64, mime: mime }, path); }); }
  function fileDelete(path) { return idb('files', 'readwrite', function(s) { s.delete(path); }); }
  function fileKeys() { return idb('files', 'readonly', function(s) { return s.getAllKeys(); }); }
  function fileGet(path) { return idb('files', 'readonly', function(s) { return s.get(path); }); }
  function clearStore(name) { return idb(name, 'readwrite', function(s) { s.clear(); }); }

  // ── Data defaults & migration (ported from server) ──

  function defaultData() {
    return {
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
  }

  // The five qualifying practices that used to live as categories of a single
  // "Activity" event type are now first-class event types of their own.
  var PROMOTED_PRACTICES = {
    'Habitat Control': 1, 'Erosion Control': 1,
    'Supplemental Water': 1, 'Supplemental Food': 1, 'Supplemental Shelter': 1
  };

  // Turn a legacy "Activity" entry into its dedicated event type. Promoted
  // practices simply adopt the category as their type (fields are unchanged).
  // The two categories that always had richer dedicated forms (Predator
  // Control, Census) fold into those types, preserving the notes.
  // Move the old generic ac-name/ac-acres/ac-notes onto a practice-typed
  // entry's own fields (acres into its acres field, the rest into its notes).
  function foldGenericPracticeFields(e) {
    if (!('ac-name' in e) && !('ac-acres' in e) && !('ac-notes' in e)) return;
    var acresF = window.PRACTICE_ACRES_FIELD[e.type];
    if (acresF && e['ac-acres'] && !e[acresF]) e[acresF] = e['ac-acres'];
    var notesF = (window.PRACTICE_FIELDS[e.type] || []).reduce(function(acc, f) {
      return f.type === 'textarea' ? f.id : acc;
    }, null);
    if (notesF) {
      var carry = [e['ac-name'], (acresF ? '' : (e['ac-acres'] ? e['ac-acres'] + ' acres' : '')), e['ac-notes']]
        .filter(Boolean).join(' — ');
      if (carry) e[notesF] = [carry, e[notesF]].filter(Boolean).join('\n');
    }
    delete e['ac-name']; delete e['ac-acres']; delete e['ac-notes'];
  }

  function migrateActivityEntry(e) {
    var cat = e['ac-category'];
    var note = [e['ac-name'], e['ac-acres'] ? e['ac-acres'] + ' acres' : '', e['ac-notes']]
      .filter(Boolean).join(' — ');
    if (PROMOTED_PRACTICES[cat]) {
      // Promoted practice: adopt the category as the type; per-practice fields
      // are filled in by foldGenericPracticeFields below.
      e.type = cat;
      delete e['ac-category'];
      return e;
    }
    if (cat === 'Predator Control') {
      e.type = 'Predator Control';
      if (note) e['pc-notes'] = [note, e['pc-notes']].filter(Boolean).join('\n');
    } else if (cat === 'Census') {
      e.type = 'Census';
      if (note) e['ce-notes'] = [note, e['ce-notes']].filter(Boolean).join('\n');
    } else {
      // No usable category — keep it as a General note rather than lose it.
      e.type = 'General';
      e['f-name'] = e.name = (e['ac-name'] || 'Activity');
      e['f-description'] = e.description = note;
    }
    delete e['ac-category'];
    delete e['ac-name']; delete e['ac-acres']; delete e['ac-notes'];
    return e;
  }

  function migrateData(d) {
    if (!d.log) d.log = [];
    if (!d.propertyImages) d.propertyImages = [];
    if (!d.routes) d.routes = [];
    if (!d.settings) d.settings = {};
    if (!d.settings.photoQuality) d.settings.photoQuality = 'balanced';
    if (!d.bucks) d.bucks = [];
    if (!d.reportsMeta) d.reportsMeta = {};
    d.log.forEach(function(e) {
      if (!e) return;
      if (e.type === 'Activity') migrateActivityEntry(e);
      // Fold any leftover generic fields onto practice-typed entries (covers
      // entries created by the interim single-shared-form version too).
      if (window.PRACTICE_FIELDS[e.type]) foldGenericPracticeFields(e);
    });
    return d;
  }

  function loadData() {
    return kvGet('data').then(function(d) {
      if (!d) {
        d = defaultData();
        return kvSet('data', d).then(function() { return migrateData(d); });
      }
      return migrateData(d);
    });
  }

  function saveData(d) {
    // Change stamp used by google-sync.js to detect local edits between syncs.
    d.lastModifiedAt = new Date().toISOString();
    return kvSet('data', d).then(function(r) {
      // Lets google-sync.js debounce an auto-sync after edits settle.
      try { window.dispatchEvent(new CustomEvent('wm-data-changed')); } catch (e) {}
      return r;
    });
  }

  // ── Helpers ──

  function mimeFromName(name) {
    var ext = String(name).split('.').pop().toLowerCase();
    // Raster formats only — no svg. SVG can carry scripts, and these files
    // round-trip through user-importable backups, so a crafted backup must
    // never produce a record the service worker serves as image/svg+xml.
    var map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp' };
    return map[ext] || 'image/jpeg';
  }

  function stripDataUrl(s) {
    return String(s || '').replace(/^data:[^,]*,/, '');
  }

  function json(body, status) {
    return new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function parseBody(init) {
    try { return init && init.body ? JSON.parse(init.body) : {}; }
    catch (e) { return {}; }
  }

  // Delete an entry's photo files + thumbnails
  function deleteEntryPhotos(entry) {
    var ops = [];
    (entry && entry.photos || []).forEach(function(f) {
      ops.push(fileDelete('/photos/' + f));
      ops.push(fileDelete('/photos/thumb-' + f));
    });
    return Promise.all(ops);
  }

  // Collect all files under a prefix as { filename: b64 }
  function collectFiles(prefix) {
    return fileKeys().then(function(keys) {
      var mine = (keys || []).filter(function(k) { return k.indexOf(prefix) === 0; });
      return Promise.all(mine.map(function(k) { return fileGet(k); })).then(function(vals) {
        var out = {};
        mine.forEach(function(k, i) {
          if (vals[i]) out[k.slice(prefix.length)] = vals[i].b64;
        });
        return out;
      });
    });
  }

  function clearFilesUnder(prefix) {
    return fileKeys().then(function(keys) {
      return Promise.all((keys || []).filter(function(k) { return k.indexOf(prefix) === 0; })
        .map(function(k) { return fileDelete(k); }));
    });
  }

  function writeFilesUnder(prefix, map, skipExisting) {
    if (!map) return Promise.resolve();
    var names = Object.keys(map);
    return fileKeys().then(function(keys) {
      var existing = {};
      (keys || []).forEach(function(k) { existing[k] = true; });
      return Promise.all(names.map(function(f) {
        var key = prefix + f.replace(/[\\/]/g, ''); // no path tricks
        if (skipExisting && existing[key]) return Promise.resolve();
        return filePut(key, map[f], mimeFromName(f));
      }));
    });
  }

  // ── API implementation (mirrors the old server routes) ──

  async function handleApi(method, pathname, init) {
    var data = await loadData();
    var body = parseBody(init);
    var m;
    var now = new Date().toISOString();

    if (pathname === '/api/data') {
      if (method === 'GET') return json(data);
      if (method === 'POST') {
        body.planUpdatedAt = now;
        await saveData(body);
        return json({ ok: true });
      }
    }

    if (pathname === '/api/years' && method === 'GET') {
      return json({
        planUpdatedAt: data.planUpdatedAt || null,
        years: Object.keys(data.reports || {}).sort().reverse().map(function(y) {
          return { year: y, updatedAt: (data.reportsMeta[y] || {}).updatedAt || null };
        })
      });
    }

    if ((m = pathname.match(/^\/api\/reports\/([^/]+)$/))) {
      var ry = m[1];
      if (method === 'POST') {
        if (!data.reports) data.reports = {};
        data.reports[ry] = body;
        data.reportsMeta[ry] = { updatedAt: now };
        await saveData(data);
        return json({ ok: true });
      }
      if (method === 'DELETE') {
        if (!data.reports || !data.reports[ry]) return json({ error: 'Report not found' }, 404);
        delete data.reports[ry];
        delete data.reportsMeta[ry];
        await saveData(data);
        return json({ ok: true });
      }
    }

    if (pathname === '/api/log') {
      if (method === 'GET') return json(data.log || []);
      if (method === 'POST') {
        body.id = String(Date.now());
        data.log.push(body);
        await saveData(data);
        return json(body);
      }
    }

    if ((m = pathname.match(/^\/api\/log\/([^/]+)$/))) {
      var lid = m[1];
      if (method === 'PUT') {
        var idx = data.log.findIndex(function(e) { return e.id === lid; });
        if (idx === -1) return json({ error: 'Entry not found' }, 404);
        body.id = lid;
        data.log[idx] = body;
        await saveData(data);
        return json(body);
      }
      if (method === 'DELETE') {
        var entry = data.log.find(function(e) { return e.id === lid; });
        await deleteEntryPhotos(entry);
        data.log = data.log.filter(function(e) { return e.id !== lid; });
        await saveData(data);
        return json({ ok: true });
      }
    }

    if (pathname === '/api/photos' && method === 'POST') {
      var origName = body.filename || 'photo.jpg';
      var ext = origName.split('.').pop().toLowerCase() || 'jpg';
      var pid = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
      await filePut('/photos/' + pid, stripDataUrl(body.dataUrl), mimeFromName(pid));
      if (body.thumbUrl) {
        await filePut('/photos/thumb-' + pid, stripDataUrl(body.thumbUrl), 'image/jpeg');
      }
      return json({ ok: true, filename: pid });
    }

    if ((m = pathname.match(/^\/api\/photos\/([^/]+)$/)) && method === 'DELETE') {
      var pf = decodeURIComponent(m[1]);
      await fileDelete('/photos/' + pf);
      await fileDelete('/photos/thumb-' + pf);
      return json({ ok: true });
    }

    if (pathname === '/api/property-images') {
      if (method === 'GET') {
        return json({ images: data.propertyImages, currentId: data.currentPropertyImageId || null });
      }
      if (method === 'POST') {
        var iname = body.filename || 'property.jpg';
        var iext = iname.split('.').pop().toLowerCase() || 'jpg';
        var iid = Date.now() + '-' + Math.random().toString(36).slice(2);
        var ifn = iid + '.' + iext;
        await filePut('/property-images/' + ifn, stripDataUrl(body.dataUrl), mimeFromName(ifn));
        if (body.thumbUrl) {
          await filePut('/property-images/thumb-' + ifn, stripDataUrl(body.thumbUrl), 'image/jpeg');
        }
        data.propertyImages.push({ id: iid, filename: ifn, name: iname, uploadedAt: now });
        data.currentPropertyImageId = iid;
        await saveData(data);
        return json({ ok: true, id: iid, filename: ifn });
      }
    }

    if ((m = pathname.match(/^\/api\/property-images\/([^/]+)\/activate$/)) && method === 'POST') {
      var img = data.propertyImages.find(function(i) { return i.id === m[1]; });
      if (!img) return json({ error: 'Image not found' }, 404);
      data.currentPropertyImageId = img.id;
      await saveData(data);
      return json({ ok: true });
    }

    if (pathname === '/api/routes') {
      if (method === 'GET') return json(data.routes);
      if (method === 'POST') {
        var route = {
          id: String(Date.now()),
          name: body.name || 'Unnamed Route',
          imageId: body.imageId || null,
          points: body.points || [],
          createdAt: now
        };
        data.routes.push(route);
        await saveData(data);
        return json(route);
      }
    }

    if ((m = pathname.match(/^\/api\/routes\/([^/]+)$/))) {
      var rid = m[1];
      if (method === 'PUT') {
        var r = data.routes.find(function(x) { return x.id === rid; });
        if (!r) return json({ error: 'Route not found' }, 404);
        if (body.name !== undefined) r.name = body.name;
        if (body.points !== undefined) r.points = body.points;
        await saveData(data);
        return json(r);
      }
      if (method === 'DELETE') {
        data.routes = data.routes.filter(function(x) { return x.id !== rid; });
        await saveData(data);
        return json({ ok: true });
      }
    }

    if (pathname === '/api/bucks') {
      if (method === 'GET') return json(data.bucks);
      if (method === 'POST') {
        var buck = {
          id: String(Date.now()),
          name: body.name || 'Unnamed Buck',
          notes: body.notes || '',
          status: 'Watching',
          createdAt: now
        };
        data.bucks.push(buck);
        await saveData(data);
        return json(buck);
      }
    }

    if ((m = pathname.match(/^\/api\/bucks\/([^/]+)$/))) {
      var bid = m[1];
      if (method === 'PUT') {
        var b = data.bucks.find(function(x) { return x.id === bid; });
        if (!b) return json({ error: 'Buck not found' }, 404);
        ['name', 'notes', 'status'].forEach(function(k) {
          if (body[k] !== undefined) b[k] = body[k];
        });
        await saveData(data);
        return json(b);
      }
      if (method === 'DELETE') {
        data.bucks = data.bucks.filter(function(x) { return x.id !== bid; });
        data.log.forEach(function(e) {
          if (e['hv-buckId'] === bid) e['hv-buckId'] = '';
          if (e['si-buckId'] === bid) e['si-buckId'] = '';
        });
        await saveData(data);
        return json({ ok: true });
      }
    }

    if (pathname === '/api/settings') {
      if (method === 'GET') return json(data.settings);
      if (method === 'POST') {
        Object.keys(body).forEach(function(k) { data.settings[k] = body[k]; });
        await saveData(data);
        return json(data.settings);
      }
    }

    if (pathname === '/api/calendar') {
      if (method === 'GET') return json(data.calendar || null);
      if (method === 'POST') {
        var cal = body;
        if (!cal || !cal.meta || !cal.meta.season_year || !Array.isArray(cal.groups)) {
          return json({ error: 'Not a valid wildlife calendar file — expected meta.season_year and a groups array.' }, 400);
        }
        for (var ci = 0; ci < cal.groups.length; ci++) {
          if (!cal.groups[ci].group || !Array.isArray(cal.groups[ci].events)) {
            return json({ error: 'Not a valid wildlife calendar file — every group needs a name and an events array.' }, 400);
          }
        }
        cal._importedAt = now; // staleness warnings key off this
        data.calendar = cal;
        await saveData(data);
        return json({ ok: true });
      }
      if (method === 'DELETE') {
        delete data.calendar;
        await saveData(data);
        return json({ ok: true });
      }
    }

    if (pathname === '/api/export' && method === 'GET') {
      var photos = await collectFiles('/photos/');
      var propImgs = await collectFiles('/property-images/');
      return json({
        format: EXPORT_FORMAT,
        version: EXPORT_VERSION,
        exportedAt: now,
        data: data,
        files: { photos: photos, 'property-images': propImgs }
      });
    }

    if (pathname === '/api/import' && method === 'POST') {
      var archive = body.archive;
      var mode = body.mode;
      if (!archive || archive.format !== EXPORT_FORMAT) {
        return json({ error: 'Not a Wildlife Management Tool export file.' }, 400);
      }
      if (SUPPORTED_IMPORT_VERSIONS.indexOf(archive.version) === -1) {
        return json({ error: 'Unsupported export version ' + archive.version + '. This app supports: ' + SUPPORTED_IMPORT_VERSIONS.join(', ') + '.' }, 400);
      }
      var files = archive.files || {};
      var summary = { log: 0, reports: 0, propertyImages: 0, routes: 0 };

      if (mode === 'replace') {
        await clearFilesUnder('/photos/');
        await clearFilesUnder('/property-images/');
        var nd = migrateData(archive.data || {});
        await saveData(nd);
        await writeFilesUnder('/photos/', files.photos, false);
        await writeFilesUnder('/property-images/', files['property-images'], false);
        summary.log = (nd.log || []).length;
        summary.reports = Object.keys(nd.reports || {}).length;
        summary.propertyImages = (nd.propertyImages || []).length;
        summary.routes = (nd.routes || []).length;
      } else {
        var inc = archive.data || {};
        (inc.log || []).forEach(function(e) {
          if (data.log.some(function(x) { return x.id === e.id; })) return;
          data.log.push(e);
          summary.log++;
        });
        if (!data.reports) data.reports = {};
        Object.keys(inc.reports || {}).forEach(function(y) {
          if (!data.reports[y]) {
            data.reports[y] = inc.reports[y];
            if (inc.reportsMeta && inc.reportsMeta[y]) data.reportsMeta[y] = inc.reportsMeta[y];
            summary.reports++;
          }
        });
        (inc.propertyImages || []).forEach(function(img2) {
          if (!data.propertyImages.some(function(x) { return x.id === img2.id; })) {
            data.propertyImages.push(img2);
            summary.propertyImages++;
          }
        });
        if (!data.currentPropertyImageId && inc.currentPropertyImageId) {
          data.currentPropertyImageId = inc.currentPropertyImageId;
        }
        (inc.routes || []).forEach(function(r2) {
          if (!data.routes.some(function(x) { return x.id === r2.id; })) {
            data.routes.push(r2);
            summary.routes++;
          }
        });
        (inc.bucks || []).forEach(function(b2) {
          if (!data.bucks.some(function(x) { return x.id === b2.id; })) data.bucks.push(b2);
        });
        await saveData(data);
        await writeFilesUnder('/photos/', files.photos, true);
        await writeFilesUnder('/property-images/', files['property-images'], true);
      }
      return json({ ok: true, mode: mode, summary: summary });
    }

    if (pathname === '/api/clear-data' && method === 'POST') {
      await clearStore('kv');
      await clearStore('files');
      return json({ ok: true });
    }

    return json({ error: 'Unknown endpoint ' + method + ' ' + pathname }, 404);
  }

  // ── Qualifying-practice event types (shared by every page) ──

  // Single source of truth for the five qualifying-practice event types that
  // were split out of the old generic "Activity" type. Each has its own set
  // of fields that make sense for that practice. The activity log renders its
  // entry form from this, and the log/report/print/map views read summaries
  // and roll-ups from it, so the shape only has to be defined once.
  window.PRACTICE_FIELDS = {
    'Habitat Control': [
      { id: 'hc-method', label: 'Method', type: 'select', options: ['Prescribed Burning','Brush Management','Native Grass / Forb Planting','Mowing / Shredding','Disking','Herbicide / Chemical','Riparian / Wetland Enhancement','Wildlife-friendly Fencing','Other'] },
      { id: 'hc-area', label: 'Area / Pasture', type: 'text' },
      { id: 'hc-acres', label: 'Acres Treated', type: 'number' },
      { id: 'hc-notes', label: 'Notes', type: 'textarea' }
    ],
    'Erosion Control': [
      { id: 'ec-method', label: 'Method', type: 'select', options: ['Reseeding / Revegetation','Gully Shaping & Repair','Check Dams (rock / brush)','Terracing / Contour','Pond / Tank Construction','Streamside / Riparian Protection','Water Diversion','Other'] },
      { id: 'ec-location', label: 'Location / Site', type: 'text' },
      { id: 'ec-acres', label: 'Acres Stabilized', type: 'number' },
      { id: 'ec-notes', label: 'Notes', type: 'textarea' }
    ],
    'Supplemental Water': [
      { id: 'sw-source', label: 'Water Source', type: 'select', options: ['Trough','Wildlife Guzzler','Pond / Tank','Spring Development','Well / Windmill','Marsh / Wetland','Other'] },
      { id: 'sw-action', label: 'Action', type: 'select', options: ['Installed','Maintained / Cleaned','Filled / Refilled','Repaired'] },
      { id: 'sw-count', label: 'Number of Sources', type: 'number' },
      { id: 'sw-notes', label: 'Notes', type: 'textarea' }
    ],
    'Supplemental Food': [
      { id: 'sf-type', label: 'Food Type', type: 'select', options: ['Protein Feeder','Corn / Grain Feeder','Food Plot','Mineral Station','Hay / Forage','Other'] },
      { id: 'sf-count', label: 'Feeders / Stations', type: 'number' },
      { id: 'sf-acres', label: 'Food-plot Acres', type: 'number' },
      { id: 'sf-notes', label: 'Notes', type: 'textarea' }
    ],
    'Supplemental Shelter': [
      { id: 'ss-type', label: 'Shelter Type', type: 'select', options: ['Brush Pile','Nest Box','Half-cutting','Woody Cover Planting','Snag Retention','Hay Meadow Management','Fencerow / Edge','Other'] },
      { id: 'ss-count', label: 'Structures Placed', type: 'number' },
      { id: 'ss-acres', label: 'Acres', type: 'number' },
      { id: 'ss-species', label: 'Target Species', type: 'text' },
      { id: 'ss-notes', label: 'Notes', type: 'textarea' }
    ]
  };

  window.PRACTICE_TYPES = Object.keys(window.PRACTICE_FIELDS);

  // Which field holds "acres treated" for each practice (Supplemental Water
  // has none), used for the home-page acres roll-up and milestones.
  window.PRACTICE_ACRES_FIELD = {
    'Habitat Control': 'hc-acres', 'Erosion Control': 'ec-acres',
    'Supplemental Food': 'sf-acres', 'Supplemental Shelter': 'ss-acres'
  };

  // Practical, practice-specific advice shown above each practice form.
  window.PRACTICE_TIPS = {
    'Habitat Control': "💡 <strong>Tip:</strong> Habitat is the foundation — <strong>no amount of feed makes up for worn-out range</strong>. Keep brush in a mosaic (roughly half cover, half open) and treat in strips rather than clearing whole pastures. Time brush work and prescribed burns for late winter so native forbs respond in spring. Record acres treated and take before/after photos.",
    'Erosion Control': "💡 <strong>Tip:</strong> Hit bare ground and active gullies <strong>before they widen</strong> — head-cuts march uphill fast in a Texas downpour. Reseed disturbed soil with native grasses, set small rock checks in draws, and rest healing ground from grazing. Record acres stabilized and photograph the work; appraisers want to see it actually happened.",
    'Supplemental Water': "💡 <strong>Tip:</strong> Space water so animals are <strong>never more than about a mile from a drink</strong> — quail and fawns need it closer. Fit every trough with an escape ramp (rocks or wire) so birds and small game don't drown. In drought, check and top off on a set schedule and log each visit — reliable water is what holds wildlife on your place.",
    'Supplemental Food': "💡 <strong>Tip:</strong> Feed <strong>supplements</strong> good habitat, it doesn't replace it. Protein (16%+) pays off most April–September for antler growth and fawn survival; keep feeders clean and spread out to limit disease. A cool-season legume / forb food plot often beats bagged feed per dollar. Record what you put out, where, and how much.",
    'Supplemental Shelter': "💡 <strong>Tip:</strong> Build cover where it's missing — <strong>half-cut brush, brush piles, and left-standing fencerows</strong> give escape and thermal cover plus nesting sites. For quail, aim for scattered shrub clumps a covey can reach in a quick dash. Nest boxes only help where natural cavities are scarce. Note acres or the number of structures."
  };

  // Build the entry-form HTML for a practice type from its field definitions.
  window.renderPracticeForm = function(type) {
    var defs = window.PRACTICE_FIELDS[type] || [];
    function fieldHtml(f) {
      var inner;
      if (f.type === 'select') {
        inner = '<select id="' + f.id + '"><option value="">--</option>' +
          f.options.map(function(o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
      } else if (f.type === 'textarea') {
        inner = '<textarea id="' + f.id + '" rows="3"></textarea>';
      } else {
        inner = '<input type="' + (f.type === 'number' ? 'number' : 'text') + '" id="' + f.id + '">';
      }
      return '<div class="form-group"><label>' + f.label + '</label>' + inner + '</div>';
    }
    var rows = defs.filter(function(f) { return f.type !== 'textarea'; });
    var areas = defs.filter(function(f) { return f.type === 'textarea'; });
    return '<div class="entry-tip">' + (window.PRACTICE_TIPS[type] || '') + '</div>' +
      '<div class="form-row">' + rows.map(fieldHtml).join('') + '</div>' +
      areas.map(fieldHtml).join('');
  };

  // Short title for a practice log entry: the first filled descriptive field
  // (a method/type/name select or text — not a bare acres/count number, and
  // not the long notes), falling back to the practice name itself.
  window.practiceTitle = function(e) {
    var defs = window.PRACTICE_FIELDS[e.type] || [];
    for (var i = 0; i < defs.length; i++) {
      var f = defs[i];
      if ((f.type === 'select' || f.type === 'text') && e[f.id]) return e[f.id];
    }
    return e.type;
  };

  // [label, value] pairs for a practice entry's filled fields, for summaries.
  window.practiceSummaryPairs = function(e) {
    return (window.PRACTICE_FIELDS[e.type] || [])
      .filter(function(f) { return e[f.id]; })
      .map(function(f) { return [f.label, e[f.id]]; });
  };

  // ── fetch patch ──

  // Photo/property-image filenames round-trip through user-importable backup
  // files, so pages must treat them as untrusted before splicing them into
  // HTML attributes (src/onerror/href). Shared here since every page loads
  // store.js first.
  window.sanFn = function(name) {
    return String(name == null ? '' : name).replace(/[^A-Za-z0-9._-]/g, '');
  };

  var realFetch = window.fetch.bind(window);
  window.fetch = function(input, init) {
    var url = (typeof input === 'string') ? input : input.url;
    var a = document.createElement('a');
    a.href = url;
    if (a.pathname.indexOf('/api/') === 0 || a.pathname.indexOf('api/') === 0) {
      var pathname = a.pathname.charAt(0) === '/' ? a.pathname : '/' + a.pathname;
      var method = ((init && init.method) || (typeof input !== 'string' && input.method) || 'GET').toUpperCase();
      return handleApi(method, pathname, init).catch(function(err) {
        return json({ error: String(err && err.message || err) }, 500);
      });
    }
    return realFetch(input, init);
  };

  // ── Service worker: serves /photos/* and /property-images/* from IndexedDB ──

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function() { /* images degrade */ });
  }
})();
