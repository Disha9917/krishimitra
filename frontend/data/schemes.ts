export interface Scheme {
  id: string;
  name: string;
  govtType: "Central" | "State Subsidy";
  description: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  eligibleCrops: string[];
  officialWebsite: string;
  helplineNumber: string;
  lastUpdated: string;
  subsidyAmount?: string;
  applicationProcess: string;
}

export interface RegionMapping {
  id: string;
  name: string;
  districts: string[];
  crops: {
    traditional: string[];
    exotic: string[];
  };
  recommendedSubsidies: string[];
}

// Region and District Mapping from User Request
export const REGION_DISTRICT_MAPPING: RegionMapping[] = [
  {
    id: "kutch",
    name: "Kutch",
    districts: ["Kachchh"],
    crops: {
      traditional: ["Bajra", "Cotton", "Castor", "Groundnut", "Cumin", "Guar"],
      exotic: ["Dragon Fruit", "Date Palm"],
    },
    recommendedSubsidies: [
      "Farm Mechanization Assistance",
      "Micro Irrigation Subsidy",
      "Seed Distribution Assistance",
      "Fruit Plantation Subsidy",
      "Horticulture Development Scheme",
      "Spice Crop Assistance",
      "Drip Irrigation Subsidy",
    ],
  },
  {
    id: "saurashtra",
    name: "Saurashtra",
    districts: [
      "Amreli",
      "Bhavnagar",
      "Botad",
      "Devbhumi Dwarka",
      "Gir Somnath",
      "Jamnagar",
      "Junagadh",
      "Morbi",
      "Porbandar",
      "Rajkot",
      "Surendranagar",
    ],
    crops: {
      traditional: [
        "Groundnut",
        "Cotton",
        "Castor",
        "Bajra",
        "Sesame",
        "Cumin",
        "Wheat",
        "Mustard",
        "Coriander",
      ],
      exotic: ["Kesar Mango", "Sapota"],
    },
    recommendedSubsidies: [
      "Groundnut Development Scheme",
      "Oilseed Development Scheme",
      "Mango Development Scheme",
      "Farm Mechanization Assistance",
      "Seed Distribution",
      "Horticulture Subsidy",
      "Post Harvest Assistance",
      "Drip Irrigation Subsidy",
    ],
  },
  {
    id: "north-gujarat",
    name: "North Gujarat",
    districts: [
      "Aravalli",
      "Banaskantha",
      "Gandhinagar",
      "Mehsana",
      "Patan",
      "Sabarkantha",
      "Vav-Tharad",
    ],
    crops: {
      traditional: ["Cumin", "Castor", "Mustard", "Bajra", "Wheat", "Potato", "Fennel"],
      exotic: ["Isabgul", "Aloe Vera"],
    },
    recommendedSubsidies: [
      "Spice Crop Assistance",
      "Medicinal Plant Promotion",
      "Farm Mechanization",
      "Seed Distribution",
      "Micro Irrigation",
      "Horticulture Assistance",
    ],
  },
  {
    id: "central-gujarat",
    name: "Central Gujarat",
    districts: [
      "Ahmedabad",
      "Anand",
      "Chhota Udepur",
      "Kheda",
      "Mahisagar",
      "Panchmahal",
      "Vadodara",
    ],
    crops: {
      traditional: ["Paddy", "Cotton", "Tobacco", "Wheat", "Maize", "Groundnut", "Sugarcane"],
      exotic: ["Banana (G9)", "Lemon"],
    },
    recommendedSubsidies: [
      "Sugarcane Development Scheme",
      "Banana Development Scheme",
      "Fruit Plantation Assistance",
      "Farm Mechanization",
      "Seed Distribution",
      "Micro Irrigation Subsidy",
    ],
  },
  {
    id: "east-gujarat",
    name: "East Gujarat",
    districts: ["Dahod", "Narmada"],
    crops: {
      traditional: ["Maize", "Paddy", "Soybean", "Tur", "Castor"],
      exotic: ["Ashwagandha"],
    },
    recommendedSubsidies: [
      "Tribal Farmer Assistance",
      "Medicinal Plant Promotion",
      "Farm Mechanization",
      "Seed Distribution",
      "Micro Irrigation Subsidy",
    ],
  },
  {
    id: "south-gujarat",
    name: "South Gujarat",
    districts: ["Bharuch", "Dang", "Navsari", "Surat", "Tapi", "Valsad"],
    crops: {
      traditional: ["Paddy", "Sugarcane", "Cotton", "Tur", "Vegetables"],
      exotic: [
        "Alphonso Mango",
        "Rajapuri Mango",
        "Dasheri Mango",
        "Banana",
        "Turmeric",
        "Ginger",
        "Papaya",
      ],
    },
    recommendedSubsidies: [
      "Mango Development Scheme",
      "Banana Development Scheme",
      "Vegetable Cultivation Assistance",
      "Turmeric Promotion Scheme",
      "Ginger Promotion Scheme",
      "Farm Mechanization",
      "Drip Irrigation Subsidy",
    ],
  },
];

