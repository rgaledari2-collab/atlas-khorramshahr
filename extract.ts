import { VILLAGES_DATA, REGIONAL_HEALTH_INFO } from './src/data/villages.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDataPath = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(publicDataPath)) {
    fs.mkdirSync(publicDataPath, { recursive: true });
}

const liteVillages = VILLAGES_DATA.map(village => {
    const { 
        id, name, x, y, tagline, province, county, district, coordinates, population, households,
        infrastructure, schools, orphans, underprivileged, disabilityStats, notes
    } = village;

    const details = {
        infrastructure, schools, orphans, underprivileged, disabilityStats, notes
    };

    fs.writeFileSync(
        path.join(publicDataPath, `${id}.json`), 
        JSON.stringify(details, null, 2)
    );

    return {
        id, name, x, y, tagline, province, county, district, coordinates, population, households,
        hasDetails: !!(infrastructure || schools || orphans || underprivileged || disabilityStats || notes),
        orphansCount: orphans ? orphans.length : 0,
        underprivilegedCount: underprivileged ? underprivileged.length : 0,
        studentsCount: schools ? schools.reduce((acc, s) => acc + s.total, 0) : 0,
    };
});

const newTsContent = `
export interface OrphanRecord {
  id: number;
  guardianName: string;
  guardianAge: string | number;
  guardianNationalId: string;
  childName: string;
  childLastName: string;
  fatherName: string;
  childNationalId: string;
  childAge: string | number;
  educationLevel: string;
  schoolName: string;
  healthStatus: string;
  address: string;
  phone: string;
}

export interface UnderprivilegedRecord {
  id: number;
  fullName: string;
  nationalId: string;
  phone: string;
  address: string;
}

export interface SchoolGradeStats {
  schoolName: string;
  preSchool: string | number;
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
  grade5: number;
  grade6: number;
  total: number;
}

export interface InfrastructureItem {
  name: string;
  area: string;
  stat: string;
  unit: string;
  type: 'health' | 'education' | 'culture' | 'gov' | 'religion';
}

export interface VillageDetails {
  infrastructure?: InfrastructureItem[];
  schools?: SchoolGradeStats[];
  orphans?: OrphanRecord[];
  underprivileged?: UnderprivilegedRecord[];
  disabilityStats?: { label: string; count: number }[];
  notes?: string;
}

export interface VillageData {
  id: string;
  name: string;
  x: number; // percentage on map (0 to 1)
  y: number; // percentage on map (0 to 1)
  tagline?: string;
  province: string;
  county: string;
  district: string;
  coordinates: string;
  population?: number;
  households?: number;
  hasDetails?: boolean;
  orphansCount?: number;
  underprivilegedCount?: number;
  studentsCount?: number;
}

export const VILLAGES_DATA: VillageData[] = ${JSON.stringify(liteVillages, null, 2).replace(/"([^"]+)":/g, '$1:')};

export const REGIONAL_HEALTH_INFO = ${JSON.stringify(REGIONAL_HEALTH_INFO, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

const filePath = path.join(__dirname, 'src', 'data', 'villages.ts');
fs.writeFileSync(filePath, newTsContent.trim() + '\\n');
console.log('Done!');
