function renderActivities(dataPrefix, activitiesData) {
  const container = document.getElementById('activitiesSection');
  if (!container) return;
  container.innerHTML = getActivitiesHTML(dataPrefix);
}

function getActivitiesHTML(prefix) {
  return `
    <!-- 1. Habitat Control -->
    <div class="section" id="habitat">
      <div class="section-title">Part VIII — 1. Habitat Control</div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.grazingManagement"> <strong>Grazing Management</strong></label>
        <div class="hint" style="margin-left:22px">Rotational grazing allows vegetation recovery between grazing periods, improving habitat structure and forage quality for wildlife</div>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Grazing system:</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="radio" name="grazingSystem" value="1herd3pasture" data-path="${prefix}.habitatControl.grazingSystem"> 1 herd/3 pasture</label>
              <label class="checkbox-item"><input type="radio" name="grazingSystem" value="1herd4pasture" data-path="${prefix}.habitatControl.grazingSystem"> 1 herd/4 pasture</label>
              <label class="checkbox-item"><input type="radio" name="grazingSystem" value="1herdMultiple" data-path="${prefix}.habitatControl.grazingSystem"> 1 herd/multiple pasture</label>
              <label class="checkbox-item"><input type="radio" name="grazingSystem" value="hilf" data-path="${prefix}.habitatControl.grazingSystem"> High intensity/low frequency (HILF)</label>
              <label class="checkbox-item"><input type="radio" name="grazingSystem" value="shortDuration" data-path="${prefix}.habitatControl.grazingSystem"> Short duration system</label>
              <label class="checkbox-item"><input type="radio" name="grazingSystem" value="other" data-path="${prefix}.habitatControl.grazingSystem"> Other</label>
            </div>
          </div>
          <div class="form-group"><label>Other grazing system description / Additional Information</label><input type="text" data-path="${prefix}.habitatControl.grazingInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.prescribedBurning"> <strong>Prescribed Burning</strong></label>
        <div class="hint" style="margin-left:22px">Stimulates new plant growth, controls brush encroachment, and improves habitat for many wildlife species. Consult your local TPWD biologist or NRCS for burn plan guidance before burning.</div>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Acres to be burned</label><input type="number" data-path="${prefix}.habitatControl.burnAcres"></div>
            <div class="form-group"><label>Planned burn date</label><input type="text" data-path="${prefix}.habitatControl.burnDate"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.habitatControl.burnInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.rangeEnhancement"> <strong>Range Enhancement (Range Reseeding)</strong></label>
        <div class="hint" style="margin-left:22px">Use locally adapted native plant species when possible. Native grasses and forbs provide better year-round wildlife habitat than improved varieties.</div>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Acres to be seeded</label><input type="number" data-path="${prefix}.habitatControl.reseededAcres"></div>
            <div class="form-group"><label>Date to be seeded</label><input type="text" data-path="${prefix}.habitatControl.reseededDate"></div>
          </div>
          <div class="form-group"><label>Seeding Method</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="radio" name="${prefix}seedMethod" value="broadcast" data-path="${prefix}.habitatControl.seedingMethod"> Broadcast</label>
              <label class="checkbox-item"><input type="radio" name="${prefix}seedMethod" value="drilled" data-path="${prefix}.habitatControl.seedingMethod"> Drilled</label>
              <label class="checkbox-item"><input type="radio" name="${prefix}seedMethod" value="nativeHay" data-path="${prefix}.habitatControl.seedingMethod"> Native Hay</label>
            </div>
          </div>
          <div class="form-group"><label>Seeding mixture to be used</label><input type="text" data-path="${prefix}.habitatControl.seedingMixture"></div>
          <div class="row">
            <div class="form-group"><label>Fertilized?</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}reseedFert" value="true" data-path="${prefix}.habitatControl.reseededFertilized"> Yes</label>
                <label class="radio-item"><input type="radio" name="${prefix}reseedFert" value="false" data-path="${prefix}.habitatControl.reseededFertilized"> No</label>
              </div>
            </div>
            <div class="form-group"><label>Weed control needed?</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}reseedWeed" value="true" data-path="${prefix}.habitatControl.reseededWeedControl"> Yes</label>
                <label class="radio-item"><input type="radio" name="${prefix}reseedWeed" value="false" data-path="${prefix}.habitatControl.reseededWeedControl"> No</label>
              </div>
            </div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.habitatControl.reseededInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.brushManagement"> <strong>Brush Management</strong></label>
        <div class="hint" style="margin-left:22px">Design brush work in patterns (blocks, strips, or mosaics) to maximize edge habitat between brush and open areas. Avoid clearing more than 50% of a pasture at one time.</div>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Acres to be treated</label><input type="number" data-path="${prefix}.habitatControl.brushAcres"></div>
          <div class="form-group"><label>Mechanical methods:</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.brushMechanical"> Mechanical</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.brushChemical"> Chemical</label>
            </div>
          </div>
          <div class="form-group"><label>Mechanical method details (grubber, chain, roller chopper, brush hog, dozer, chainsaw, hydraulic shears, etc.)</label><input type="text" data-path="${prefix}.habitatControl.brushMechanicalDetail"></div>
          <div class="row">
            <div class="form-group"><label>Chemical kind</label><input type="text" data-path="${prefix}.habitatControl.brushChemicalKind"></div>
            <div class="form-group"><label>Rate</label><input type="text" data-path="${prefix}.habitatControl.brushChemicalRate"></div>
          </div>
          <div class="form-group"><label>Brush management design</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="radio" name="${prefix}brushDesign" value="block" data-path="${prefix}.habitatControl.brushDesign"> Block</label>
              <label class="checkbox-item"><input type="radio" name="${prefix}brushDesign" value="mosaic" data-path="${prefix}.habitatControl.brushDesign"> Mosaic</label>
              <label class="checkbox-item"><input type="radio" name="${prefix}brushDesign" value="strips" data-path="${prefix}.habitatControl.brushDesign"> Strips</label>
            </div>
          </div>
          <div class="row">
            <div class="form-group"><label>Strip width</label><input type="text" data-path="${prefix}.habitatControl.brushStripsWidth"></div>
            <div class="form-group"><label>Strip length</label><input type="text" data-path="${prefix}.habitatControl.brushStripsLength"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.habitatControl.brushInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.fenceModification"> <strong>Fence Modification</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Target species</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="radio" name="${prefix}fenceSpecies" value="pronghorn" data-path="${prefix}.habitatControl.fenceTargetSpecies"> Pronghorn antelope</label>
              <label class="checkbox-item"><input type="radio" name="${prefix}fenceSpecies" value="bighorn" data-path="${prefix}.habitatControl.fenceTargetSpecies"> Bighorn sheep</label>
            </div>
          </div>
          <div class="form-group"><label>Technique / Gap width / Miles</label><input type="text" data-path="${prefix}.habitatControl.fenceInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.riparian"> <strong>Riparian Management and Enhancement</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Fencing of riparian area</label>
            <div class="radio-group">
              <label class="radio-item"><input type="radio" name="${prefix}riparianFence" value="complete" data-path="${prefix}.habitatControl.riparianFencing"> Complete fencing</label>
              <label class="radio-item"><input type="radio" name="${prefix}riparianFence" value="partial" data-path="${prefix}.habitatControl.riparianFencing"> Partial fencing</label>
              <label class="radio-item"><input type="radio" name="${prefix}riparianFence" value="none" data-path="${prefix}.habitatControl.riparianFencing"> None</label>
            </div>
          </div>
          <div class="form-group"><label>Deferment from livestock grazing</label>
            <div class="radio-group">
              <label class="radio-item"><input type="radio" name="${prefix}riparianDefer" value="complete" data-path="${prefix}.habitatControl.riparianDeferment"> Complete deferment</label>
              <label class="radio-item"><input type="radio" name="${prefix}riparianDefer" value="partial" data-path="${prefix}.habitatControl.riparianDeferment"> Partial deferment</label>
              <label class="radio-item"><input type="radio" name="${prefix}riparianDefer" value="none" data-path="${prefix}.habitatControl.riparianDeferment"> None</label>
            </div>
          </div>
          <div class="form-group"><label>Season deferred</label><input type="text" data-path="${prefix}.habitatControl.riparianDefermentSeason"></div>
          <div class="row">
            <div class="form-group"><label>Trees established (list species)</label><input type="text" data-path="${prefix}.habitatControl.riparianTrees"></div>
            <div class="form-group"><label>Shrubs established (list species)</label><input type="text" data-path="${prefix}.habitatControl.riparianShrubs"></div>
            <div class="form-group"><label>Herbaceous species</label><input type="text" data-path="${prefix}.habitatControl.riparianHerbaceous"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.habitatControl.riparianInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.wetlandEnhancement"> <strong>Wetland Enhancement</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.wetlandSeasonal"> Provide seasonal water</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.wetlandPermanent"> Provide permanent water</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.wetlandMoistSoil"> Moist soil management</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Other / Additional Information</label><input type="text" data-path="${prefix}.habitatControl.wetlandInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.habitatProtection"> <strong>Habitat Protection for Species of Concern</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.hpFencing"> Fencing</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.hpFirebreaks"> Firebreaks</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.hpBurning"> Prescribed burning</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.hpNestParasites"> Control of nest parasites</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.hpHabManip"> Habitat manipulation (thinning, etc.)</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.hpUngulate"> Native/exotic ungulate control</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Other / Additional Information</label><input type="text" data-path="${prefix}.habitatControl.habitatProtectionInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.prescribedControl"> <strong>Prescribed Control of Native, Exotic and Feral Species</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.prescribedControlVegetation"> Prescribed control of vegetation</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.prescribedControlAnimals"> Prescribed control of animal species</label>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="form-group"><label>Species being controlled</label><input type="text" data-path="${prefix}.habitatControl.prescribedControlSpecies"></div>
            <div class="form-group"><label>Method of control</label><input type="text" data-path="${prefix}.habitatControl.prescribedControlMethod"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.habitatControl.prescribedControlInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.wildlifeRestoration"> <strong>Wildlife Restoration</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.restorationHabitat"> Habitat restoration</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.habitatControl.restorationWildlife"> Wildlife restoration</label>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="form-group"><label>Target species</label><input type="text" data-path="${prefix}.habitatControl.restorationTargetSpecies"></div>
            <div class="form-group"><label>Method of restoration</label><input type="text" data-path="${prefix}.habitatControl.restorationMethod"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.habitatControl.restorationInfo"></div>
        </div>
      </div>
    </div>

    <!-- 2. Erosion Control -->
    <div class="section" id="erosion">
      <div class="section-title">Part VIII — 2. Erosion Control</div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.pondConstruction"> <strong>Pond Construction and Repair</strong></label>
        <div class="hint" style="margin-left:22px">Fencing livestock away from ponds greatly improves water quality and riparian vegetation for wildlife. Include livestock exclusion if constructing or repairing.</div>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Surface area (acres)</label><input type="number" data-path="${prefix}.erosionControl.pondSurfaceArea"></div>
            <div class="form-group"><label>Cubic yards of soil displaced</label><input type="number" data-path="${prefix}.erosionControl.pondCubicYards"></div>
            <div class="form-group"><label>Length of dam (feet)</label><input type="number" data-path="${prefix}.erosionControl.pondDamLength"></div>
            <div class="form-group"><label>Planned date of construction</label><input type="text" data-path="${prefix}.erosionControl.pondDate"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.erosionControl.pondInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.gullyShaping"> <strong>Gully Shaping</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Total acres to be treated</label><input type="number" data-path="${prefix}.erosionControl.gullyAcres"></div>
            <div class="form-group"><label>Acres treated annually</label><input type="number" data-path="${prefix}.erosionControl.gullyAcresAnnual"></div>
            <div class="form-group"><label>Planned date</label><input type="text" data-path="${prefix}.erosionControl.gullyDate"></div>
          </div>
          <div class="form-group"><label>Seeding mix for vegetation reestablishment</label><input type="text" data-path="${prefix}.erosionControl.gullySeedingMix"></div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.erosionControl.gullyInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamside"> <strong>Streamside, Pond, and Wetland Revegetation</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamsideHayBales"> Native hay bales</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamsideFencing"> Fencing</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamsideFilterStrips"> Filter strips</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamsideUplandBuffer"> Seeding upland buffer</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamsideRiprap"> Rip-rap, etc.</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.streamsideCrossings"> Stream crossings</label>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="form-group"><label>Other techniques</label><input type="text" data-path="${prefix}.erosionControl.streamsideOther"></div>
            <div class="form-group"><label>Planned date</label><input type="text" data-path="${prefix}.erosionControl.streamsideDate"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.erosionControl.streamsideInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.plantEstablishment"> <strong>Herbaceous and/or Woody Plant Establishment on Critical Areas</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.peWindbreak"> Establish windbreak</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.peShrubMottes"> Establish shrub mottes</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.pePlantDiversity"> Improve plant diversity</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.peWildlifeHabitat"> Improve wildlife habitat</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.peNoTill"> Conservation/no-till practices</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.peCRP"> Manage CRP cover</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Additional Information</label><input type="text" data-path="${prefix}.erosionControl.plantEstablishmentInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.dikeLevee"> <strong>Dike/Levee Construction/Management</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.dikeReshaping"> Reshaping/repairing erosion damage</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.dikeReveg"> Revegetating/stabilize levee areas</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.dikeWaterControl"> Install water control structure</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.dikeFencing"> Fencing</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Additional Information</label><input type="text" data-path="${prefix}.erosionControl.dikeInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.erosionControl.waterDiversion"> <strong>Establish Water Diversion</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Type</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}wdType" value="channel" data-path="${prefix}.erosionControl.waterDiversionType"> Channel</label>
                <label class="radio-item"><input type="radio" name="${prefix}wdType" value="ridge" data-path="${prefix}.erosionControl.waterDiversionType"> Ridge</label>
              </div>
            </div>
            <div class="form-group"><label>Slope</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}wdSlope" value="level" data-path="${prefix}.erosionControl.waterDiversionSlope"> Level</label>
                <label class="radio-item"><input type="radio" name="${prefix}wdSlope" value="graded" data-path="${prefix}.erosionControl.waterDiversionSlope"> Graded</label>
              </div>
            </div>
            <div class="form-group"><label>Length (feet)</label><input type="number" data-path="${prefix}.erosionControl.waterDiversionLength"></div>
          </div>
          <div class="row">
            <div class="form-group"><label>Vegetated native species</label><input type="text" data-path="${prefix}.erosionControl.waterDiversionNative"></div>
            <div class="form-group"><label>Vegetated crop</label><input type="text" data-path="${prefix}.erosionControl.waterDiversionCrop"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.erosionControl.waterDiversionInfo"></div>
        </div>
      </div>
    </div>

    <!-- 3. Predator Control -->
    <div class="section" id="predator">
      <div class="section-title">Part VIII — 3. Predator Control</div>
      <div class="hint-block">List all predator species actively controlled and the methods used. Some methods require state or federal licenses — see notes on individual items below.</div>
      <div class="sub-section">
        <div class="section-subtitle" style="margin-top:0">Birds</div>
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.fireAnts"> Imported red fire ants <span class="hint" style="font-style:italic">(verify product is labeled for pasture use before applying)</span></label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.cowbirds"> Control of cowbirds</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.grackles"> Grackle/starling/house sparrow control</label>
        </div>
        <div class="form-group" style="margin-top:8px"><label>Method of bird control:</label>
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.birdTrapping"> Trapping</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.birdShooting"> Shooting</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.birdBaiting"> Baiting</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.birdScare"> Scare tactics</label>
          </div>
        </div>
        <div class="section-subtitle">Mammals</div>
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.coyotes"> Coyotes</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.feralHogs"> Feral hogs</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.raccoon"> Raccoon</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.skunk"> Skunk</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.bobcat"> Bobcat</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.mountainLion"> Mountain lion</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.ratSnakes"> Rat snakes</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.feralCatsDogs"> Feral cats/dogs</label>
        </div>
        <div class="form-group" style="margin-top:8px"><label>Method of mammal control:</label>
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.mammalTrapping"> Trapping</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.mammalShooting"> Shooting</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.mammalM44"> M-44 <span class="hint">(licensed applicators only)</span></label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.predatorControl.mammalPoison"> Poison collars <span class="hint">(1080 certified &amp; licensed applicator only)</span></label>
          </div>
        </div>
        <div class="form-group"><label>Other method / Additional Information</label><input type="text" data-path="${prefix}.predatorControl.additionalInfo"></div>
      </div>
    </div>

    <!-- 4. Supplemental Water -->
    <div class="section" id="water">
      <div class="section-title">Part VIII — 4. Supplemental Water</div>
      <div class="hint-block">Reliable water sources are critical in arid regions. Recommended spacing: quail within ¼ mile, deer within ½ mile. Ensure water is accessible to wildlife, not just livestock.</div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.marshWetland"> <strong>Marsh/Wetland Restoration or Development</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwGreentree"> Greentree reservoirs</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwRoostPond"> Shallow roost pond development</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwFloodedCrops"> Seasonally flooded crops</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwArtificial"> Artificially created wetlands</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwMarshRestore"> Marsh restoration/development/protection</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwPrairiePothole"> Prairie pothole restoration/development/protection</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.mwMoistSoil"> Moist soil management units</label>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="form-group"><label>Planned date of construction</label><input type="text" data-path="${prefix}.supplementalWater.marshDate"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalWater.marshInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.wellTrough"> <strong>Well/Trough/Windmill/Other Wildlife Watering Facilities</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.drillNewWell"> Drill new well</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.windmill"> Windmill</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.pump"> Pump</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.pipeline"> Pipeline</label>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="form-group"><label>Well depth</label><input type="text" data-path="${prefix}.supplementalWater.wellDepth"></div>
            <div class="form-group"><label>GPM</label><input type="number" data-path="${prefix}.supplementalWater.wellGPM"></div>
            <div class="form-group"><label>Pipeline size</label><input type="text" data-path="${prefix}.supplementalWater.pipelineSize"></div>
            <div class="form-group"><label>Pipeline length</label><input type="text" data-path="${prefix}.supplementalWater.pipelineLength"></div>
          </div>
          <div class="form-group"><label>Modification of existing water source (fencing, overflow, trough modification, pipeline)</label><input type="text" data-path="${prefix}.supplementalWater.modifyDetail"></div>
          <div class="form-group"><label>Distance between water sources</label><input type="text" data-path="${prefix}.supplementalWater.distanceBetween"></div>
          <div class="form-group"><label>Type(s) of wildlife watering facility (PVC pipe, drum, small game guzzler, big game guzzler, etc.) and counts</label><textarea data-path="${prefix}.supplementalWater.facilityInfo" style="min-height:60px"></textarea><div class="hint">List each type with quantity, e.g. "2 big game guzzlers, 3 small game guzzlers, 1 PVC pipe facility"</div></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.springDevelopment"> <strong>Spring Development and/or Enhancement</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.springFencing"> Fencing</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.springDiversion"> Water diversion/pipeline</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.springBrushRemoval"> Brush removal</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalWater.springCleanOut"> Spring clean out</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Other / Additional Information</label><input type="text" data-path="${prefix}.supplementalWater.springInfo"></div>
        </div>
      </div>
    </div>

    <!-- 5. Supplemental Food -->
    <div class="section" id="food">
      <div class="section-title">Part VIII — 5. Providing Supplemental Food</div>
      <div class="hint-block">Food supplementation reduces nutritional stress during drought and winter. Native food sources (grazing management, prescribed burning, range enhancement) are preferred over artificial feeders as primary food sources.</div>

      <div class="sub-section">
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.grazingManagement"> Grazing management</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.prescribedBurning"> Prescribed burning</label>
          <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.rangeEnhancement"> Range enhancement</label>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.foodPlots"> <strong>Food Plots</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Size</label><input type="text" data-path="${prefix}.supplementalFood.foodPlotSize"></div>
            <div class="form-group"><label>Fenced?</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}fpFenced" value="true" data-path="${prefix}.supplementalFood.foodPlotFenced"> Yes</label>
                <label class="radio-item"><input type="radio" name="${prefix}fpFenced" value="false" data-path="${prefix}.supplementalFood.foodPlotFenced"> No</label>
              </div>
            </div>
            <div class="form-group"><label>Irrigated?</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}fpIrrig" value="true" data-path="${prefix}.supplementalFood.foodPlotIrrigated"> Yes</label>
                <label class="radio-item"><input type="radio" name="${prefix}fpIrrig" value="false" data-path="${prefix}.supplementalFood.foodPlotIrrigated"> No</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalFood.coolSeasonCrops"> Cool season annual crops</label><input type="text" data-path="${prefix}.supplementalFood.coolSeasonCropsDetail"></div>
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalFood.warmSeasonCrops"> Warm season annual crops</label><input type="text" data-path="${prefix}.supplementalFood.warmSeasonCropsDetail"></div>
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalFood.annualNativeMix"> Annual mix of native plants</label><input type="text" data-path="${prefix}.supplementalFood.annualNativeMixDetail"></div>
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalFood.perennialNativeMix"> Perennial mix of native plants</label><input type="text" data-path="${prefix}.supplementalFood.perennialNativeMixDetail"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalFood.foodPlotInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.feeders"> <strong>Feeders and Mineral Supplementation</strong></label>
        <div class="hint" style="margin-left:22px">Year-round protein feeders (20%+ protein) support antler development, body condition, and fawn survival. Mineral supplementation is most beneficial April–September during antler growth.</div>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Purpose</label>
            <div class="radio-group">
              <label class="radio-item"><input type="radio" name="${prefix}feederPurpose" value="supplementation" data-path="${prefix}.supplementalFood.feederPurpose"> Supplementation</label>
              <label class="radio-item"><input type="radio" name="${prefix}feederPurpose" value="harvesting" data-path="${prefix}.supplementalFood.feederPurpose"> Harvesting of wildlife</label>
            </div>
          </div>
          <div class="row">
            <div class="form-group"><label>Targeted wildlife species</label><input type="text" data-path="${prefix}.supplementalFood.feederTargetSpecies"></div>
            <div class="form-group"><label>Feed type</label><input type="text" data-path="${prefix}.supplementalFood.feedType"></div>
            <div class="form-group"><label>Mineral type</label><input type="text" data-path="${prefix}.supplementalFood.mineralType"></div>
          </div>
          <div class="row">
            <div class="form-group"><label>Feeder type</label><input type="text" data-path="${prefix}.supplementalFood.feederType"></div>
            <div class="form-group"><label>Number of feeders</label><input type="number" data-path="${prefix}.supplementalFood.feederCount"></div>
            <div class="form-group"><label>Method of mineral dispensing</label><input type="text" data-path="${prefix}.supplementalFood.mineralMethod"></div>
            <div class="form-group"><label>Number of mineral locations</label><input type="number" data-path="${prefix}.supplementalFood.mineralLocations"></div>
          </div>
          <div class="row">
            <div class="form-group"><label>Year round?</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}feederYr" value="true" data-path="${prefix}.supplementalFood.feederYearRound"> Yes</label>
                <label class="radio-item"><input type="radio" name="${prefix}feederYr" value="false" data-path="${prefix}.supplementalFood.feederYearRound"> No</label>
              </div>
            </div>
            <div class="form-group"><label>If not, state when</label><input type="text" data-path="${prefix}.supplementalFood.feederWhen"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalFood.feederInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tamePasture"> <strong>Managing Tame Pasture, Old Fields and Croplands</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tamePastureOverseeding"> Overseeding cool/warm season legumes and/or small grains</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tamePastureDisturbance"> Periodic disturbance (Discing/Mowing/Shredding)</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tamePastureNoTill"> Conservation/no-till</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalFood.tamePastureInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tameGrass"> <strong>Transition Management of Tame Grass Monocultures</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Overseed 25% of tame grass pastures with locally adapted legumes. Species planted:</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tameGrassClover"> Clover</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tameGrassPeas"> Peas</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalFood.tameGrassVetch"> Vetch</label>
            </div>
          </div>
          <div class="form-group"><label>Other species / Additional Information</label><input type="text" data-path="${prefix}.supplementalFood.tameGrassInfo"></div>
        </div>
      </div>
    </div>

    <!-- 6. Supplemental Shelter -->
    <div class="section" id="shelter">
      <div class="section-title">Part VIII — 6. Providing Supplemental Shelter</div>
      <div class="hint-block">Shelter provides thermal cover, escape cover, and nesting sites. Brush piles, woody thickets, and native plantings benefit a wider variety of species than artificial structures alone.</div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.nestBoxes"> <strong>Nest Boxes</strong></label>
        <div class="hint" style="margin-left:22px">Box dimensions and entrance hole size are species-specific. Consult TPWD guidelines for Eastern bluebird, wood duck, screech owl, kestrel, and other cavity-nesting species.</div>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Target species</label><input type="text" data-path="${prefix}.supplementalShelter.nestBoxTargetSpecies"></div>
          <div class="row">
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalShelter.nestBoxCavity"> Cavity type #</label><input type="number" data-path="${prefix}.supplementalShelter.nestBoxCavityCount"></div>
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalShelter.nestBoxBat"> Bat boxes #</label><input type="number" data-path="${prefix}.supplementalShelter.nestBoxBatCount"></div>
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalShelter.nestBoxRaptor"> Raptor pole #</label><input type="number" data-path="${prefix}.supplementalShelter.nestBoxRaptorCount"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.nestBoxInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.brushPiles"> <strong>Brush Piles and Slash Retention</strong></label>
        <div class="hint" style="margin-left:22px">3–5 brush piles per acre benefit quail, small mammals, and other ground-dwelling species. Piles should be 4–6 feet tall and 8–10 feet in diameter.</div>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Type</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}brushPileType" value="slash" data-path="${prefix}.supplementalShelter.brushPileType"> Slash</label>
                <label class="radio-item"><input type="radio" name="${prefix}brushPileType" value="brushPiles" data-path="${prefix}.supplementalShelter.brushPileType"> Brush piles</label>
              </div>
            </div>
            <div class="form-group"><label>Number per acre</label><input type="number" data-path="${prefix}.supplementalShelter.brushPilePerAcre"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.brushPileInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.fenceLineMgmt"> <strong>Fence Line Management</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Length</label><input type="text" data-path="${prefix}.supplementalShelter.fenceLineLength"></div>
            <div class="form-group"><label>Initial establishment?</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}flInitial" value="true" data-path="${prefix}.supplementalShelter.fenceLineInitial"> Yes</label>
                <label class="radio-item"><input type="radio" name="${prefix}flInitial" value="false" data-path="${prefix}.supplementalShelter.fenceLineInitial"> No</label>
              </div>
            </div>
          </div>
          <div class="form-group"><label>Plant type established</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.flTrees"> Trees</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.flShrubs"> Shrubs</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.flForbs"> Forbs</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.flGrasses"> Grasses</label>
            </div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.fenceLineInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.hayMeadow"> <strong>Hay Meadow, Pasture and Cropland Management for Wildlife</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Acres treated</label><input type="number" data-path="${prefix}.supplementalShelter.hayMeadowAcres"></div>
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.hmRoadside"> Roadside management</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.hmTerrace"> Terrace/wind breaks</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.hmFieldBorders"> Field borders</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.hmShelterbelts"> Shelterbelts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.hmCRP"> Conservation Reserve Program lands management</label>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="form-group"><label>Vegetation type</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}hmVeg" value="annual" data-path="${prefix}.supplementalShelter.hayMeadowVegType"> Annual</label>
                <label class="radio-item"><input type="radio" name="${prefix}hmVeg" value="perennial" data-path="${prefix}.supplementalShelter.hayMeadowVegType"> Perennial</label>
              </div>
            </div>
          </div>
          <div class="form-group"><label>Species and percent of mixture</label><input type="text" data-path="${prefix}.supplementalShelter.hayMeadowSpeciesMix"></div>
          <div class="row">
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalShelter.deferredMowing"> Deferred mowing — period of deferment</label><input type="text" data-path="${prefix}.supplementalShelter.deferredMowingPeriod"></div>
            <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalShelter.mowing"> Mowing — acres mowed annually</label><input type="number" data-path="${prefix}.supplementalShelter.mowingAcres"></div>
          </div>
          <div class="form-group"><label><input type="checkbox" data-path="${prefix}.supplementalShelter.noTill"> No till/minimum till</label></div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.hayMeadowInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.halfCutting"> <strong>Half-Cutting Trees or Shrubs</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Acreage treated annually</label><input type="number" data-path="${prefix}.supplementalShelter.halfCuttingAcres"></div>
            <div class="form-group"><label>Number of half-cuts annually</label><input type="number" data-path="${prefix}.supplementalShelter.halfCuttingCount"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.halfCuttingInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.woodyPlant"> <strong>Woody Plant/Shrub Establishment</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Pattern</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}woodyPattern" value="block" data-path="${prefix}.supplementalShelter.woodyPattern"> Block</label>
                <label class="radio-item"><input type="radio" name="${prefix}woodyPattern" value="mosaic" data-path="${prefix}.supplementalShelter.woodyPattern"> Mosaic</label>
                <label class="radio-item"><input type="radio" name="${prefix}woodyPattern" value="strips" data-path="${prefix}.supplementalShelter.woodyPattern"> Strips</label>
              </div>
            </div>
            <div class="form-group"><label>Strip width</label><input type="text" data-path="${prefix}.supplementalShelter.woodyStripsWidth"></div>
          </div>
          <div class="row">
            <div class="form-group"><label>Acreage/length established annually</label><input type="text" data-path="${prefix}.supplementalShelter.woodyAcresLength"></div>
            <div class="form-group"><label>Spacing</label><input type="text" data-path="${prefix}.supplementalShelter.woodySpacing"></div>
            <div class="form-group"><label>Shrub/tree species used</label><input type="text" data-path="${prefix}.supplementalShelter.woodySpecies"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.woodyInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.supplementalShelter.snagDevelopment"> <strong>Natural Cavity/Snag Development</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Species of snag</label><input type="text" data-path="${prefix}.supplementalShelter.snagSpecies"></div>
            <div class="form-group"><label>Size of snags</label><input type="text" data-path="${prefix}.supplementalShelter.snagSize"></div>
            <div class="form-group"><label>Number/acre</label><input type="number" data-path="${prefix}.supplementalShelter.snagPerAcre"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.supplementalShelter.snagInfo"></div>
        </div>
      </div>
    </div>

    <!-- 7. Census -->
    <div class="section" id="census">
      <div class="section-title">Part VIII — 7. Census</div>
      <div class="hint-block">Population surveys provide the data needed to make sound harvest and management decisions. At least one census method should be conducted annually. Keep written records — they may be requested by the county appraiser.</div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.spotlightCounts"> <strong>Spotlight Counts</strong></label>
        <div class="hint" style="margin-left:22px"><strong>3 count dates are required.</strong> Conduct counts on the same route under similar conditions (no rain, low wind). Record all deer seen by sex and age class.</div>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Targeted species</label><input type="text" data-path="${prefix}.census.spotlightSpecies"></div>
            <div class="form-group"><label>Length of route</label><input type="text" data-path="${prefix}.census.spotlightRouteLength"></div>
            <div class="form-group"><label>Visibility of route</label><input type="text" data-path="${prefix}.census.spotlightVisibility"></div>
          </div>
          <div class="row">
            <div class="form-group"><label>Date A</label><input type="text" data-path="${prefix}.census.spotlightDateA"></div>
            <div class="form-group"><label>Date B</label><input type="text" data-path="${prefix}.census.spotlightDateB"></div>
            <div class="form-group"><label>Date C</label><input type="text" data-path="${prefix}.census.spotlightDateC"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.spotlightInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.incidentalObservations"> <strong>Standardized Incidental Observations</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Targeted species</label><input type="text" data-path="${prefix}.census.incidentalSpecies"></div>
          <div class="form-group"><label>Observations from:</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.incidentalFeeders"> Feeders</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.incidentalFoodPlots"> Food plots</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.incidentalBlinds"> Blinds</label>
              <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.incidentalVehicle"> Vehicle</label>
            </div>
          </div>
          <div class="form-group"><label>Other sources / Dates</label><input type="text" data-path="${prefix}.census.incidentalDates"></div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.incidentalInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.standCounts"> <strong>Stand Counts of Deer</strong> <span style="font-weight:normal;font-size:0.85rem">(5 one-hour counts per stand required)</span></label>
        <div class="hint" style="margin-left:22px"><strong>5 one-hour observation sessions per stand are required.</strong> Conduct during early morning or late evening. Record all deer seen by sex and age class each session.</div>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Number of stands</label><input type="number" data-path="${prefix}.census.standCountStands"></div>
            <div class="form-group"><label>Dates</label><input type="text" data-path="${prefix}.census.standCountDates"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.standCountInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.aerialCounts"> <strong>Aerial Counts</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Species counted</label><input type="text" data-path="${prefix}.census.aerialSpecies"></div>
            <div class="form-group"><label>Survey type</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}aerialType" value="helicopter" data-path="${prefix}.census.aerialType"> Helicopter</label>
                <label class="radio-item"><input type="radio" name="${prefix}aerialType" value="fixedWing" data-path="${prefix}.census.aerialType"> Fixed-wing</label>
              </div>
            </div>
            <div class="form-group"><label>% area surveyed</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="${prefix}aerialCoverage" value="total" data-path="${prefix}.census.aerialCoverage"> Total</label>
                <label class="radio-item"><input type="radio" name="${prefix}aerialCoverage" value="50pct" data-path="${prefix}.census.aerialCoverage"> 50%</label>
                <label class="radio-item"><input type="radio" name="${prefix}aerialCoverage" value="other" data-path="${prefix}.census.aerialCoverage"> Other</label>
              </div>
            </div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.aerialInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.trackCounts"> <strong>Track Counts</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.trackPredators"> Predators</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.trackFurbearers"> Furbearers</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.trackDeer"> Deer</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Other / Additional Information</label><input type="text" data-path="${prefix}.census.trackCountInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.daylightCounts"> <strong>Daylight Deer Herd/Wildlife Composition Counts</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.daylightDeer"> Deer</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.daylightTurkey"> Turkey</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.daylightDove"> Dove</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.daylightQuail"> Quail</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Other / Additional Information</label><input type="text" data-path="${prefix}.census.daylightInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestData"> <strong>Harvest Data Collection/Record Keeping</strong></label>
        <div class="hint" style="margin-left:22px">Consistent harvest records are one of the most valuable long-term management tools. Photograph harvested deer and record weight, age (tooth wear or cementum annuli), sex, antler measurements, and date. Keep records for each year.</div>
        <div class="indent" style="margin-top:8px">
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestDeer"> Deer</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestGameBirds"> Game birds</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestAge"> Age</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestWeight"> Weight</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestSex"> Sex</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestAntler"> Antler data</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.harvestDate"> Harvest date</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Additional Information</label><input type="text" data-path="${prefix}.census.harvestInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.browseUtilization"> <strong>Browse Utilization Surveys</strong> <span style="font-weight:normal;font-size:0.85rem">(thirty 12-foot circular plots required)</span></label>
        <div class="hint" style="margin-left:22px"><strong>Thirty 12-foot circular plots are required.</strong> Randomly place plots across representative habitat types. Record key browse species and percent utilization in each plot. High utilization (&gt;50%) may indicate overpopulation.</div>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.browseInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.endangeredCensus"> <strong>Census of Endangered, Threatened, or Protected Wildlife</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Species</label><input type="text" data-path="${prefix}.census.endangeredSpecies"></div>
            <div class="form-group"><label>Method and dates</label><input type="text" data-path="${prefix}.census.endangeredMethod"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.endangeredInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.nongameCensus"> <strong>Census and Monitoring of Nongame Wildlife Species</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="row">
            <div class="form-group"><label>Species</label><input type="text" data-path="${prefix}.census.nongameSpecies"></div>
            <div class="form-group"><label>Method and dates</label><input type="text" data-path="${prefix}.census.nongameMethod"></div>
          </div>
          <div class="form-group"><label>Additional Information</label><input type="text" data-path="${prefix}.census.nongameInfo"></div>
        </div>
      </div>

      <div class="sub-section">
        <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscCounts"> <strong>Miscellaneous Counts</strong></label>
        <div class="indent" style="margin-top:8px">
          <div class="form-group"><label>Species being counted</label><input type="text" data-path="${prefix}.census.miscSpecies"></div>
          <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscCameras"> Remote detection (cameras)</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscHahn"> Hahn (walking) line</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscRoost"> Roost counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscBooming"> Booming ground counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscTimeArea"> Time/area counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscSongbird"> Songbird transects and counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscQuailCall"> Quail call and covey counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscPointCounts"> Point counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscSmallMammalTraps"> Small mammal traps</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscDriftFences"> Drift fences and pitfall traps</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscBatDepartures"> Bat departures</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscDoveCall"> Dove call counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscChachalaca"> Chachalaca counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscTurkeyHen"> Turkey hen/poultry counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscWaterfowl"> Waterfowl/water bird counts</label>
            <label class="checkbox-item"><input type="checkbox" data-path="${prefix}.census.miscAlligator"> Alligator nest/census counts</label>
          </div>
          <div class="form-group" style="margin-top:8px"><label>Other / Additional Information</label><input type="text" data-path="${prefix}.census.miscInfo"></div>
        </div>
      </div>
    </div>
  `;
}
