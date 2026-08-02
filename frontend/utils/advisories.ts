// Detailed Precision Crop Advisory Dataset per Crop & Growth Stage Time Intervals

export interface StageAdvisory {
  stageId: string;
  stageName: string;
  daysRange: string;
  summary: string;
  irrigation: {
    frequency: string;
    volumeLiters: string;
    criticalNote: string;
  };
  fertilizer: {
    dose: string;
    timing: string;
    method: string;
  };
  pestDisease: {
    riskLevel: "Low" | "Medium" | "High" | "Critical";
    targetPest: string;
    preventativeAction: string;
    organicRemedy: string;
  };
  checklist: string[];
}

export interface CropLifecycleAdvisory {
  cropName: string;
  gujaratiName: string;
  totalDurationDays: number;
  season: string;
  idealSoil: string;
  stages: StageAdvisory[];
}

export const PRECISION_CROP_ADVISORIES: Record<string, CropLifecycleAdvisory> = {
  Tobacco: {
    cropName: "Tobacco",
    gujaratiName: "તમ્બાકુ",
    totalDurationDays: 120,
    season: "Rabi",
    idealSoil: "Sandy Loam to Medium Black Soil (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Nursery & Land Prep",
        daysRange: "Days -15 to 0",
        summary: "Field sanitation, deep plowing & nursery bed preparation for seedling transplanting.",
        irrigation: {
          frequency: "Light misting 2x daily in nursery",
          volumeLiters: "500 L / bed",
          criticalNote: "Maintain nursery bed moisture without waterlogging to prevent damping-off."
        },
        fertilizer: {
          dose: "FYM (Farmyard Manure) 10 Tonnes/Acre + Single Super Phosphate 50kg",
          timing: "15 days before transplanting",
          method: "Incorporate evenly during final harrowing"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Damping-off fungal rot & Cutworms",
          preventativeAction: "Drench bed with Copper Oxychloride 3g/L or Trichoderma viride",
          organicRemedy: "Apply Neem Cake 100kg/acre during land preparation"
        },
        checklist: [
          "Perform 2 deep plowings + 1 harrowing for fine tilth",
          "Apply 10 tonnes well-decomposed FYM per acre",
          "Treat seeds with Trichoderma harzianum @ 10g/kg seed"
        ]
      },
      {
        stageId: "transplant",
        stageName: "Stage 2: Transplanting & Establishment",
        daysRange: "Days 1 to 15",
        summary: "Transplanting 35-40 day old nursery seedlings into main field with optimal spacing.",
        irrigation: {
          frequency: "Immediate light irrigation post-transplant, then every 4 days",
          volumeLiters: "12,000 L / Acre",
          criticalNote: "Ensure light watering around seedling roots to avoid wilting."
        },
        fertilizer: {
          dose: "Basal Dose: 35kg Urea + 75kg DAP + 40kg MOP per acre",
          timing: "At the time of transplanting",
          method: "Place fertilizer 5cm beside seedling roots in band"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Cutworms & Flea Beetles",
          preventativeAction: "Dust Chlorpyrifos 2% around seedling base",
          organicRemedy: "Spray Neem Oil 3000 PPM @ 5ml/L water"
        },
        checklist: [
          "Transplant seedlings in evening hours (90cm x 60cm spacing)",
          "Perform gap filling within 7 days for missing plants",
          "Apply basal NPK fertilizer mix"
        ]
      },
      {
        stageId: "vegetative",
        stageName: "Stage 3: Rapid Vegetative Growth",
        daysRange: "Days 16 to 50",
        summary: "Active leaf expansion, root deepening, and inter-cultivation weeding.",
        irrigation: {
          frequency: "Every 7 to 10 days",
          volumeLiters: "20,000 L / Acre",
          criticalNote: "Critical vegetative phase: stress reduces leaf length & weight."
        },
        fertilizer: {
          dose: "Top Dressing: 45kg Urea per acre in 2 split doses",
          timing: "Day 25 and Day 40",
          method: "Ring application followed by light earthing up"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Tobacco Caterpillar (Spodoptera) & Aphids",
          preventativeAction: "Spray Emamectin Benzoate 5% SG @ 4g/10L or Acephate 75% SP",
          organicRemedy: "Install 5 Pheromone traps/acre + NSKE 5% spray"
        },
        checklist: [
          "Conduct 1st weeding & hoeing at Day 25",
          "Apply 1st top dressing Urea dose before earthing up",
          "Monitor leaves daily for caterpillar egg masses"
        ]
      },
      {
        stageId: "topping",
        stageName: "Stage 4: Topping & Sucker Management",
        daysRange: "Days 51 to 85",
        summary: "Removal of flower heads (topping) to divert energy into heavy leaf development.",
        irrigation: {
          frequency: "Every 10 days",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Maintain steady moisture; avoid over-flooding to prevent root wilt."
        },
        fertilizer: {
          dose: "Muriate of Potash (MOP) 25kg/acre or Potassium Nitrate (0-0-50) spray 1%",
          timing: "Immediately post-topping",
          method: "Foliar spray or soil application"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Suckers & Tobacco Mosaic Virus (TMV)",
          preventativeAction: "Apply Suckercide / Prime+ oil to top leaf axils to kill suckers",
          organicRemedy: "Spray Milk solution 10% or Neem oil to suppress TMV spread"
        },
        checklist: [
          "Remove flower bud emergence at 18-20 leaf stage (Topping)",
          "Apply sucker control chemical within 24 hours of topping",
          "Disinfect hands with trisodium phosphate when handling TMV plants"
        ]
      },
      {
        stageId: "maturity",
        stageName: "Stage 5: Leaf Maturation & Ripening",
        daysRange: "Days 86 to 110",
        summary: "Gummy resin accumulation, leaf yellowing, and harvest readiness evaluation.",
        irrigation: {
          frequency: "Stop irrigation completely 15 days before harvest",
          volumeLiters: "0 L (Dry Period)",
          criticalNote: "Watering during maturity reduces nicotine content & leaf burning quality."
        },
        fertilizer: {
          dose: "No chemical fertilizers in ripening stage",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Orobanche root parasite & Leaf blight",
          preventativeAction: "Manually pull out Orobanche shoots before seed formation",
          organicRemedy: "Spray Copper Oxychloride if late rains trigger leaf spot"
        },
        checklist: [
          "Check leaf puckering & yellowish-green spottiness (ripening index)",
          "Ensure total dry period for maximum resin & aroma development",
          "Prepare curing barn / sun-drying racks"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 6: Harvesting & Sun Curing",
        daysRange: "Days 111 to 120",
        summary: "Priming mature leaves in 3-4 pickings or stalk-cutting for Gujarat Bidi/Chewing tobacco.",
        irrigation: {
          frequency: "None",
          volumeLiters: "0 L",
          criticalNote: "Store harvested leaves under dry shaded curing conditions."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Storage Mold / Fungus in curing barn",
          preventativeAction: "Maintain adequate barn ventilation & airflow",
          organicRemedy: "Avoid stacking damp leaves"
        },
        checklist: [
          "Harvest leaves in early morning when leaf sap is high",
          "String leaves on bamboo poles for 3-4 weeks sun curing",
          "Check APMC Dahod/Anand tobacco auction rates for best selling window"
        ]
      }
    ]
  },
  Cotton: {
    cropName: "Cotton",
    gujaratiName: "કપાસ",
    totalDurationDays: 160,
    season: "Kharif",
    idealSoil: "Deep Black Cotton Soil (Regur) or Heavy Loam (pH 7.0 - 8.0)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Pre-Sowing & Seed Treatment",
        daysRange: "Days -15 to 0",
        summary: "Soil moisture conservation, sub-soiling, and Bt-cotton seed treatment.",
        irrigation: {
          frequency: "Pre-sowing soaking irrigation (Rauni)",
          volumeLiters: "25,000 L / Acre",
          criticalNote: "Ensure deep root zone moisture before planting seeds."
        },
        fertilizer: {
          dose: "FYM 8 Tonnes/Acre + Single Super Phosphate 100kg",
          timing: "During deep tillage",
          method: "Broadcasting and incorporation"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Soil grubs & Sucking pests",
          preventativeAction: "Treat non-Bt refuga seeds with Imidacloprid 70 WS @ 7g/kg",
          organicRemedy: "Apply Trichoderma viride 2kg + FYM 100kg"
        },
        checklist: [
          "Summer deep plowing to expose soil pests to heat",
          "Maintain row spacing of 120cm x 45cm for hybrid cotton",
          "Sow refuge non-Bt seeds on boundary rows"
        ]
      },
      {
        stageId: "germination",
        stageName: "Stage 2: Germination & Early Canopy",
        daysRange: "Days 1 to 25",
        summary: "Seedling emergence, thinning to single healthy plant per hill.",
        irrigation: {
          frequency: "First irrigation 20-25 days after sowing",
          volumeLiters: "15,000 L / Acre",
          criticalNote: "Delaying 1st irrigation promotes deep taproot development."
        },
        fertilizer: {
          dose: "Basal: 30kg Urea + 50kg DAP + 25kg MOP + 10kg Zinc Sulphate per acre",
          timing: "At sowing time",
          method: "Side placement 5cm deep"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Jassids, Thrips & Whitefly",
          preventativeAction: "Stem application of Monocrotophos / Flonicamid 50 WG @ 4g/10L",
          organicRemedy: "Install 10 Yellow Sticky Traps per acre"
        },
        checklist: [
          "Thin out weak seedlings at 15 days keeping 1 plant per hill",
          "Perform 1st inter-cultivation weeding at Day 20",
          "Monitor sucking pest counts on underside of leaves"
        ]
      },
      {
        stageId: "square",
        stageName: "Stage 3: Squaring & Branching",
        daysRange: "Days 26 to 60",
        summary: "Formation of flower buds (squares) and monopodial/sympodial branching.",
        irrigation: {
          frequency: "Every 12-15 days",
          volumeLiters: "22,000 L / Acre",
          criticalNote: "Moisture deficiency at squaring causes flower bud shedding."
        },
        fertilizer: {
          dose: "1st Top Dressing: 35kg Urea + 15kg MOP per acre",
          timing: "At 40-45 days post sowing",
          method: "Band placement followed by earthing up"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Pink Bollworm (PBW) & Whitefly",
          preventativeAction: "Install PBW Pheromone traps @ 8/acre; spray Profenofos 50 EC @ 2ml/L if ETL crossed",
          organicRemedy: "Release Trichogramma chilonis egg parasitoids @ 60,000/acre"
        },
        checklist: [
          "Perform earthing up to support plant stability against wind",
          "Spray 13:0:45 (KNO3) @ 10g/L for square retention",
          "Check rosette flowers daily for Pink Bollworm larvae"
        ]
      },
      {
        stageId: "boll",
        stageName: "Stage 4: Peak Flowering & Boll Development",
        daysRange: "Days 61 to 110",
        summary: "Maximum boll loading, lint formation, and seed kernel swelling.",
        irrigation: {
          frequency: "Every 10-12 days (Most Critical Stage)",
          volumeLiters: "25,000 L / Acre",
          criticalNote: "Peak water requirement. Drought stress now severely cuts lint yield."
        },
        fertilizer: {
          dose: "2nd Top Dressing: 35kg Urea per acre + Magnesium Sulphate 10kg/acre",
          timing: "At 75 days post sowing",
          method: "Soil application + Boron 0.2% foliar spray"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Pink Bollworm & Mealybug",
          preventativeAction: "Spray Spinetoram 11.7 SC @ 1ml/L or Chlorantraniliprole 18.5 SC @ 0.3ml/L",
          organicRemedy: "Spray Verticillium lecanii biopesticide for mealybug colonies"
        },
        checklist: [
          "Foliar spray of 1% MgSO4 + 1% Urea to prevent reddening of leaves (Lal Rasta)",
          "Inspect green bolls by cutting 20 bolls/acre for internal PBW damage",
          "Avoid excessive Nitrogen which triggers rank vegetative growth"
        ]
      },
      {
        stageId: "opening",
        stageName: "Stage 5: Boll Opening & First Picking",
        daysRange: "Days 111 to 140",
        summary: "Natural boll cracking, lint drying, and 1st harvest picking.",
        irrigation: {
          frequency: "Reduce irrigation interval; stop when 50% bolls open",
          volumeLiters: "12,000 L / Acre",
          criticalNote: "Over-watering causes opened lint staining & trash formation."
        },
        fertilizer: {
          dose: "No chemical fertilizers",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Stainers & Damp rot",
          preventativeAction: "Pick opened bolls promptly to prevent dust & rain discoloration",
          organicRemedy: "Store picked kapash in clean cotton bags, not plastic"
        },
        checklist: [
          "Start 1st picking when 50-60% bolls open fully under sunshine",
          "Keep clean separate picking for high grade fiber pricing",
          "Avoid mixing damaged/diseased bolls with clean lint"
        ]
      },
      {
        stageId: "final",
        stageName: "Stage 6: Final Picking & Stalk Management",
        daysRange: "Days 141 to 160",
        summary: "Completion of 2nd/3rd pickings and destruction of crop stalks to break PBW cycle.",
        irrigation: {
          frequency: "Stop completely",
          volumeLiters: "0 L",
          criticalNote: "Do not extend crop with ratoon growth to prevent pest carryover."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Overwintering Pink Bollworm larvae",
          preventativeAction: "Uproot stalks with cotton shredder immediately after last picking",
          organicRemedy: "Allow cattle grazing in field post-harvest to clean remnants"
        },
        checklist: [
          "Complete final picking by 150-160 days",
          "Shred stalks with rotavator; do not leave stalks standing till monsoon",
          "Check APMC Rajkot/Kadi cotton rates for best sale return"
        ]
      }
    ]
  },
  Maize: {
    cropName: "Maize",
    gujaratiName: "મકાઈ",
    totalDurationDays: 100,
    season: "Kharif",
    idealSoil: "Well-drained Fertile Loam to Silt Loam (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Land Prep & Sowing",
        daysRange: "Days -10 to 0",
        summary: "Fine seedbed preparation, ridge-and-furrow system, and seed treatment.",
        irrigation: {
          frequency: "Sowing in moist soil or light post-sow irrigation",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Maize is highly sensitive to waterlogging; create drainage furrows."
        },
        fertilizer: {
          dose: "Basal: 25kg Urea + 50kg DAP + 20kg MOP + 10kg Zinc Sulphate per acre",
          timing: "At sowing time",
          method: "Band application in furrows 5cm below seed"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Fall Armyworm (FAW) egg masses & Termites",
          preventativeAction: "Seed treatment with Cyantraniliprole 19.8% + Thiamethoxam 19.8% FS @ 6ml/kg",
          organicRemedy: "Apply Neem cake 100kg/acre in soil"
        },
        checklist: [
          "Prepare ridges & furrows at 60cm distance",
          "Maintain seed spacing of 60cm x 20cm (8-10 kg seed/acre)",
          "Ensure Zinc Sulphate is applied if soil test shows Zn deficiency"
        ]
      },
      {
        stageId: "establishment",
        stageName: "Stage 2: Seedling & Knee-High Stage",
        daysRange: "Days 1 to 30",
        summary: "Rapid early leaf emergence up to knee-high (V6 to V8 stage).",
        irrigation: {
          frequency: "Every 8 to 10 days",
          volumeLiters: "16,000 L / Acre",
          criticalNote: "Maintain moist soil; clear clogged drainage furrows after rain."
        },
        fertilizer: {
          dose: "1st Top Dressing: 35kg Urea per acre at knee-high stage (30 DAS)",
          timing: "Day 25 to 30",
          method: "Side dressing followed by earthing up"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Fall Armyworm (FAW) whorl feeder",
          preventativeAction: "Spray Chlorantraniliprole 18.5 SC @ 0.4ml/L or Emamectin Benzoate @ 0.4g/L directly into plant whorls",
          organicRemedy: "Apply sand + neem cake mix (9:1 ratio) directly into central whorls"
        },
        checklist: [
          "Perform 1st hoeing & earthing up at 25-30 days",
          "Scout central whorls for FAW pinholes & saw-dust frass",
          "Apply top dressing Urea before rain or irrigation"
        ]
      },
      {
        stageId: "tasseling",
        stageName: "Stage 3: Tasseling & Silking",
        daysRange: "Days 31 to 65",
        summary: "Male flower (tassel) and female flower (silk) emergence & pollination.",
        irrigation: {
          frequency: "Every 6 to 8 days (Most Critical Stage)",
          volumeLiters: "24,000 L / Acre",
          criticalNote: "Water stress now causes poor pollination & empty cob tips."
        },
        fertilizer: {
          dose: "2nd Top Dressing: 25kg Urea per acre at tasseling initiation",
          timing: "Day 50 to 55",
          method: "Broadcasting between rows"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Stem Borer & Turcicum Leaf Blight",
          preventativeAction: "Spray Mancozeb 75 WP @ 2.5g/L if boat-shaped brown leaf spots appear",
          organicRemedy: "Spray Bacillus thuringiensis (Bt) @ 2g/L water"
        },
        checklist: [
          "Ensure guaranteed irrigation during 100% silk emergence",
          "Avoid chemical sprays during peak morning pollination hours (8am - 11am)",
          "Inspect cob husks for borer entry holes"
        ]
      },
      {
        stageId: "grainfill",
        stageName: "Stage 4: Milk & Dough Stage (Grain Filling)",
        daysRange: "Days 66 to 85",
        summary: "Starch accumulation inside kernels from milky fluid to firm dough.",
        irrigation: {
          frequency: "Every 8 to 10 days",
          volumeLiters: "20,000 L / Acre",
          criticalNote: "Moisture shortage causes shriveled light-weight grains."
        },
        fertilizer: {
          dose: "13:0:45 (Potassium Nitrate) foliar spray @ 10g/L for cob weight boost",
          timing: "Day 70",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Cob worm & Charcoal rot",
          preventativeAction: "Maintain adequate moisture to prevent stalk rot lodging",
          organicRemedy: "Hang bird scarers or reflective ribbons to protect soft grain cobs"
        },
        checklist: [
          "Check grain milk line progression inside cob husk",
          "Protect field boundaries against wild boars & birds",
          "Prepare threshing yard"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 5: Black Layer Maturity & Harvest",
        daysRange: "Days 86 to 100",
        summary: "Black layer formation at kernel base, husk drying & cob harvesting.",
        irrigation: {
          frequency: "Stop completely 10 days before harvest",
          volumeLiters: "0 L",
          criticalNote: "Dry field for machine combine harvester movement."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Grain Weevil in storage",
          preventativeAction: "Sun-dry shelled grains to under 12% moisture before bagging",
          organicRemedy: "Mix dried Neem leaves with stored grain"
        },
        checklist: [
          "Harvest when husk leaves turn pale brown and grain shows black layer",
          "Shell cobs using mechanical maize thresher",
          "Check Dahod/Godhra APMC prices for instant grain sale"
        ]
      }
    ]
  },
  Groundnut: {
    cropName: "Groundnut",
    gujaratiName: "મગફળી",
    totalDurationDays: 115,
    season: "Kharif",
    idealSoil: "Well-drained Sandy Loam or Red Sandy Soil rich in Calcium (pH 6.0 - 7.0)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Land Prep & Sowing",
        daysRange: "Days -10 to 0",
        summary: "Friable seedbed creation for easy peg penetration & Gypsum incorporation.",
        irrigation: {
          frequency: "Pre-sowing soaking irrigation",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Ensure light loose soil so developing pegs penetrate easily."
        },
        fertilizer: {
          dose: "Basal: 15kg Urea + 50kg Single Super Phosphate (SSP) + 15kg MOP + Gypsum 100kg/acre",
          timing: "At sowing time",
          method: "Soil band placement"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "White Grub (Ghorad) & Collar Rot",
          preventativeAction: "Seed treatment with Imidacloprid 600 FS @ 6ml/kg seed + Trichoderma 10g/kg",
          organicRemedy: "Apply Castor cake 200kg/acre to repel white grubs"
        },
        checklist: [
          "Apply Gypsum 100kg at sowing for Calcium & Sulphur pod development",
          "Sow in rows spaced 30cm x 10cm",
          "Ensure pod-rot fungal treatment"
        ]
      },
      {
        stageId: "pegging",
        stageName: "Stage 2: Flowering & Pegging",
        daysRange: "Days 1 to 45",
        summary: "Yellow flower emergence & downwards aerial peg penetration into soil.",
        irrigation: {
          frequency: "Every 8 to 10 days (Critical Pegging Phase)",
          volumeLiters: "20,000 L / Acre",
          criticalNote: "Do NOT perform inter-cultivation weeding during active peg entry into soil."
        },
        fertilizer: {
          dose: "2nd Gypsum application: 100kg/acre earthing up around plant base",
          timing: "At 35-40 days post sowing",
          method: "Soil placement near root zone"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Tikka Leaf Spot (Cercospora) & Aphids",
          preventativeAction: "Spray Mancozeb 75 WP @ 2.5g/L or Tebuconazole @ 1ml/L",
          organicRemedy: "Spray Sour buttermilk 5% + Neem oil"
        },
        checklist: [
          "Apply 2nd Gypsum dose at pegging for pod shell hardening",
          "Stop hoeing once pegs start touching soil surface",
          "Scout leaves for dark circular Tikka spots"
        ]
      },
      {
        stageId: "podfill",
        stageName: "Stage 3: Pod Development & Kernel Filling",
        daysRange: "Days 46 to 90",
        summary: "Subterranean pod enlargement, kernel filling, and oil accumulation.",
        irrigation: {
          frequency: "Every 10 days",
          volumeLiters: "22,000 L / Acre",
          criticalNote: "Moisture deficit now leads to empty pod shells (pops)."
        },
        fertilizer: {
          dose: "0:0:50 (Potassium Sulphate) foliar spray @ 5g/L for oil percentage boost",
          timing: "Day 60 and Day 75",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Stem Rot (Sclerotium) & Spodoptera caterpillar",
          preventativeAction: "Drench plant base with Hexaconazole 5% EC @ 2ml/L",
          organicRemedy: "Spray Beauveria bassiana bio-insecticide"
        },
        checklist: [
          "Pull out sample plants to inspect kernel fullness",
          "Maintain soil moisture for shell expansion",
          "Scout field for wilting yellowing patches"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 4: Maturation & Pod Harvest",
        daysRange: "Days 91 to 115",
        summary: "Leaf yellowing, pod shell interior turning dark brown, and tractor pod digging.",
        irrigation: {
          frequency: "Light irrigation 2 days before digging if soil is hard",
          volumeLiters: "10,000 L / Acre",
          criticalNote: "Softens dry soil so pods do not break off underground during digging."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Aflatoxin mold in damp pods",
          preventativeAction: "Sun-dry harvested pods to under 9% pod moisture before bagging",
          organicRemedy: "Never store damp pods"
        },
        checklist: [
          "Check pod test: inner shell lining should turn dark brown/black",
          "Dig pods using tractor groundnut digger or manual pulling",
          "Sun-dry pods for 5-7 days before mechanical stripping",
          "Check Junagadh/Amreli APMC groundnut rates for premium sale"
        ]
      }
    ]
  },
  Rice: {
    cropName: "Rice (Paddy)",
    gujaratiName: "ડાંગર / ચોખા",
    totalDurationDays: 130,
    season: "Kharif",
    idealSoil: "Heavy Clay to Clay Loam Soil with low permeability (pH 6.0 - 7.0)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Puddling & Nursery Prep",
        daysRange: "Days -25 to 0",
        summary: "Puddling field with standing water and raising 25-day old paddy seedlings.",
        irrigation: {
          frequency: "Continuous 5cm standing water in puddled field",
          volumeLiters: "40,000 L / Acre",
          criticalNote: "Puddling destroys soil macropores to retain standing water."
        },
        fertilizer: {
          dose: "Basal: 35kg Urea + 50kg DAP + 25kg MOP + 15kg Zinc Sulphate per acre",
          timing: "At final puddling before transplanting",
          method: "Broadcasting in standing water"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Root knot nematode & Blast fungus in nursery",
          preventativeAction: "Treat seeds with Carbendazim 2g/kg; spray Tricyclazole in nursery",
          organicRemedy: "Apply Azospirillum & PSB bio-fertilizer 2kg each"
        },
        checklist: [
          "Puddle field twice with tractor cage wheel",
          "Apply Zinc Sulphate 15kg/acre to prevent Khaira disease",
          "Transplant 2-3 seedlings per hill at 20cm x 15cm spacing"
        ]
      },
      {
        stageId: "tillering",
        stageName: "Stage 2: Active Tillering Phase",
        daysRange: "Days 1 to 40",
        summary: "Formation of multiple tillers per hill and rapid root network creation.",
        irrigation: {
          frequency: "Maintain 2-3 cm shallow standing water",
          volumeLiters: "30,000 L / Acre",
          criticalNote: "Drain field for 2 days at maximum tillering to encourage deep rooting."
        },
        fertilizer: {
          dose: "1st Top Dressing: 35kg Urea per acre at 20-25 days post-transplant",
          timing: "Day 25",
          method: "Broadcasting after draining standing water"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Yellow Stem Borer & Gall Midge",
          preventativeAction: "Apply Chlorantraniliprole 0.4% GR granules @ 4kg/acre in standing water",
          organicRemedy: "Release Trichogramma japonicum egg parasitoid cards"
        },
        checklist: [
          "Apply 1st top dressing Urea dose",
          "Check for 'Dead Hearts' caused by stem borer",
          "Perform 1st cono-weeder pass between rice rows"
        ]
      },
      {
        stageId: "panicle",
        stageName: "Stage 3: Panicle Initiation & Booting",
        daysRange: "Days 41 to 75",
        summary: "Panicle development inside leaf sheath & flowering (heading).",
        irrigation: {
          frequency: "Maintain 5cm continuous standing water (Most Critical)",
          volumeLiters: "35,000 L / Acre",
          criticalNote: "Water stress at booting causes sterile empty grains."
        },
        fertilizer: {
          dose: "2nd Top Dressing: 25kg Urea + 15kg MOP per acre at panicle initiation",
          timing: "Day 50-55",
          method: "Broadcasting"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Paddy Blast (Pyricularia) & Brown Plant Hopper (BPH)",
          preventativeAction: "Spray Tricyclazole 75 WP @ 0.6g/L or Pymetrozine 50 WG @ 0.6g/L at base",
          organicRemedy: "Form alternate drying & wetting to disrupt BPH colonies"
        },
        checklist: [
          "Ensure continuous standing water during panicle emergence",
          "Scout plant base near water level for brown planthopper bugs",
          "Spray copper hydroxide for bacterial leaf blight protection"
        ]
      },
      {
        stageId: "milking",
        stageName: "Stage 4: Grain Milking & Dough Stage",
        daysRange: "Days 76 to 105",
        summary: "Starch filling inside rice grains, panicle drooping.",
        irrigation: {
          frequency: "Keep soil saturated to shallow water",
          volumeLiters: "20,000 L / Acre",
          criticalNote: "Drain field completely 12-15 days before harvest."
        },
        fertilizer: {
          dose: "Foliar spray: 0:0:50 (Potassium Sulphate) @ 5g/L for shiny heavy grains",
          timing: "Day 85",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Gundhi Bug & False Smut",
          preventativeAction: "Dust Malathion 5% dust @ 10kg/acre during early morning if bug attack",
          organicRemedy: "Hang rotting crab/fish traps to attract & kill Gundhi bugs"
        },
        checklist: [
          "Scout panicles for Gundhi bug milky sap sucking",
          "Drain field water 12 days before scheduled harvest",
          "Check panicle turning golden yellow"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 5: Golden Ripening & Harvesting",
        daysRange: "Days 106 to 130",
        summary: "Panicles 85% golden yellow, combine harvesting & threshing.",
        irrigation: {
          frequency: "Stop completely",
          volumeLiters: "0 L",
          criticalNote: "Ensure dry firm ground for paddy combine harvester."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Storage grain moth",
          preventativeAction: "Dry paddy grain to 13% moisture before APMC sale or milling",
          organicRemedy: "Store in hermetic grain bags"
        },
        checklist: [
          "Harvest when 85-90% grains turn straw golden color",
          "Thresh using paddy combine harvester or thresher",
          "Check Navsari/Anand/Bavla paddy APMC rates for best returns"
        ]
      }
    ]
  },
  Soybean: {
    cropName: "Soybean",
    gujaratiName: "સોયાબીન",
    totalDurationDays: 95,
    season: "Kharif",
    idealSoil: "Well-drained Medium to Heavy Black Soil (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Land Prep & Rhizobium Inoculation",
        daysRange: "Days -10 to 0",
        summary: "Broadbed-furrow system, Bradyrhizobium bacterial seed culture coating.",
        irrigation: {
          frequency: "Sow after first 50mm monsoon rain",
          volumeLiters: "15,000 L / Acre",
          criticalNote: "Never sow in dry soil; moisture required for Rhizobium nodulation."
        },
        fertilizer: {
          dose: "Basal: 15kg Urea + 60kg Single Super Phosphate + 20kg MOP + 10kg Sulphur",
          timing: "At sowing",
          method: "Band placement below seed"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Yellow Mosaic Virus & Stem Fly",
          preventativeAction: "Treat seeds with Thiamethoxam 30 FS @ 10ml/kg seed + Bradyrhizobium 10g/kg",
          organicRemedy: "Apply Neem cake 100kg/acre"
        },
        checklist: [
          "Coat seed with Rhizobium + PSB culture 30 mins before sowing",
          "Sow at 45cm row spacing (25-30 kg seed/acre)",
          "Apply Sulphur for oil content enhancement"
        ]
      },
      {
        stageId: "flowering",
        stageName: "Stage 2: Vegetative & Flowering",
        daysRange: "Days 1 to 50",
        summary: "Purple/white flower emergence & nitrogen-fixing root nodule formation.",
        irrigation: {
          frequency: "Every 10 days if monsoon breaks",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Moisture stress at flowering causes massive flower drop."
        },
        fertilizer: {
          dose: "19:19:19 foliar spray @ 5g/L at flowering initiation",
          timing: "Day 35",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Girdle Beetle & Tobacco Caterpillar",
          preventativeAction: "Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L or Triazophos 40 EC @ 2ml/L",
          organicRemedy: "Install 10 Yellow Sticky Traps + NSKE 5% spray"
        },
        checklist: [
          "Check root nodules (should turn pink inside when active)",
          "Perform 1st hoeing at Day 20",
          "Scout stems for ring-like Girdle beetle cuts"
        ]
      },
      {
        stageId: "podding",
        stageName: "Stage 3: Pod Development & Seed Filling",
        daysRange: "Days 51 to 80",
        summary: "Pod elongation, seed swelling inside pods.",
        irrigation: {
          frequency: "Every 8 to 10 days (Critical Phase)",
          volumeLiters: "20,000 L / Acre",
          criticalNote: "Water deficit now causes flat empty pods."
        },
        fertilizer: {
          dose: "0:0:50 (Potassium Sulphate) @ 5g/L for seed oil & bold size",
          timing: "Day 60",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Semilooper & Pod Borer",
          preventativeAction: "Spray Spinetoram 11.7 SC @ 0.8ml/L or Indoxacarb 14.5 SC @ 0.5ml/L",
          organicRemedy: "Spray NPV (Nuclear Polyhedrosis Virus) @ 250 LE/acre"
        },
        checklist: [
          "Inspect pods for borer entry holes",
          "Maintain soil moisture for seed filling",
          "Check field for leaf defoliation"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 4: Leaf Dropping & Pod Harvest",
        daysRange: "Days 81 to 95",
        summary: "Leaves turn yellow and drop off; pods turn golden brown & rattle.",
        irrigation: {
          frequency: "Stop completely",
          volumeLiters: "0 L",
          criticalNote: "Harvest when seeds rattle inside pods."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Pod shattering loss",
          preventativeAction: "Harvest promptly when pod moisture reaches 14% to prevent field shattering",
          organicRemedy: "N/A"
        },
        checklist: [
          "Harvest when 90% leaves drop off and pods rattle when shaken",
          "Thresh using soybean thresher at low cylinder speed (400 RPM) to prevent seed cracking",
          "Check Dahod/Indore APMC soybean market rates"
        ]
      }
    ]
  },
  Tur: {
    cropName: "Tur (Arhar)",
    gujaratiName: "તુવેર",
    totalDurationDays: 170,
    season: "Kharif",
    idealSoil: "Deep Well-drained Loam to Medium Black Soil (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Sowing & Deep Rooting",
        daysRange: "Days -10 to 25",
        summary: "Wide row inter-cropping with maize/cotton and Rhizobium seed treatment.",
        irrigation: {
          frequency: "Pre-sowing or light post-monsoon rain",
          volumeLiters: "15,000 L / Acre",
          criticalNote: "Tur has deep taproots; sensitive to standing water logging."
        },
        fertilizer: {
          dose: "Basal: 15kg Urea + 50kg DAP + 15kg MOP + 10kg Sulphur per acre",
          timing: "At sowing",
          method: "Band placement"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Wilt (Fusarium udum) & Sterility Mosaic",
          preventativeAction: "Seed treatment with Trichoderma viride 10g/kg + Rhizobium culture",
          organicRemedy: "Inter-crop with sorghum or maize to reduce wilt spread"
        },
        checklist: [
          "Sow at 90cm x 20cm spacing (or 180cm paired row in inter-cropping)",
          "Apply Trichoderma bio-agent to prevent soil wilt rot",
          "Perform 1st hoeing at Day 25"
        ]
      },
      {
        stageId: "branching",
        stageName: "Stage 2: Vegetative Branching & Nippers",
        daysRange: "Days 26 to 90",
        summary: "Extensive lateral branching and terminal nipping to increase pod clusters.",
        irrigation: {
          frequency: "Every 15-20 days if rain fails",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Nipper stage: trim terminal shoots at Day 50 for double branching."
        },
        fertilizer: {
          dose: "Nipping & foliar spray of 19:19:19 @ 5g/L",
          timing: "Day 50 and Day 75",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Leaf webber & Phytophthora blight",
          preventativeAction: "Spray Quinalphos 25 EC @ 2ml/L if leaf webbing occurs",
          organicRemedy: "Spray Neem oil 5ml/L"
        },
        checklist: [
          "Perform terminal branch nipping at 50 days to boost flower sites",
          "Inter-cultivation weeding between rows",
          "Ensure drainage paths"
        ]
      },
      {
        stageId: "flowering",
        stageName: "Stage 3: Peak Flowering & Pod Borer Defense",
        daysRange: "Days 91 to 135",
        summary: "Yellow flower clusters & peak Pod Borer (Helicoverpa) attack window.",
        irrigation: {
          frequency: "Critical irrigation at flowering initiation",
          volumeLiters: "22,000 L / Acre",
          criticalNote: "Moisture stress causes heavy flower drop."
        },
        fertilizer: {
          dose: "Foliar spray: 13:0:45 @ 10g/L + Planofix 0.25ml/L for flower drop control",
          timing: "At 100% flowering",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Pod Borer (Helicoverpa armigera) & Pod Fly",
          preventativeAction: "Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L or Flubendiamide 39.35 SC @ 0.2ml/L at 50% flowering",
          organicRemedy: "Install 10 Helicoverpa Pheromone traps + HaNPV 250 LE/acre"
        },
        checklist: [
          "Spray pod borer insecticide strictly at flower initiation stage",
          "Check flower clusters for caterpillar webbing",
          "Apply Planofix to prevent premature flower drop"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 4: Pod Maturation & Harvest",
        daysRange: "Days 136 to 170",
        summary: "Pods turn brown, stalks dry up, harvesting & threshing.",
        irrigation: {
          frequency: "Stop completely",
          volumeLiters: "0 L",
          criticalNote: "Dry stalks for easy sickle cutting."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Pulse Beetle in storage",
          preventativeAction: "Sun-dry threshed dal to under 10% moisture; treat with activated clay or neem oil",
          organicRemedy: "Mix inert clay with stored seeds"
        },
        checklist: [
          "Cut plants when 80% pods turn dark brown",
          "Stack cut plants for 3-4 days to dry in sun",
          "Thresh by beating with sticks or using pulse thresher",
          "Check Dahod/Vadodara APMC Tur rates for best returns"
        ]
      }
    ]
  },
  Bajra: {
    cropName: "Bajra (Pearl Millet)",
    gujaratiName: "બાજરી",
    totalDurationDays: 85,
    season: "Kharif",
    idealSoil: "Drought-tolerant Sandy to Light Loam Soil (pH 7.0 - 8.2)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Sowing & Seedling Emergence",
        daysRange: "Days -5 to 15",
        summary: "Drought-hardy shallow sowing in ridges with Azospirillum treatment.",
        irrigation: {
          frequency: "Rainfed or 1 light post-sowing irrigation",
          volumeLiters: "12,000 L / Acre",
          criticalNote: "Bajra thrives in low rainfall; avoid deep seed placement."
        },
        fertilizer: {
          dose: "Basal: 20kg Urea + 40kg DAP + 15kg Zinc Sulphate per acre",
          timing: "At sowing",
          method: "Band placement"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Downy Mildew (Green Ear) & Shoofly",
          preventativeAction: "Seed treatment with Metalaxyl 35 WS @ 6g/kg seed",
          organicRemedy: "Coat seeds with Azospirillum & PSB bio-fertilizer"
        },
        checklist: [
          "Sow seeds shallow (2-3 cm deep) at 45cm x 15cm spacing",
          "Seed rate: 1.5 to 2 kg/acre",
          "Thin out crowded seedlings at Day 12"
        ]
      },
      {
        stageId: "booting",
        stageName: "Stage 2: Tillering & Booting",
        daysRange: "Days 16 to 45",
        summary: "Productive tiller formation & earhead (cob) elongation inside leaf sheath.",
        irrigation: {
          frequency: "Every 12-15 days",
          volumeLiters: "15,000 L / Acre",
          criticalNote: "Provide critical irrigation if dry spell exceeds 15 days."
        },
        fertilizer: {
          dose: "Top Dressing: 25kg Urea per acre at 30 days post sowing",
          timing: "Day 30",
          method: "Broadcasting before rain or irrigation"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Grasshoppers & Stem Borer",
          preventativeAction: "Dust Malathion 5% dust @ 8kg/acre if grasshopper attack occurs",
          organicRemedy: "Spray Neem oil 3000 PPM"
        },
        checklist: [
          "Perform 1st hoeing & earthing up at Day 25",
          "Apply top dressing Urea dose",
          "Check earhead emergence"
        ]
      },
      {
        stageId: "earhead",
        stageName: "Stage 3: Flowering & Grain Fill",
        daysRange: "Days 46 to 70",
        summary: "Protogynous flowering, pollen drop & grain hardening on cylinder earheads.",
        irrigation: {
          frequency: "Critical irrigation at flowering & grain fill",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Moisture stress at flowering causes chaffy empty earhead tips."
        },
        fertilizer: {
          dose: "13:0:45 foliar spray @ 5g/L for bold grain size",
          timing: "Day 55",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Ergot (Gond) & Smut fungus",
          preventativeAction: "Spray Mancozeb 75 WP @ 2g/L or Ziram @ 2ml/L at 50% flowering",
          organicRemedy: "Remove & burn ergot infected sticky honeydew earheads"
        },
        checklist: [
          "Inspect earheads for pink sticky fluid (Ergot warning)",
          "Protect crop against bird damage during grain hardening",
          "Scout field daily"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 4: Earhead Cutting & Threshing",
        daysRange: "Days 71 to 85",
        summary: "Earheads turn greyish-brown, earhead harvesting & thresher processing.",
        irrigation: {
          frequency: "Stop completely",
          volumeLiters: "0 L",
          criticalNote: "Harvest earheads under bright sunshine."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Storage grain beetle",
          preventativeAction: "Sun-dry threshed grains to 12% moisture",
          organicRemedy: "Mix dried neem leaves"
        },
        checklist: [
          "Cut mature earheads with sickle when grains turn hard & dry",
          "Sun-dry earheads on clean threshing floor for 3-4 days",
          "Thresh with power thresher and winnow",
          "Check Kutch/Banaskantha APMC Bajra market rates"
        ]
      }
    ]
  },
  Castor: {
    cropName: "Castor",
    gujaratiName: "એરંડા",
    totalDurationDays: 180,
    season: "Kharif/Rabi",
    idealSoil: "Deep Sandy Loam to Medium Black Soil (pH 6.5 - 8.0)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Sowing & Primary Spike",
        daysRange: "Days -10 to 30",
        summary: "Wide spacing sowing (150cm x 90cm) for branched castor bush creation.",
        irrigation: {
          frequency: "Pre-sowing soaking or light rain",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Ensure deep root zone moisture."
        },
        fertilizer: {
          dose: "Basal: 20kg Urea + 50kg DAP + 20kg MOP per acre",
          timing: "At sowing",
          method: "Band placement"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Semi-looper caterpillar & Whitefly",
          preventativeAction: "Seed treatment with Carbendazim 2g/kg + Thiamethoxam 3g/kg",
          organicRemedy: "Install 5 Pheromone traps/acre"
        },
        checklist: [
          "Maintain wide row spacing (120-150cm between rows)",
          "Thin out weak seedlings at 20 days",
          "Perform 1st hoeing"
        ]
      },
      {
        stageId: "spikes",
        stageName: "Stage 2: Secondary & Tertiary Spikes",
        daysRange: "Days 31 to 100",
        summary: "Formation of main central candle spike followed by secondary branching spikes.",
        irrigation: {
          frequency: "Every 15 days",
          volumeLiters: "22,000 L / Acre",
          criticalNote: "Maintain soil moisture for continuous spike emergence."
        },
        fertilizer: {
          dose: "Top Dressing: 35kg Urea in 2 split doses at 35 and 65 days",
          timing: "Day 35 and Day 65",
          method: "Soil application followed by earthing up"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Castor Semi-looper & Capsule Borer",
          preventativeAction: "Spray Spinetoram 11.7 SC @ 0.8ml/L or Profenofos @ 2ml/L",
          organicRemedy: "Handpick large semi-looper caterpillars in early morning"
        },
        checklist: [
          "Handpick and destroy 1st instar semi-looper egg clusters",
          "Apply top dressing Urea before irrigation",
          "Perform earthing up around wide bushes"
        ]
      },
      {
        stageId: "picking",
        stageName: "Stage 3: Multiple Spike Pickings",
        daysRange: "Days 101 to 180",
        summary: "Harvesting mature capsule spikes in 3-4 sequential pickings.",
        irrigation: {
          frequency: "Every 18-20 days",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Keep watering to sustain 3rd and 4th order spike yields."
        },
        fertilizer: {
          dose: "Foliar spray: 19:19:19 @ 5g/L post 1st picking",
          timing: "Day 115",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Botrytis Gray Mold (Kukda disease)",
          preventativeAction: "Spray Carbendazim + Mancozeb @ 2g/L if humid fog triggers gray mold",
          organicRemedy: "Cut & burn gray mold infected spikes"
        },
        checklist: [
          "Harvest primary spikes when 1-2 capsules turn pale yellow/brown",
          "Sun-dry harvested castor capsules for 4-5 days",
          "Shell capsules using castor dehuller",
          "Check Deesa/Palanpur/Patan APMC castor rates for best price"
        ]
      }
    ]
  },
  Guar: {
    cropName: "Guar (Cluster Bean)",
    gujaratiName: "ગુવાર",
    totalDurationDays: 90,
    season: "Kharif",
    idealSoil: "Light Sandy to Loamy Arid Soil (pH 7.5 - 8.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Arid Sowing & Rhizobium Coating",
        daysRange: "Days -5 to 15",
        summary: "Drought-tolerant leguminous gum crop sowing in arid Kutch/North Gujarat.",
        irrigation: {
          frequency: "Rainfed or 1 pre-sowing irrigation",
          volumeLiters: "12,000 L / Acre",
          criticalNote: "Guar requires minimal water; excessive moisture causes vegetative rot."
        },
        fertilizer: {
          dose: "Basal: 10kg Urea + 40kg Single Super Phosphate per acre",
          timing: "At sowing",
          method: "Soil placement"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Bacterial Leaf Blight & Root rot",
          preventativeAction: "Seed treatment with Streptocycline 0.5g/kg + Carbendazim 2g/kg",
          organicRemedy: "Rhizobium culture seed coating"
        },
        checklist: [
          "Sow at 45cm x 15cm spacing (6-8 kg seed/acre)",
          "Apply SSP for Phosphorus requirement",
          "Perform 1st weeding at Day 20"
        ]
      },
      {
        stageId: "pods",
        stageName: "Stage 2: Cluster Podding & Gum Development",
        daysRange: "Days 16 to 65",
        summary: "Cluster flower formation & high galactomannan gum synthesis inside pods.",
        irrigation: {
          frequency: "1 life-saving irrigation at flowering if rain breaks",
          volumeLiters: "15,000 L / Acre",
          criticalNote: "Critical stage: irrigation at flowering doubles pod clusters."
        },
        fertilizer: {
          dose: "19:19:19 foliar spray @ 4g/L at peak podding",
          timing: "Day 45",
          method: "Foliar spray"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Jassids, Aphids & Powdery Mildew",
          preventativeAction: "Spray Imidacloprid 17.8 SL @ 0.3ml/L or Soluble Sulphur @ 3g/L",
          organicRemedy: "Neem oil 3000 PPM spray"
        },
        checklist: [
          "Monitor cluster pod formation",
          "Scout leaves for bacterial water-soaked lesions",
          "Avoid excess Nitrogen fertilizer"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 3: Pod Maturation & Harvest",
        daysRange: "Days 66 to 90",
        summary: "Pods turn dull light brown, plant uprooting and thresher separation.",
        irrigation: {
          frequency: "Stop completely",
          volumeLiters: "0 L",
          criticalNote: "Dry plants thoroughly."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Storage dampness",
          preventativeAction: "Sun-dry threshed guar gum seeds to 10% moisture",
          organicRemedy: "N/A"
        },
        checklist: [
          "Harvest when pods become light brown and crisp",
          "Thresh using pulse thresher",
          "Check Bhuj/Kutch/Deesa APMC Guar gum rates"
        ]
      }
    ]
  },
  Mustard: {
    cropName: "Mustard",
    gujaratiName: "રાયડો / સરસવ",
    totalDurationDays: 105,
    season: "Rabi",
    idealSoil: "Medium to Light Loam Soil with good drainage (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Sowing & Seedling Emergence",
        daysRange: "Days -10 to 15",
        summary: "Fine seedbed preparation, shallow sowing (2-3 cm deep) and line thinning.",
        irrigation: {
          frequency: "Pre-sowing irrigation (Rauni)",
          volumeLiters: "16,000 L / Acre",
          criticalNote: "Ensure fine tilth so tiny mustard seeds germinate uniformly."
        },
        fertilizer: {
          dose: "Basal: 25kg Urea + 50kg Single Super Phosphate + 15kg MOP + 15kg Elemental Sulphur",
          timing: "At sowing",
          method: "Band placement below seed"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Painted Bug & Sawfly larvae",
          preventativeAction: "Seed treatment with Imidacloprid 70 WS @ 5g/kg seed",
          organicRemedy: "Apply Neem cake 100kg/acre"
        },
        checklist: [
          "Sow in rows 30cm x 10cm apart (1.5-2 kg seed/acre)",
          "Thin out crowded seedlings at 15 days keeping 10cm plant distance",
          "Apply Sulphur for oil content boost"
        ]
      },
      {
        stageId: "flowering",
        stageName: "Stage 2: Bright Yellow Flowering & Pod (Siliqua) Formation",
        daysRange: "Days 16 to 65",
        summary: "Vibrant yellow canopy bloom, branch expansion & pod filling.",
        irrigation: {
          frequency: "1st Irrigation at 30 days (Rosette) + 2nd at 60 days (Podding)",
          volumeLiters: "20,000 L / Acre",
          criticalNote: "2 critical irrigations (Rosette & Podding) boost oil yield by 40%."
        },
        fertilizer: {
          dose: "Top Dressing: 25kg Urea per acre post 1st irrigation",
          timing: "Day 30-35",
          method: "Broadcasting followed by earthing up"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Mustard Aphids (Moli) & White Rust fungus",
          preventativeAction: "Spray Dimethoate 30 EC @ 1.5ml/L or Thiamethoxam @ 0.3g/L if aphid colonies form",
          organicRemedy: "Spray Yellow Sticky Traps + Sour Buttermilk 5% spray"
        },
        checklist: [
          "Apply top dressing Urea after 1st irrigation",
          "Scout yellow flower heads daily for aphid infestation",
          "Spray Mancozeb @ 2.5g/L if white rust spots appear on lower leaves"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 3: Pod Maturation & Harvest",
        daysRange: "Days 66 to 105",
        summary: "Pods turn yellowish-brown, early morning sickle harvesting & threshing.",
        irrigation: {
          frequency: "Stop irrigation completely 15 days before harvest",
          volumeLiters: "0 L",
          criticalNote: "Prevents pod shattering during harvesting."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Pod shatter loss",
          preventativeAction: "Harvest when 75% pods turn yellow in early morning dew",
          organicRemedy: "N/A"
        },
        checklist: [
          "Harvest in early morning when dew prevents pod popping shattering",
          "Bundle & stack harvested plants for 4-5 days sun drying",
          "Thresh using mustard thresher and winnow clean seeds",
          "Check Banaskantha/Palanpur APMC mustard oil seed rates"
        ]
      }
    ]
  },
  Sugarcane: {
    cropName: "Sugarcane",
    gujaratiName: "શેરડી",
    totalDurationDays: 360,
    season: "Annual",
    idealSoil: "Deep Fertile Alluvial or Heavy Clay Loam Soil rich in Organic Matter (pH 6.5 - 8.0)",
    stages: [
      {
        stageId: "planting",
        stageName: "Stage 1: Sett Planting & Germination",
        daysRange: "Days -15 to 45",
        summary: "3-bud cane sett hot water treatment, furrow planting & shoot emergence.",
        irrigation: {
          frequency: "Immediate light irrigation post-planting, then every 7 days",
          volumeLiters: "35,000 L / Acre",
          criticalNote: "Keep furrows moist to ensure 85%+ cane bud germination."
        },
        fertilizer: {
          dose: "Basal: 45kg Urea + 100kg Single Super Phosphate + 30kg MOP per acre",
          timing: "At planting in furrows",
          method: "Furrow band placement"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Early Shoot Borer & Red Rot",
          preventativeAction: "Dip setts in Carbendazim 1g/L for 15 mins; spray Fipronil 0.3% GR @ 10kg/acre",
          organicRemedy: "Apply Trichoderma viride 5kg + FYM 200kg in furrows"
        },
        checklist: [
          "Plant healthy 3-bud setts at 90-120cm furrow distance",
          "Perform gap filling at 30 days for missing cane shoots",
          "Apply basal NPK fertilizer mix"
        ]
      },
      {
        stageId: "tillering",
        stageName: "Stage 2: Formative & Tillering Phase",
        daysRange: "Days 46 to 120",
        summary: "Multiple shoot tiller production and early cane node formation.",
        irrigation: {
          frequency: "Every 8 to 10 days",
          volumeLiters: "40,000 L / Acre",
          criticalNote: "Formative stage determines final millable cane count."
        },
        fertilizer: {
          dose: "1st & 2nd Top Dressing: 65kg Urea per acre split at 45 and 90 days",
          timing: "Day 45 and Day 90",
          method: "Side dressing followed by partial earthing up"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Top Borer & Root Pyrilla",
          preventativeAction: "Apply Carbofuran 3G @ 12kg/acre or Chlorantraniliprole 0.4% GR in soil",
          organicRemedy: "Release Epiricania melanoleuca bio-agent for Pyrilla control"
        },
        checklist: [
          "Perform 1st partial earthing up at 45 days",
          "Conduct full earthing up at 120 days to prevent lodging",
          "Trash mulching between rows to conserve moisture"
        ]
      },
      {
        stageId: "elongation",
        stageName: "Stage 3: Grand Growth & Cane Elongation",
        daysRange: "Days 121 to 270",
        summary: "Rapid internode elongation, cane height expansion & heavy weight gain.",
        irrigation: {
          frequency: "Every 10 to 12 days",
          volumeLiters: "45,000 L / Acre",
          criticalNote: "Peak water requirement. Ensure trash mulching."
        },
        fertilizer: {
          dose: "Final Top Dressing: 50kg Urea + 30kg MOP per acre at 150 days",
          timing: "Day 150",
          method: "Soil placement before heavy earthing up"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Internode Borer & Woolly Aphid",
          preventativeAction: "Tie lower green leaves around cane clumps (Cane Propping) to prevent wind lodging",
          organicRemedy: "Release Trichogramma chilonis cards @ 5 cards/acre"
        },
        checklist: [
          "Perform cane propping / tying at 180 days to prevent storm lodging",
          "Remove lower dry leaves (De-trashing) for ventilation",
          "Monitor Brix sugar sucrose %"
        ]
      },
      {
        stageId: "maturity",
        stageName: "Stage 4: Sucrose Ripening & Factory Harvest",
        daysRange: "Days 271 to 360",
        summary: "Glucose conversion to sucrose, leaf yellowing, hand harvesting for sugar mill.",
        irrigation: {
          frequency: "Stop irrigation completely 20 days before harvest",
          volumeLiters: "0 L",
          criticalNote: "Drying increases sucrose concentration & Brix reading above 18%."
        },
        fertilizer: {
          dose: "No chemical application",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Wild boar & Rodent damage",
          preventativeAction: "Maintain perimeter fencing before mill harvest pass",
          organicRemedy: "N/A"
        },
        checklist: [
          "Test sucrose content with hand refractometer (Target Brix > 18%)",
          "Harvest close to ground level for maximum sugar rich basal internodes",
          "Supply harvested cane to Navsari/Bardoli Sugar Cooperative Factory within 24 hours"
        ]
      }
    ]
  },
  Banana: {
    cropName: "Banana",
    gujaratiName: "કેળા",
    totalDurationDays: 330,
    season: "Perennial",
    idealSoil: "Deep Rich Silt Loam Soil with excellent drainage (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "planting",
        stageName: "Stage 1: Tissue Culture Planting & Rooting",
        daysRange: "Days -10 to 45",
        summary: "Pit digging (60cm x 60cm), FYM enrichment & tissue culture plantlet planting.",
        irrigation: {
          frequency: "Drip irrigation 4 L/plant/day",
          volumeLiters: "8,000 L / Acre / Day",
          criticalNote: "Maintain moist root zone continuously; avoid water standing in pits."
        },
        fertilizer: {
          dose: "FYM 10kg/pit + Single Super Phosphate 250g + Neem cake 500g",
          timing: "At pit preparation",
          method: "Pit soil mixing"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Rhizome Weevil & Nematodes",
          preventativeAction: "Drench pit with Carbendazim 2g/L + Carbosulfan 2ml/L",
          organicRemedy: "Dip tissue culture roots in Pseudomonas fluorescens 10g/L"
        },
        checklist: [
          "Plant at 1.8m x 1.8m high density spacing (1200 plants/acre)",
          "Install drip irrigation line with 2 emitters per plant",
          "Shade young plantlets with sesbania inter-crop"
        ]
      },
      {
        stageId: "shooting",
        stageName: "Stage 2: Vegetative Canopy & Bunch Shooting",
        daysRange: "Days 46 to 210",
        summary: "Rapid broad leaf expansion (30+ leaves) and heart flower (bunch) shooting.",
        irrigation: {
          frequency: "Drip irrigation 12-15 L/plant/day",
          volumeLiters: "18,000 L / Acre / Day",
          criticalNote: "Peak water demand. Drip fertigation schedule active."
        },
        fertilizer: {
          dose: "Drip Fertigation: 200g Urea + 300g MOP per plant split into weekly fertigation doses",
          timing: "Weekly from Month 2 to Month 7",
          method: "Drip fertigation system"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Sigatoka Leaf Spot & Pseudostem Borer",
          preventativeAction: "Spray Propiconazole 1ml/L + Mineral oil 10ml/L for Sigatoka control",
          organicRemedy: "Inject Neem oil formulation into pseudostem borer holes"
        },
        checklist: [
          "Desuckering: remove unwanted side suckers every month keeping only main plant",
          "Apply weekly N-K fertigation dose through drip loader",
          "Spray Micronutrient liquid (Banana Special) @ 5g/L"
        ]
      },
      {
        stageId: "bunch",
        stageName: "Stage 3: Bunch Development & Sleeving",
        daysRange: "Days 211 to 330",
        summary: "Flower heart removal (denavelling), bunch propping & blue polythene sleeving.",
        irrigation: {
          frequency: "Drip irrigation 15-18 L/plant/day",
          volumeLiters: "20,000 L / Acre / Day",
          criticalNote: "Maintain uniform moisture to prevent fruit splitting."
        },
        fertilizer: {
          dose: "Muriate of Potash 100g/plant + Sulphate of Potash foliar spray @ 5g/L on bunch",
          timing: "Month 8 and Month 9",
          method: "Soil application + bunch foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Banana Aphids (BBTV vector) & Fruit Thrips",
          preventativeAction: "Cover developing bunch with perforated Blue Polyethylene sleeve bag",
          organicRemedy: "Spray Beauveria bassiana on bunch hands"
        },
        checklist: [
          "Prop heavy fruit bunches with twin bamboo poles to prevent stem snapping",
          "Remove male flower bud (Denavelling) 10cm below last hand",
          "Cover fruit bunch with Blue Polyethylene sleeve for spotless skin grade",
          "Check Navsari/Anand banana market auction prices"
        ]
      }
    ]
  },
  Mango: {
    cropName: "Mango (Kesar/Alphonso)",
    gujaratiName: "કેરી (કેસર / આલ્ફાન્સો)",
    totalDurationDays: 365,
    season: "Perennial",
    idealSoil: "Deep Well-drained Loamy Soil with good organic layer (pH 6.0 - 7.5)",
    stages: [
      {
        stageId: "flowering",
        stageName: "Stage 1: Winter Flowering & Panicle Emergence",
        daysRange: "Nov to Jan (Stage 1)",
        summary: "Cool weather panicle initiation, blossom protection & Paclobutrazol regulation.",
        irrigation: {
          frequency: "Stop irrigation completely during flower bud initiation (Nov-Dec)",
          volumeLiters: "0 L (Stress Period)",
          criticalNote: "Watering during Nov-Dec converts flower buds into unwanted vegetative leaves."
        },
        fertilizer: {
          dose: "FYM 50kg + Single Super Phosphate 2kg + MOP 1kg per mature tree",
          timing: "Post-monsoon (September)",
          method: "Ring trenching 1.5m away from trunk"
        },
        pestDisease: {
          riskLevel: "Critical",
          targetPest: "Mango Hopper & Powdery Mildew",
          preventativeAction: "1st Spray at panicle emergence: Imidacloprid 17.8 SL @ 0.3ml/L + Hexaconazole 1ml/L",
          organicRemedy: "Spray Neem oil 5ml/L + Verticillium lecanii"
        },
        checklist: [
          "Ensure total water stress in Nov-Dec for 100% flower panicle induction",
          "1st spray at 2-3 inch panicle emergence before flower opening",
          "Never spray chemical insecticides during peak bee pollination"
        ]
      },
      {
        stageId: "fruitset",
        stageName: "Stage 2: Fruit Set & Pea-Size Drop Control",
        daysRange: "Feb to Mar (Stage 2)",
        summary: "Mustard to pea-sized fruit setting, 2nd spray & water resumption.",
        irrigation: {
          frequency: "Resume irrigation post fruit-set at marble size every 10-12 days",
          volumeLiters: "150 L / Tree / Irrigation",
          criticalNote: "Resume watering ONLY after fruits reach pea/marble size to prevent fruit drop."
        },
        fertilizer: {
          dose: "13:0:45 (Potassium Nitrate) foliar spray @ 10g/L + Boron 0.2%",
          timing: "At marble fruit size (March)",
          method: "Canopy foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Thrips, Mealybug & Anthracnose",
          preventativeAction: "2nd Spray at marble size: Thiamethoxam @ 0.3g/L + Carbendazim @ 1g/L",
          organicRemedy: "Fix sticky grease band around tree trunk for Mealybug crawl"
        },
        checklist: [
          "Resume ring irrigation once fruits reach pea/marble size",
          "Apply 13:0:45 + Boron spray to boost fruit retention & size",
          "Scout panicles for thrips scarring"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 3: Fruit Swelling & Kesar Maturity",
        daysRange: "Apr to Jun (Stage 3)",
        summary: "Egg to full size fruit expansion, shoulder development, harvesting with pedicel stem.",
        irrigation: {
          frequency: "Irrigate every 10 days; stop 15 days before harvest picking",
          volumeLiters: "200 L / Tree",
          criticalNote: "Excessive late irrigation causes sap burn & fruit splitting."
        },
        fertilizer: {
          dose: "No chemical fertilizers near harvest",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Fruit Fly (Bactrocera) & Stem borer",
          preventativeAction: "Install Methyl Eugenol Wooden Block Fly Traps @ 6/acre",
          organicRemedy: "Harvest with 1-2 cm stem attached using mango picker net"
        },
        checklist: [
          "Install Fruit Fly pheromone traps in April",
          "Harvest Kesar mangoes when fruit shoulder broadens & sap turns non-sticky",
          "Harvest with 2cm stem attached to prevent latex sap burn on skin",
          "Desap, pack in corrugated boxes & check Talala Gir/Valsad APMC Kesar rates"
        ]
      }
    ]
  }
};

