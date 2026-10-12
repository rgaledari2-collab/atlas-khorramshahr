
const fs = require('fs');

const mapImagesStr = 'const mapImages: Record<string, string> = {\\n' +
  '  \\'soureh\\': \\'/soureh_map_hq.png\\',\\n' +
  '  \\'pol-now\\': \\'/pol-now_map_hq.png\\',\\n' +
  '  \\'ariz\\': \\'/ariz_map_hq.png\\',\\n' +
  '  \\'jadideh\\': \\'/jadideh_map_v4.jpg\\',\\n' +
  '  \\'darband-gharbi\\': \\'/darband-gharbi_map_hq.png\\',\\n' +
  '  \\'darband-sharqi\\': \\'/darband-sharqi_map_hq.png\\',\\n' +
  '  \\'sad-dastgah\\': \\'/sad-dastgah_map_hq.png\\',\\n' +
  '  \\'maslavi\\': \\'/maslavi_map_hq.png\\',\\n' +
  '  \\'shahrak-sadat\\': \\'/shahrak-sadat_map_hq.png\\',\\n' +
  '  \\'shahrak-sevvom\\': \\'/shahrak-sevvom_map_hq.jpg\\'\\n' +
  '};';

function updateFile(path) {
  try {
    let c = fs.readFileSync(path, 'utf8');
    c = c.replace(/const mapImages: Record<string, string> = \\{[\\s\\S]*?\\};/g, mapImagesStr);
    fs.writeFileSync(path, c, 'utf8');
    console.log('Updated ' + path);
  } catch(e) {}
}

const paths = [
  'C:/Users/badban/.gemini/antigravity/scratch/new-pelakeyek/new-pelakeyek-main/src/components/VillageHub.tsx',
  'C:/Users/badban/.gemini/antigravity/scratch/new-pelakeyek/new-pelakeyek-main/src/components/VillageDossierModal.tsx',
  'C:/Users/badban/.gemini/antigravity/brain/0f09b3e3-b96e-4155-ada1-6312ca77094f/PELAKEYEK/new-pelakeyek-main/src/components/VillageHub.tsx',
  'C:/Users/badban/.gemini/antigravity/brain/0f09b3e3-b96e-4155-ada1-6312ca77094f/PELAKEYEK/new-pelakeyek-main/src/components/VillageDossierModal.tsx',
  'C:/Users/badban/Downloads/???? ????/src/components/VillageHub.tsx',
  'C:/Users/badban/Downloads/???? ????/src/components/VillageDossierModal.tsx'
];

for(let p of paths) updateFile(p);