// Central Government Schemes
export const CENTRAL_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    govtType: "Central",
    description: "Direct income support of ₹6,000 per year to all landholding farmer families across the country to enable them to take care of agricultural inputs and domestic expenses.",
    benefits: "Direct cash transfer of ₹6,000 annually, paid in three equal installments of ₹2,000 every four months straight into the farmer's linked bank account.",
    eligibility: "All small and marginal landholder farmer families in India who own cultivable land in their names.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Ownership Documents (RoR / Jamabandi / 7/12)",
      "Bank Account Details (Passbook copy)",
      "Mobile Number linked with Aadhaar",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://pmkisan.gov.in/",
    helplineNumber: "155261 / 1800-115-526",
    lastUpdated: "June 2026",
    subsidyAmount: "₹6,000 per year",
    applicationProcess: "Register online on the PM-KISAN portal (Self Registration section) or submit documents at your nearest Common Service Centre (CSC).",
  },
  {
    id: "pmksy",
    name: "PMKSY (Per Drop More Crop)",
    govtType: "Central",
    description: "Focuses on enhancing water use efficiency at the farm level through micro-irrigation technologies such as drip and sprinkler systems, helping farmers grow more with less water.",
    benefits: "Subsidy of up to 55% for small and marginal farmers, and 45% for other farmers on the cost of installing drip or sprinkler irrigation systems.",
    eligibility: "Farmers owning agricultural land. Members of cooperative societies and tenant farmers are also eligible.",
    requiredDocuments: [
      "Land Possession Certificate / 7/12 document",
      "Aadhaar Card",
      "Bank Passbook copy",
      "Soil and Water testing report",
      "Electricity Bill (if water pump is powered)",
    ],
    eligibleCrops: [
      "Cotton",
      "Groundnut",
      "Cumin",
      "Sugarcane",
      "Banana (G9)",
      "Banana",
      "Mango",
      "Kesar Mango",
      "Alphonso Mango",
      "Rajapuri Mango",
      "Dasheri Mango",
      "Sapota",
      "Lemon",
      "Dragon Fruit",
      "Date Palm",
      "Vegetables",
      "Turmeric",
      "Ginger",
      "Papaya",
      "Castor",
      "Mustard",
      "Fennel",
      "Wheat",
    ],
    officialWebsite: "https://pmksy.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "45% to 55% of system cost",
    applicationProcess: "Apply online through the GGRC (Gujarat Green Revolution Company) portal or submit physical application forms directly to the district office of the agriculture department.",
  },
  {
    id: "pmfby",
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    govtType: "Central",
    description: "A comprehensive crop insurance scheme that protects farmers from yield losses caused by natural calamities, pest attacks, post-harvest losses, and localized weather risks.",
    benefits: "Comprehensive insurance coverage with low premium rates: 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial and horticultural crops. Remaining premium is paid by the government.",
    eligibility: "All farmers (including sharecroppers and tenant farmers) growing the notified crops in notified areas are eligible.",
    requiredDocuments: [
      "Land Records (7/12 and 8-A documents)",
      "Sowing Certificate issued by Talati/Gram Sevak",
      "Aadhaar Card",
      "Bank Account details",
    ],
    eligibleCrops: [
      "Wheat",
      "Paddy",
      "Bajra",
      "Maize",
      "Cotton",
      "Groundnut",
      "Castor",
      "Sesame",
      "Mustard",
      "Cumin",
      "Coriander",
      "Fennel",
      "Soybean",
      "Tur",
    ],
    officialWebsite: "https://pmfby.gov.in/",
    helplineNumber: "1800-180-1551 / 1800-200-5142",
    lastUpdated: "July 2026",
    subsidyAmount: "Covers sum insured based on localized crop damage",
    applicationProcess: "Apply online via the PMFBY portal or visit your lending bank, authorized insurance agent, or CSC within 10 days of sowing.",
  },
  {
    id: "pm-kisan-mandhan",
    name: "PM-Kisan Maan Dhan Yojana",
    govtType: "Central",
    description: "A voluntary and contributory pension scheme to provide social security and financial protection to small and marginal farmers as they grow old.",
    benefits: "A guaranteed monthly pension of ₹3,000 upon reaching 60 years of age. If the farmer dies, the spouse is eligible for 50% family pension.",
    eligibility: "Small and marginal farmers aged between 18 and 40 years, with cultivable land holdings of up to 2 hectares.",
    requiredDocuments: [
      "Aadhaar Card",
      "Savings Bank Account Passbook",
      "Consent form for auto-debit of premium",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://maandhan.in/",
    helplineNumber: "1800-3000-3434",
    lastUpdated: "April 2026",
    subsidyAmount: "Matches monthly premium (ranges ₹55 to ₹200 based on entry age)",
    applicationProcess: "Enroll online through the PM-KMDY self-portal or visit the nearest Common Service Centre (CSC) with bank details and Aadhaar.",
  },
  {
    id: "nfsm",
    name: "National Food Security Mission (NFSM)",
    govtType: "Central",
    description: "A national initiative to increase the production of rice, wheat, pulses, coarse cereals, and oilseeds through productivity enhancement and soil health improvement.",
    benefits: "Subsidies on quality seeds (HYVs), bio-fertilizers, soil conditioners, farm machinery, water-saving devices, and farmer training demonstrations.",
    eligibility: "Individual and groups of farmers growing grains, pulses, and oilseeds, with priority for small/marginal farmers.",
    requiredDocuments: [
      "Land Ownership Documents (8-A/7/12)",
      "Aadhaar Card",
      "Bank Passbook copy",
      "Seed purchase bills",
    ],
    eligibleCrops: [
      "Paddy",
      "Wheat",
      "Maize",
      "Bajra",
      "Soybean",
      "Tur",
      "Groundnut",
      "Mustard",
      "Sesame",
    ],
    officialWebsite: "https://www.nfsm.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "Up to 50% on seeds, nutrients, and machinery",
    applicationProcess: "Apply online through the i-Khedut portal or submit application forms at the Block Development Officer (BDO) or District Agriculture Officer.",
  },
  {
    id: "midh",
    name: "Mission for Integrated Development of Horticulture (MIDH)",
    govtType: "Central",
    description: "A scheme for the holistic growth of the horticulture sector, covering fruits, vegetables, spices, flowers, coconut, cocoa, and bamboo.",
    benefits: "Financial assistance for establishing new orchards, protected cultivation (greenhouses/net-houses), post-harvest cold storage, packaging infrastructure, and marketing links.",
    eligibility: "Farmers, FPOs, self-help groups, and agricultural entrepreneurs involved in horticultural practices.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Record (7/12 and 8-A)",
      "Detailed Project Report (DPR) for infrastructure",
      "Soil and Water quality analysis report",
    ],
    eligibleCrops: [
      "Dragon Fruit",
      "Date Palm",
      "Kesar Mango",
      "Sapota",
      "Alphonso Mango",
      "Rajapuri Mango",
      "Dasheri Mango",
      "Banana (G9)",
      "Banana",
      "Lemon",
      "Vegetables",
      "Turmeric",
      "Ginger",
      "Papaya",
    ],
    officialWebsite: "https://midh.gov.in/",
    helplineNumber: "011-23382012 / 1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "35% to 50% on setup costs",
    applicationProcess: "Register and apply online on the i-Khedut portal under the Horticulture Department, and upload orchard layout designs.",
  },
  {
    id: "smam",
    name: "Sub Mission on Agricultural Mechanization (SMAM)",
    govtType: "Central",
    description: "Promotes the acquisition of modern farm machinery to increase farm power availability, reduce labor constraints, and complete agricultural operations on time.",
    benefits: "Subsidy of 40% to 50% on purchase of farm machinery (tractors, rotavators, power tillers, reapers, seed drills, and combine harvesters).",
    eligibility: "All farmers, with special preference given to small and marginal farmers, SC/ST, and women farmers.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Ownership Documents (7/12)",
      "Bank Account details",
      "Quotations from approved farm machinery manufacturers",
      "Cast/Category certificate (if claiming special rates)",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://agrimachinery.nic.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "40% to 50% subsidy on agricultural equipment",
    applicationProcess: "Apply online through the i-Khedut portal or the SMAM Agrimachinery portal, choose the manufacturer, and get pre-approval.",
  },
  {
    id: "soil-health",
    name: "Soil Health Card Scheme",
    govtType: "Central",
    description: "Provides crop-specific recommendations of nutrients and organic manure required for individual farms to prevent excessive chemical use and improve soil fertility.",
    benefits: "Free soil testing and distribution of Soil Health Cards showing deficiency status in 12 parameters (N, P, K, secondary nutrients, micronutrients, pH, EC, OC).",
    eligibility: "All landholder farmers in India. Testing is done once every 2 years.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Survey Number / Khata Details",
      "Mobile Number",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://soilhealth.dac.gov.in/",
    helplineNumber: "011-24305545",
    lastUpdated: "April 2026",
    subsidyAmount: "100% Free Service",
    applicationProcess: "Agricultural Extension Officers collect soil samples from your farm. Results are published online, and a printed card is delivered.",
  },
  {
    id: "aif",
    name: "Agriculture Infrastructure Fund (AIF)",
    govtType: "Central",
    description: "A debt financing facility for building cold storage chains, post-harvest warehouses, grading units, primary processing facilities, and smart farming tools.",
    benefits: "3% interest subvention per annum on bank loans of up to ₹2 Crore for a maximum of 7 years, along with credit guarantee coverage.",
    eligibility: "Farmers, FPOs, Agri-entrepreneurs, Startups, and Primary Agricultural Credit Societies (PACS).",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "KYC documents of the applicant/entity",
      "Land title or long-term lease records",
      "Bank Account statement & financial projections",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://agriinfra.dac.gov.in/",
    helplineNumber: "1800-111-555",
    lastUpdated: "June 2026",
    subsidyAmount: "3% interest subvention for 7 years",
    applicationProcess: "Apply online on the AIF portal. Once approved, the application is automatically forwarded to your chosen commercial bank.",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    govtType: "Central",
    description: "Provides credit cards to farmers to meet their short-term cultivation expenses, post-harvest costs, and domestic crop requirements at subsidized interest rates.",
    benefits: "Short-term production credit of up to ₹3 Lakh at an effective interest rate of 4% per annum (after applying 2% interest subvention and 3% prompt payment discount).",
    eligibility: "All farmers, including owner cultivators, tenant farmers, and sharecroppers.",
    requiredDocuments: [
      "Aadhaar Card & KYC details",
      "Land Records (7/12 & 8-A)",
      "Sowing Certificate / Crop report",
      "No-due certificate from surrounding banks",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://www.pmkisan.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "Subsidized loans at 4% interest rate",
    applicationProcess: "Download the KCC application from the PM-KISAN or banking portals, fill in crop and land details, and submit to your local bank.",
  },
  {
    id: "enam",
    name: "e-NAM (National Agriculture Market)",
    govtType: "Central",
    description: "A pan-India electronic trading portal that integrates the existing APMC mandis to create a unified national market for agricultural commodities.",
    benefits: "Assaying services, digital bidding, transparent pricing, direct access to nationwide buyers, and instant online payment transfers to bank accounts.",
    eligibility: "All farmers, traders, FPOs, and commission agents in integrated mandi areas.",
    requiredDocuments: [
      "Aadhaar Card",
      "Bank Account details",
      "Mandi registration code (optional)",
      "Mobile number",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://ennam.gov.in/",
    helplineNumber: "1800-270-0224",
    lastUpdated: "March 2026",
    subsidyAmount: "Removes agent commissions, increases revenues by 15-20%",
    applicationProcess: "Register online on the e-NAM portal or visit the facilitation helpdesk at any e-NAM integrated APMC Mandi yard.",
  },
  {
    id: "fpo-promotion",
    name: "Formation & Promotion of Farmer Producer Organizations (FPO)",
    govtType: "Central",
    description: "Supports the formation of farmer groups (FPOs) to leverage economies of scale in purchasing inputs, sharing machinery, grading crops, and direct bulk marketing.",
    benefits: "Financial grant support of up to ₹18 Lakh per FPO for three years, along with matching equity grants of up to ₹15,000 per member farmer.",
    eligibility: "Groups of at least 300 farmers in plains (or 100 in hilly/tribal zones).",
    requiredDocuments: [
      "List of promoter farmers with Aadhaar & land details",
      "FPO registration certificate (under Companies Act)",
      "Bank account details",
      "Action plan proposal",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://sfacindia.com/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "Up to ₹18 Lakh operational grant",
    applicationProcess: "Apply through designated implementing agencies like NABARD, SFAC, or NCDC with the registration proposal and member list.",
  },
];

// Gujarat Government Subsidies
export const GUJARAT_SUBSIDIES: Scheme[] = [
  {
    id: "farm-mechanization-subsidy",
    name: "Farm Mechanization Assistance",
    govtType: "State Subsidy",
    description: "Financial assistance for Gujarat farmers to purchase modern agricultural machinery (tractors, power tillers, rotavators, multi-crop seed drills) to increase efficiency and reduce manual labor.",
    benefits: "Subsidy of 40% to 50% on the cost of farm equipment (up to a maximum ceiling limit, e.g., ₹45,000 for rotavator, depending on the tool).",
    eligibility: "All farmers in Gujarat holding cultivable agricultural land registered on the i-Khedut portal.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Records (7/12 & 8-A documents)",
      "Caste/Category certificate (if applicable)",
      "Bank Account details",
      "Dealer quotation",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "40% to 50% subsidy",
    applicationProcess: "Register online on the i-Khedut portal under Agriculture Department Schemes during the open window, get approval, buy from an authorized dealer, and submit bills.",
  },
  {
    id: "micro-irrigation-subsidy",
    name: "Micro Irrigation Subsidy",
    govtType: "State Subsidy",
    description: "Financial assistance to install modern micro-irrigation systems (drip/sprinkler) under the Gujarat Green Revolution Company (GGRC) to optimize water usage.",
    benefits: "70% subsidy for small and marginal farmers, 50% subsidy for other farmers, and up to 85% for tribal farmers on total equipment cost.",
    eligibility: "All landholders in Gujarat with a running source of water for irrigation.",
    requiredDocuments: [
      "7/12 and 8-A land records",
      "Aadhaar Card",
      "Water source test report or connection certificate",
      "GGRC registered vendor layout plan",
      "Bank Account passbook copy",
    ],
    eligibleCrops: ["All Crops"],
    officialWebsite: "https://ggrc.co.in/",
    helplineNumber: "1800-233-2652",
    lastUpdated: "July 2026",
    subsidyAmount: "50% to 85% subsidy",
    applicationProcess: "Apply online on the GGRC or i-Khedut portal, select a registered drip irrigation dealer to design the layout, get verification, and receive direct benefit transfer.",
  },
  {
    id: "seed-distribution-subsidy",
    name: "Seed Distribution Assistance",
    govtType: "State Subsidy",
    description: "Subsidized distribution of certified seeds of major agricultural crops to farmers to ensure high germination rates and disease-resistant crop cultivation.",
    benefits: "50% subsidy on the purchase price of certified high-yielding variety (HYV) seeds, up to a limit of ₹1,000 per hectare (max 2 hectares per farmer).",
    eligibility: "Gujarat farmers, with priority given to small, marginal, and socio-economically weaker categories.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Seed purchase bills from authorized state cooperative societies",
    ],
    eligibleCrops: [
      "Bajra",
      "Cotton",
      "Castor",
      "Groundnut",
      "Guar",
      "Wheat",
      "Sesame",
      "Mustard",
      "Paddy",
      "Maize",
      "Soybean",
      "Tur",
    ],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "50% of seed purchase price",
    applicationProcess: "Apply online on the i-Khedut portal, print the pre-approval letter, and purchase seeds from Gujarat State Seed Corporation (GURBIN) or cooperative distributors.",
  },
  {
    id: "fruit-plantation-subsidy",
    name: "Fruit Plantation Subsidy",
    govtType: "State Subsidy",
    description: "Financial assistance for the establishment of new fruit orchards, helping farmers diversify from traditional crops to high-income horticultural crops.",
    benefits: "Subsidizes up to ₹50,000 to ₹1,00,000 per hectare depending on the fruit crop, paid in installments over 3 years, subject to plant survival rate.",
    eligibility: "Gujarat farmers owning land suitable for horticultural plantations.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A records",
      "Seedling/Graft purchase invoice from state nurseries",
      "Water availability certificate",
    ],
    eligibleCrops: ["Dragon Fruit", "Date Palm", "Lemon", "Papaya", "Kesar Mango", "Sapota", "Alphonso Mango", "Rajapuri Mango", "Dasheri Mango", "Banana (G9)", "Banana"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "Up to ₹1,00,000 per hectare",
    applicationProcess: "Apply under Horticulture Schemes on the i-Khedut portal. Nursery purchase verification is performed by block horticulture officers.",
  },
  {
    id: "horticulture-development-subsidy",
    name: "Horticulture Development Scheme",
    govtType: "State Subsidy",
    description: "A state initiative promoting modern horticulture, protected farming, and greenhouse construction to increase yields of exotic and offseason crops.",
    benefits: "Up to 50% subsidy on building polyhouses, shade nets, and planting high-yield crops like dragon fruit and date palms.",
    eligibility: "Horticultural landholders in Gujarat.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Detailed project estimate from polyhouse/nursery builders",
    ],
    eligibleCrops: ["Dragon Fruit", "Date Palm", "Kesar Mango", "Sapota", "Lemon", "Alphonso Mango", "Rajapuri Mango", "Dasheri Mango", "Banana", "Vegetables", "Turmeric", "Ginger", "Papaya"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "50% subsidy on setup cost",
    applicationProcess: "Submit application under Horticulture Department on i-Khedut portal, submit drawings/estimates, and undergo physical site verification.",
  },
  {
    id: "spice-crop-assistance",
    name: "Spice Crop Assistance",
    govtType: "State Subsidy",
    description: "Special subsidy package to encourage the cultivation of high-value seed spices in arid regions, helping farmers with high-quality seeds and inputs.",
    benefits: "Direct financial assistance of ₹15,000 per hectare for spices like Cumin, Coriander, and Fennel.",
    eligibility: "Farmers in Kutch, Saurashtra, and North Gujarat growing spice crops.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land records (7/12) showing crop sowing area",
      "Bank Details",
      "Input purchase invoices",
    ],
    eligibleCrops: ["Cumin", "Coriander", "Fennel"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "₹15,000 per hectare",
    applicationProcess: "Apply online on i-Khedut, verify sowing with local village revenue officer (Talati), and receive subsidy in bank account.",
  },
  {
    id: "drip-irrigation-subsidy-state",
    name: "Drip Irrigation Subsidy",
    govtType: "State Subsidy",
    description: "Exclusive state subsidy topping up the central PMKSY scheme to provide maximum relief for farmers shifting from flood irrigation to drip irrigation.",
    benefits: "Direct financial reimbursement covering up to 70% of the total installation costs of drip line systems.",
    eligibility: "Farmers in Gujarat shifting to water-conserving irrigation methods.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 & 8-A records",
      "Purchase bill of certified drip pipes & filters",
      "Bank Account details",
    ],
    eligibleCrops: ["Bajra", "Cotton", "Castor", "Groundnut", "Cumin", "Guar", "Wheat", "Sesame", "Mustard", "Coriander", "Sugarcane", "Banana", "Vegetables", "Mango", "Kesar Mango", "Alphonso Mango", "Rajapuri Mango", "Dasheri Mango", "Dragon Fruit", "Date Palm"],
    officialWebsite: "https://ggrc.co.in/",
    helplineNumber: "1800-233-2652",
    lastUpdated: "July 2026",
    subsidyAmount: "Up to 70% of cost",
    applicationProcess: "Apply via i-Khedut/GGRC portals. Sowing and drip installation are physically inspected by GGRC technicians prior to release of funds.",
  },
  {
    id: "groundnut-development-subsidy",
    name: "Groundnut Development Scheme",
    govtType: "State Subsidy",
    description: "Specialized agricultural enhancement package for Groundnut farmers in Saurashtra to help combat crop disease and improve oil yield content.",
    benefits: "50% subsidy on premium groundnut seeds, soil conditioners, gypsum, and bio-control inputs.",
    eligibility: "Farmers growing groundnut in the Saurashtra region districts.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 Land Record",
      "Groundnut sowing certificate from Gram Sevak",
      "Receipt of inputs purchased from certified cooperatives",
    ],
    eligibleCrops: ["Groundnut"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "50% input cost subsidy",
    applicationProcess: "Apply under Agriculture Department on i-Khedut portal, and purchase inputs from authorized cooperative societies.",
  },
  {
    id: "oilseed-development-subsidy",
    name: "Oilseed Development Scheme",
    govtType: "State Subsidy",
    description: "Promotes cultivation of oilseed crops (Sesame, Castor, Mustard, Soybean) in Saurashtra and neighboring districts to increase state edible oil production.",
    benefits: "Financial aid of ₹5,000/hectare for buying certified oilseeds, micro-nutrients, and organic fertilizers.",
    eligibility: "Farmers growing oilseed crops in Saurashtra region.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Bank Passbook details",
    ],
    eligibleCrops: ["Groundnut", "Sesame", "Castor", "Mustard", "Soybean"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "₹5,000 per hectare",
    applicationProcess: "Register on i-Khedut, select the Oilseed scheme, and submit land records with sowing declaration.",
  },
  {
    id: "mango-development-subsidy",
    name: "Mango Development Scheme",
    govtType: "State Subsidy",
    description: "Promotes high-density mango plantations for Kesar Mango in Saurashtra and Alphonso/Rajapuri/Dasheri Mangoes in South Gujarat to boost export quality.",
    benefits: "Up to ₹60,000/ha subsidy spread over 3 years for setting up high-density mango orchards, purchasing premium grafts, and installing micro-sprinklers.",
    eligibility: "Orchard landholders in Saurashtra and South Gujarat districts.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Certified nursery graft purchase bill",
      "Water source availability proof",
    ],
    eligibleCrops: ["Kesar Mango", "Alphonso Mango", "Rajapuri Mango", "Dasheri Mango"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "Up to ₹60,000 per hectare",
    applicationProcess: "Submit application under Horticulture Department on i-Khedut, and undergo nursery graft purchase inspection by state officers.",
  },
  {
    id: "post-harvest-assistance-subsidy",
    name: "Post Harvest Assistance",
    govtType: "State Subsidy",
    description: "Provides financial aid to establish small farm-gate packaging, storage, and drying units to prevent decay and improve market value.",
    benefits: "50% financial subsidy up to a maximum of ₹2 Lakh for construction of grading/packing houses (minimum size 9m x 6m).",
    eligibility: "Farmers, FPOs, and farmer clusters in Saurashtra and other crop-intensive regions.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Registry (7/12)",
      "Architect layout design and cost estimate",
      "Completion certificate post construction",
    ],
    eligibleCrops: [
      "Groundnut",
      "Cotton",
      "Castor",
      "Bajra",
      "Sesame",
      "Cumin",
      "Wheat",
      "Mustard",
      "Coriander",
      "Kesar Mango",
      "Sapota",
    ],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "50% subsidy up to ₹2 Lakh",
    applicationProcess: "Register on i-Khedut, get pre-sanction, build post-harvest packhouse, upload bills, and receive subsidy after inspection.",
  },
  {
    id: "medicinal-plant-subsidy",
    name: "Medicinal Plant Promotion",
    govtType: "State Subsidy",
    description: "Promotes cultivation of herbal and medicinal crops (Aloe Vera, Ashwagandha, Isabgul) in North and East Gujarat to supply pharmaceutical clusters.",
    benefits: "Direct subsidy covering up to 40% of the cost of cultivation expenses (up to a limit of ₹20,000 per hectare).",
    eligibility: "Farmers cultivating medicinal crops in North Gujarat and East Gujarat regions.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 Land Record",
      "Medicinal plant nursery receipt",
      "Bank Account details",
    ],
    eligibleCrops: ["Aloe Vera", "Isabgul", "Ashwagandha"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "079-23253448",
    lastUpdated: "April 2026",
    subsidyAmount: "Up to ₹20,000 per hectare",
    applicationProcess: "Apply online through the i-Khedut portal under the State Agricultural Board/Horticulture department.",
  },
  {
    id: "sugarcane-development-subsidy",
    name: "Sugarcane Development Scheme",
    govtType: "State Subsidy",
    description: "A targeted scheme for sugarcane farmers in Central and South Gujarat promoting tissue culture sets and organic leaf cutters/mulchers.",
    benefits: "₹10,000 per hectare subsidy for tissue culture sets, and 50% subsidy for sugarcane leaf cutter machines.",
    eligibility: "Sugarcane farmers associated with registered sugar cooperatives in Central & South Gujarat.",
    requiredDocuments: [
      "Cooperative factory registration certificate",
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Purchase bill of tissue culture sets",
    ],
    eligibleCrops: ["Sugarcane"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "₹10,000 per hectare",
    applicationProcess: "Apply through i-Khedut or submit application details through the sugarcane cooperative society office.",
  },
  {
    id: "banana-development-subsidy",
    name: "Banana Development Scheme",
    govtType: "State Subsidy",
    description: "Promotes G9 Banana tissue culture crop farming in Central and South Gujarat to increase quality and yields for export markets.",
    benefits: "50% subsidy on purchasing premium G9 tissue culture banana plantlets, up to ₹30,000 per hectare.",
    eligibility: "Farmers in Central and South Gujarat growing Banana crops.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 & 8-A documents",
      "Laboratory plantlet invoice",
      "Bank details",
    ],
    eligibleCrops: ["Banana (G9)", "Banana"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "Up to ₹30,000 per hectare",
    applicationProcess: "Apply on i-Khedut under Horticulture Department, purchase GGRC-authorized banana plantlets, and upload invoices.",
  },
  {
    id: "tribal-farmer-assistance",
    name: "Tribal Farmer Assistance",
    govtType: "State Subsidy",
    description: "Special integrated farming assistance package for tribal farmers in East Gujarat, covering high-quality hybrid seeds, fertilizers, and minor farm implements.",
    benefits: "Up to 90% financial subsidy on the purchase of seeds, inputs, and small agricultural equipment (maximum ₹25,000 per family).",
    eligibility: "Scheduled Tribe (ST) farmers residing in East Gujarat districts (Dahod, Narmada).",
    requiredDocuments: [
      "Caste Certificate (ST)",
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Bank Details",
    ],
    eligibleCrops: ["Maize", "Paddy", "Soybean", "Tur", "Castor", "Ashwagandha"],
    officialWebsite: "https://tribal.gujarat.gov.in/",
    helplineNumber: "1800-233-3555",
    lastUpdated: "July 2026",
    subsidyAmount: "75% to 90% subsidy on inputs",
    applicationProcess: "Apply on i-Khedut under the Tribal Development schemes tab or submit physical files to the local Integrated Tribal Development Project (ITDP) office.",
  },
  {
    id: "vegetable-cultivation-subsidy",
    name: "Vegetable Cultivation Assistance",
    govtType: "State Subsidy",
    description: "Encourages intensive cultivation of vegetables, promoting hybrid seeds, biological pest control, and trellising infrastructure in South Gujarat.",
    benefits: "Subsidy of ₹20,000 per hectare for hybrid seeds, organic input kits, and bamboo/wire trellises.",
    eligibility: "Vegetable farmers in South Gujarat.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A records",
      "Sowing report from Gram Sevak",
      "Input purchase invoices",
    ],
    eligibleCrops: ["Vegetables"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "₹20,000 per hectare",
    applicationProcess: "Apply online on the i-Khedut portal under the Horticulture Department, and verify sowing area with block horticultural inspector.",
  },
  {
    id: "turmeric-promotion-subsidy",
    name: "Turmeric Promotion Scheme",
    govtType: "State Subsidy",
    description: "Promotes turmeric root plantation in South Gujarat, helping farmers with organic nutrients, curing machines, and quality seed rhizomes.",
    benefits: "Direct financial subsidy of ₹20,000 per hectare for turmeric crop cultivation, rhizome cost, and organic input kit.",
    eligibility: "Farmers growing turmeric in South Gujarat.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A records",
      "Ginger/Turmeric rhizome purchase bills",
    ],
    eligibleCrops: ["Turmeric"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "₹20,000 per hectare",
    applicationProcess: "Register and apply on i-Khedut under Horticulture Department, and verify rhizome sowing area.",
  },
  {
    id: "ginger-promotion-subsidy",
    name: "Ginger Promotion Scheme",
    govtType: "State Subsidy",
    description: "Encourages ginger cultivation in high-rainfall zones of South Gujarat, offering crop subsidies and processing machine assistance.",
    benefits: "Direct financial subsidy of ₹20,000 per hectare for ginger seed rhizomes and input kit.",
    eligibility: "Farmers cultivating ginger in South Gujarat.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A records",
      "Purchase bill of ginger seed rhizomes",
    ],
    eligibleCrops: ["Ginger"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "₹20,000 per hectare",
    applicationProcess: "Submit application on the i-Khedut portal, upload crop records, and obtain Gram Sevak's verification.",
  },
  {
    id: "fruit-plantation-assistance",
    name: "Fruit Plantation Assistance",
    govtType: "State Subsidy",
    description: "Encourages establishment of orchards for fruits in Central Gujarat.",
    benefits: "Direct financial assistance for planting lemons, bananas, and other fruit crops.",
    eligibility: "Fruit farmers in Central Gujarat.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A land records",
      "Nursery graft receipts",
    ],
    eligibleCrops: ["Lemon", "Banana (G9)"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "May 2026",
    subsidyAmount: "Up to ₹40,000 per hectare",
    applicationProcess: "Submit application on i-Khedut, submit receipts from state-certified nurseries, and verify transplanting.",
  },
  {
    id: "horticulture-subsidy",
    name: "Horticulture Subsidy",
    govtType: "State Subsidy",
    description: "Promotes development of horticulture crops and infrastructure in Saurashtra.",
    benefits: "Financial aid for building crop structures and planting trees.",
    eligibility: "Horticulture farmers in Saurashtra.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 and 8-A records",
      "Project estimate",
    ],
    eligibleCrops: ["Kesar Mango", "Sapota"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "Up to 50% subsidy",
    applicationProcess: "Register on i-Khedut, complete pre-sanction details, and submit bills for grading structures.",
  },
  {
    id: "horticulture-assistance",
    name: "Horticulture Assistance",
    govtType: "State Subsidy",
    description: "Supports horticulture cultivation in North Gujarat.",
    benefits: "Reimbursement on seed and equipment cost.",
    eligibility: "Farmers growing fruits/vegetables in North Gujarat.",
    requiredDocuments: [
      "Aadhaar Card",
      "7/12 records",
      "Purchase receipts",
    ],
    eligibleCrops: ["Aloe Vera", "Isabgul"],
    officialWebsite: "https://ikhedut.gujarat.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "June 2026",
    subsidyAmount: "Up to ₹25,000 per hectare",
    applicationProcess: "Apply online via i-Khedut, submit purchase vouchers, and receive direct bank transfer.",
  },
];

