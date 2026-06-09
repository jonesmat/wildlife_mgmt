// Shared helpers for print templates

function cb(checked) {
  return `<span class="box-check${checked ? ' checked' : ''}"></span>`;
}

function field(label, value, style = '') {
  return `<div class="field" style="${style}"><label>${label}</label><div class="line">${esc(value) || '&nbsp;'}</div></div>`;
}

function fieldMulti(label, value) {
  return `<div class="field"><label>${label}</label><div class="multiline">${esc(value) || '&nbsp;'}</div></div>`;
}

function esc(v) {
  if (!v) return '';
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function cbItem(label, checked) {
  return `<div class="cb">${cb(checked)} ${esc(label)}</div>`;
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

function renderActivitiesPrint(a, prefix) {
  const hc = a.habitatControl || {};
  const ec = a.erosionControl || {};
  const pc = a.predatorControl || {};
  const sw = a.supplementalWater || {};
  const sf = a.supplementalFood || {};
  const ss = a.supplementalShelter || {};
  const ce = a.census || {};

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

function activityRow(label, checked, detailHtml) {
  return `
    <div style="margin-bottom:6pt; padding-bottom:5pt; border-bottom:0.5pt solid #ddd;">
      <div class="cb" style="font-weight:${checked?'700':'400'}">${cb(checked)} <em>${esc(label)}</em></div>
      ${checked ? detailHtml : ''}
    </div>`;
}
