(function(){
const data=window.STORYMAP||{};
const map=L.map('map',{scrollWheelZoom:true}).setView([16.2,107.7],6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
const visited=new Set(data.visited||[]);
const centers=data.centers||{};
const byName={}; (data.provinces||[]).forEach(x=>byName[x[1]]=x[0]);
const fallback=L.layerGroup().addTo(map);
Object.entries(centers).forEach(([name,ll])=>{
 const code=byName[name]; const marker=L.circleMarker(ll,{radius:visited.has(code)?8:6,weight:2,fillOpacity:.75,fillColor:visited.has(code)?'#16a34a':'#e53935',color:'#fff'}).addTo(fallback);
 marker.bindTooltip(name,{direction:'top'}); marker.on('click',()=>{location.href='/story/new/'+encodeURIComponent(code)});
});
const geoUrl='https://raw.githubusercontent.com/mrtinhnguyen/GISData/main/Vietnam%20Administrative%20Divisions%20%28Pre-2025%29%20-%20%C4%90%C6%A1n%20v%E1%BB%8B%20h%C3%A0nh%20ch%C3%ADnh%20Vi%E1%BB%87t%20Nam%20%28Tr%C6%B0%E1%BB%9Bc%202025%29/Provinces_included_Paracel_SpratlyIslands_combine.geojson';
fetch(geoUrl).then(r=>r.ok?r.json():Promise.reject()).then(g=>{
 fallback.clearLayers();
 const layer=L.geoJSON(g,{style:f=>({color:'#9ca3af',weight:1,fillColor:visited.has(String(f.properties?.code||f.properties?.id||''))?'#16a34a':'#f87171',fillOpacity:.38}),onEachFeature:(f,l)=>{const p=f.properties||{}; const code=String(p.code||p.id||''); const name=p.name||p.NAME||p.Name||'Tỉnh'; l.bindTooltip(name); l.on('click',()=>{if(code) location.href='/story/new/'+encodeURIComponent(code)});}}).addTo(map); map.fitBounds(layer.getBounds(),{padding:[10,10]});
}).catch(()=>{});
const search=document.getElementById('search');
if(search){search.addEventListener('input',()=>{const q=search.value.toLowerCase().trim(); document.querySelectorAll('.leaflet-marker-icon').forEach(()=>{}); Object.entries(centers).forEach(([name,ll])=>{if(q && !name.toLowerCase().includes(q)) return;});});}
})();