// Helper to filter schemes and subsidies dynamically
export function getRecommendedSchemes(
  regionId: string,
  districtName: string,
  cropName: string,
  searchQuery: string = "",
  filterType: "all" | "central" | "state" = "all"
): Scheme[] {
  const query = searchQuery.toLowerCase().trim();

  // Find the selected region specs
  const regionSpec = REGION_DISTRICT_MAPPING.find((r) => r.id === regionId);
  if (!regionSpec) return [];

  // 1. Filter Central Schemes
  const matchedCentral = CENTRAL_SCHEMES.filter((scheme) => {
    // Matches crop (All Crops or specific crop match)
    const matchesCrop =
      scheme.eligibleCrops.includes("All Crops") ||
      scheme.eligibleCrops.some((c) => c.toLowerCase().trim() === cropName.toLowerCase().trim()) ||
      // Handle crop classifications (e.g. Cumin matches Spice Crop, Alphonso Mango matches Mango, etc.)
      (cropName.toLowerCase().includes("mango") && scheme.eligibleCrops.some((c) => c.toLowerCase().includes("mango"))) ||
      (cropName.toLowerCase().includes("banana") && scheme.eligibleCrops.some((c) => c.toLowerCase().includes("banana")));

    // Matches search query
    const matchesSearch =
      query === "" ||
      scheme.name.toLowerCase().includes(query) ||
      scheme.description.toLowerCase().includes(query) ||
      scheme.benefits.toLowerCase().includes(query);

    return matchesCrop && matchesSearch;
  });

  // 2. Filter State Subsidies based on Region's recommendedSubsidies list and Crop
  const matchedState = GUJARAT_SUBSIDIES.filter((subsidy) => {
    // Must be in the region's allowed list
    const isRecommendedForRegion = regionSpec.recommendedSubsidies.some(
      (recName) => recName.toLowerCase().replace(/\s/g, "") === subsidy.name.toLowerCase().replace(/\s/g, "")
    );

    // Matches crop (All Crops or specific crop match)
    const matchesCrop =
      subsidy.eligibleCrops.includes("All Crops") ||
      subsidy.eligibleCrops.some((c) => c.toLowerCase().trim() === cropName.toLowerCase().trim()) ||
      // Special mappings for general categories like vegetables or fruits
      (cropName.toLowerCase().includes("mango") && subsidy.eligibleCrops.some((c) => c.toLowerCase().includes("mango"))) ||
      (cropName.toLowerCase().includes("banana") && subsidy.eligibleCrops.some((c) => c.toLowerCase().includes("banana"))) ||
      (cropName.toLowerCase().includes("fruit") && subsidy.eligibleCrops.some((c) => c.toLowerCase().includes("fruit") || c.toLowerCase().includes("mango") || c.toLowerCase().includes("sapota") || c.toLowerCase().includes("banana") || c.toLowerCase().includes("lemon") || c.toLowerCase().includes("papaya"))) ||
      (cropName.toLowerCase() === "vegetables" && subsidy.eligibleCrops.some((c) => c.toLowerCase() === "vegetables"));

    // Matches search query
    const matchesSearch =
      query === "" ||
      subsidy.name.toLowerCase().includes(query) ||
      subsidy.description.toLowerCase().includes(query) ||
      subsidy.benefits.toLowerCase().includes(query);

    return isRecommendedForRegion && matchesCrop && matchesSearch;
  });

  // Combine and respect the filterType
  if (filterType === "central") {
    return matchedCentral;
  } else if (filterType === "state") {
    return matchedState;
  } else {
    return [...matchedCentral, ...matchedState];
  }
}