// Dynamic Fallback Advisory Generator for any custom crop name
export function getPrecisionCropAdvisory(cropName: string): CropLifecycleAdvisory {
  // Try exact match first
  if (PRECISION_CROP_ADVISORIES[cropName]) {
    return PRECISION_CROP_ADVISORIES[cropName];
  }

  // Normalize key name (remove brackets, extra tags, etc.)
  const cleanName = cropName.split("(")[0].trim().toLowerCase();
  
  // Try to find a partial match in PRECISION_CROP_ADVISORIES keys
  const keys = Object.keys(PRECISION_CROP_ADVISORIES);
  const foundKey = keys.find(k => {
    const kLower = k.toLowerCase();
    return cleanName.includes(kLower) || kLower.includes(cleanName) ||
           cropName.toLowerCase().includes(kLower) || kLower.includes(cropName.toLowerCase());
  });

  if (foundKey) {
    return {
      ...PRECISION_CROP_ADVISORIES[foundKey],
      cropName: cropName,
    };
  }

  // Fallback template tailored for generic agricultural crops
  return {
    cropName: cropName,
    gujaratiName: cropName,
    totalDurationDays: 110,
    season: "Kharif/Rabi",
    idealSoil: "Well-drained Fertile Loamy Soil (pH 6.5 - 7.5)",
    stages: [
      {
        stageId: "prep",
        stageName: "Stage 1: Pre-Sowing & Land Prep",
        daysRange: "Days -15 to 0",
        summary: `Soil testing, deep plowing, FYM incorporation & seed treatment for ${cropName}.`,
        irrigation: {
          frequency: "Pre-sowing soaking irrigation",
          volumeLiters: "18,000 L / Acre",
          criticalNote: "Ensure uniform soil moisture before sowing."
        },
        fertilizer: {
          dose: "FYM 8 Tonnes/Acre + Single Super Phosphate 50kg + DAP 40kg",
          timing: "At final harrowing",
          method: "Broadcasting and soil incorporation"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Soil grubs & Seedling rot",
          preventativeAction: "Seed treatment with Trichoderma harzianum @ 10g/kg seed",
          organicRemedy: "Apply Neem cake 100kg/acre"
        },
        checklist: [
          "Perform 2 deep plowings + 1 harrowing",
          "Apply well-decomposed FYM manure",
          "Treat seeds before sowing"
        ]
      },
      {
        stageId: "germination",
        stageName: "Stage 2: Germination & Early Growth",
        daysRange: "Days 1 to 30",
        summary: "Seedling emergence, line thinning and 1st inter-cultivation weeding.",
        irrigation: {
          frequency: "Every 8 to 10 days",
          volumeLiters: "15,000 L / Acre",
          criticalNote: "Maintain moist soil; avoid root waterlogging."
        },
        fertilizer: {
          dose: "1st Top Dressing: 30kg Urea per acre at 25 days",
          timing: "Day 25",
          method: "Side dressing followed by weeding"
        },
        pestDisease: {
          riskLevel: "Medium",
          targetPest: "Sucking pests & Flea beetles",
          preventativeAction: "Spray Neem Oil 3000 PPM @ 5ml/L or Imidacloprid @ 0.3ml/L",
          organicRemedy: "Install 10 Yellow Sticky Traps/acre"
        },
        checklist: [
          "Thin out weak seedlings",
          "Perform 1st hand weeding",
          "Apply 1st top dressing Urea"
        ]
      },
      {
        stageId: "flowering",
        stageName: "Stage 3: Flowering & Reproductive Growth",
        daysRange: "Days 31 to 75",
        summary: `Critical flower & pod/grain initiation phase for ${cropName}.`,
        irrigation: {
          frequency: "Every 7 to 9 days (Critical Phase)",
          volumeLiters: "22,000 L / Acre",
          criticalNote: "Do not allow water stress during flowering."
        },
        fertilizer: {
          dose: "2nd Top Dressing: 25kg Urea + 15kg MOP per acre",
          timing: "Day 45",
          method: "Soil application + 19:19:19 foliar spray"
        },
        pestDisease: {
          riskLevel: "High",
          targetPest: "Caterpillars & Leaf blight",
          preventativeAction: "Spray Emamectin Benzoate 5% SG @ 4g/10L or Chlorantraniliprole @ 0.3ml/L",
          organicRemedy: "Install Pheromone traps @ 5/acre"
        },
        checklist: [
          "Scout leaves & flowers daily for pests",
          "Ensure steady irrigation during flowering",
          "Apply foliar NPK micronutrient spray"
        ]
      },
      {
        stageId: "harvest",
        stageName: "Stage 4: Maturation & Harvest",
        daysRange: "Days 76 to 110",
        summary: `Ripening, grain/pod hardening & harvest picking for ${cropName}.`,
        irrigation: {
          frequency: "Stop irrigation 10-14 days before harvest",
          volumeLiters: "0 L",
          criticalNote: "Dry field for machine or manual harvesting."
        },
        fertilizer: {
          dose: "N/A",
          timing: "N/A",
          method: "N/A"
        },
        pestDisease: {
          riskLevel: "Low",
          targetPest: "Storage moisture mold",
          preventativeAction: "Sun-dry harvest to under 12% moisture before storage",
          organicRemedy: "Mix dry neem leaves in stored grain"
        },
        checklist: [
          "Check maturity index (75%+ golden color)",
          "Harvest during dry morning hours",
          "Thresh, clean & check local APMC rates"
        ]
      }
    ]
  };
}
