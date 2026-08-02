import { Region } from "../types/region";

export const GUJARAT_REGIONS: Region[] = [
  {
    id: "kutch",
    name: "Kutch",
    nameGujarati: "કચ્છ",
    districtCount: 1,
    districts: [
      { id: "kutch", name: "Kutch / Bhuj", nameGujarati: "કચ્છ / ભૂજ", regionId: "kutch" },
    ],
  },
  {
    id: "saurashtra",
    name: "Saurashtra",
    nameGujarati: "સૌરાષ્ટ્ર",
    districtCount: 11,
    districts: [
      { id: "rajkot", name: "Rajkot", nameGujarati: "રાજકોટ", regionId: "saurashtra" },
      { id: "junagadh", name: "Junagadh", nameGujarati: "જૂનાગઢ", regionId: "saurashtra" },
      { id: "jamnagar", name: "Jamnagar", nameGujarati: "જામનગર", regionId: "saurashtra" },
      { id: "bhavnagar", name: "Bhavnagar", nameGujarati: "ભાવનગર", regionId: "saurashtra" },
      { id: "amreli", name: "Amreli", nameGujarati: "અમરેલી", regionId: "saurashtra" },
      { id: "porbandar", name: "Porbandar", nameGujarati: "પોરબંદર", regionId: "saurashtra" },
      { id: "devbhumi-dwarka", name: "Devbhumi Dwarka", nameGujarati: "દેવભૂમિ દ્વારકા", regionId: "saurashtra" },
      { id: "gir-somnath", name: "Gir Somnath", nameGujarati: "ગીર સોમનાથ", regionId: "saurashtra" },
      { id: "botad", name: "Botad", nameGujarati: "બોટાદ", regionId: "saurashtra" },
      { id: "morbi", name: "Morbi", nameGujarati: "મોરબી", regionId: "saurashtra" },
      { id: "surendranagar", name: "Surendranagar", nameGujarati: "સુરેન્દ્રનગર", regionId: "saurashtra" },
    ],
  },
  {
    id: "north-gujarat",
    name: "North Gujarat",
    nameGujarati: "ઉત્તર ગુજરાત",
    districtCount: 6,
    districts: [
      { id: "banaskantha", name: "Banaskantha", nameGujarati: "બનાસકાંઠા", regionId: "north-gujarat" },
      { id: "patan", name: "Patan", nameGujarati: "પાટણ", regionId: "north-gujarat" },
      { id: "mehsana", name: "Mehsana", nameGujarati: "મહેસાણા", regionId: "north-gujarat" },
      { id: "sabarkantha", name: "Sabarkantha", nameGujarati: "સાબરકાંઠા", regionId: "north-gujarat" },
      { id: "aravalli", name: "Aravalli", nameGujarati: "અરવલ્લી", regionId: "north-gujarat" },
      { id: "gandhinagar", name: "Gandhinagar", nameGujarati: "ગાંધીનગર", regionId: "north-gujarat" },
    ],
  },
  {
    id: "central-gujarat",
    name: "Central Gujarat",
    nameGujarati: "મધ્ય ગુજરાત",
    districtCount: 6,
    districts: [
      { id: "anand", name: "Anand", nameGujarati: "આણંદ", regionId: "central-gujarat" },
      { id: "kheda", name: "Kheda", nameGujarati: "ખેડા", regionId: "central-gujarat" },
      { id: "ahmedabad", name: "Ahmedabad", nameGujarati: "અમદાવાદ", regionId: "central-gujarat" },
      { id: "vadodara", name: "Vadodara", nameGujarati: "વડોદરા", regionId: "central-gujarat" },
      { id: "panchmahal", name: "Panchmahal", nameGujarati: "પંચમહાલ", regionId: "central-gujarat" },
      { id: "mahisagar", name: "Mahisagar", nameGujarati: "મહીસાગર", regionId: "central-gujarat" },
    ],
  },
  {
    id: "east-gujarat",
    name: "East Gujarat",
    nameGujarati: "પૂર્વ ગુજરાત",
    districtCount: 2,
    districts: [
      { id: "dahod", name: "Dahod", nameGujarati: "દાહોદ", regionId: "east-gujarat" },
      { id: "chhota-udepur", name: "Chhota Udaipur", nameGujarati: "છોટા ઉદેપુર", regionId: "east-gujarat" },
    ],
  },
  {
    id: "south-gujarat",
    name: "South Gujarat",
    nameGujarati: "દક્ષિણ ગુજરાત",
    districtCount: 7,
    districts: [
      { id: "navsari", name: "Navsari", nameGujarati: "નવસારી", regionId: "south-gujarat" },
      { id: "surat", name: "Surat", nameGujarati: "સુરત", regionId: "south-gujarat" },
      { id: "valsad", name: "Valsad", nameGujarati: "વલસાડ", regionId: "south-gujarat" },
      { id: "bharuch", name: "Bharuch", nameGujarati: "ભરૂચ", regionId: "south-gujarat" },
      { id: "narmada", name: "Narmada", nameGujarati: "નર્મદા", regionId: "south-gujarat" },
      { id: "tapi", name: "Tapi", nameGujarati: "તાપી", regionId: "south-gujarat" },
      { id: "dangs", name: "Dangs", nameGujarati: "ડાંગ", regionId: "south-gujarat" },
    ],
  },
];

export const ALL_GUJARAT_DISTRICTS = GUJARAT_REGIONS.flatMap((region) => region.districts);
