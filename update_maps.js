
const fs = require('fs');

const mapImagesStr = const mapImages: Record<string, string> = {
  'soureh': '/soureh_map_hq.png',
  'pol-now': '/pol-now_map_hq.png',
  'ariz': '/ariz_map_hq.png',
  'jadideh': '/jadideh_map_v4.jpg',
  'darband-gharbi': '/darband-gharbi_map_hq.png',
  'darband-sharqi': '/darband-sharqi_map_hq.png',
  'sad-dastgah': '/sad-dastgah_map_hq.png',
  'maslavi': '/maslavi_map_hq.png',
  'shahrak-sadat': '/shahrak-sadat_map_hq.png',
  'shahrak-sevvom': '/shahrak-sevvom_map_hq.jpg'
};;

function updateFile(path) {
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(/const mapImages: Record<string, string> = \{[\s\S]*?\};/, mapImagesStr);
  fs.writeFileSync(path, c, 'utf8');
}

updateFile('src/components/VillageHub.tsx');
updateFile('src/components/VillageDossierModal.tsx');

