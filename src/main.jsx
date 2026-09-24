import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import './styles.css';

const A = `${import.meta.env.BASE_URL}assets/`;
const destinationMotion = {
  edinburgh: { mood: 'cold', reveal: 'architectural', accent: 'var(--cyan)' },
  lauterbrunnen: { mood: 'alpine', reveal: 'vertical', accent: 'var(--cyan)' },
  hallstatt: { mood: 'lake', reveal: 'reflection', accent: 'var(--cyan)' },
  santorini: { mood: 'horizon', reveal: 'horizon', accent: 'var(--cyan)' },
  eguisheim: { mood: 'warm', reveal: 'framed', accent: 'var(--cyan)' },
  'mount-fuji': { mood: 'minimal', reveal: 'layered', accent: 'var(--cyan)' },
  portofino: { mood: 'coastal', reveal: 'coastal', accent: 'var(--cyan)' }
};
const nearbyPlaces = {
  edinburgh: [
    ['Edinburgh Castle', 'Historic fortress', 'Medieval stronghold on Castle Rock with panoramic views across the city.', 'https://www.google.com/maps/search/?api=1&query=Edinburgh+Castle'],
    ['Arthur’s Seat', 'Hilltop viewpoint', 'Ancient volcanic summit in Holyrood Park with a broad view over Edinburgh.', 'https://www.google.com/maps/search/?api=1&query=Arthur%27s+Seat+Edinburgh'],
    ['Royal Mile', 'Old town walk', 'Historic street linking Edinburgh Castle with the Palace of Holyroodhouse.', 'https://www.google.com/maps/search/?api=1&query=Royal+Mile+Edinburgh']
  ],
  lauterbrunnen: [
    ['Staubbach Falls', 'Valley waterfall', 'One of Europe’s highest free-falling waterfalls, descending from the Lauterbrunnen cliffs.', 'https://www.google.com/maps/search/?api=1&query=Staubbach+Falls'],
    ['Trümmelbach Falls', 'Glacier waterfalls', 'A series of waterfalls inside the mountain, fed by the Eiger, Mönch and Jungfrau glaciers.', 'https://www.google.com/maps/search/?api=1&query=Trummelbach+Falls'],
    ['Mürren', 'Mountain village', 'Car-free village above the valley with direct views toward the Bernese Alps.', 'https://www.google.com/maps/search/?api=1&query=Murren+Switzerland']
  ],
  hallstatt: [
    ['Hallstatt Skywalk', 'Lake overlook', 'Elevated viewing platform above the historic village and Lake Hallstatt.', 'https://www.google.com/maps/search/?api=1&query=Hallstatt+Skywalk'],
    ['Hallstatt Salt Mine', 'Historic mine', 'Working salt-mine experience tied to the region’s long archaeological history.', 'https://www.google.com/maps/search/?api=1&query=Hallstatt+Salt+Mine'],
    ['Lake Hallstatt', 'Lakeside landscape', 'Mountain-framed lake whose shoreline defines the village’s character.', 'https://www.google.com/maps/search/?api=1&query=Lake+Hallstatt']
  ],
  santorini: [
    ['Akrotiri Archaeological Site', 'Bronze Age settlement', 'Preserved Minoan settlement buried by the volcanic eruption of the seventeenth century BCE.', 'https://www.google.com/maps/search/?api=1&query=Akrotiri+Archaeological+Site'],
    ['Oia', 'Caldera village', 'Clifftop village known for whitewashed architecture and views across the caldera.', 'https://www.google.com/maps/search/?api=1&query=Oia+Santorini'],
    ['Red Beach', 'Volcanic shoreline', 'Distinctive red volcanic cliffs and dark shoreline on the island’s southern coast.', 'https://www.google.com/maps/search/?api=1&query=Red+Beach+Santorini']
  ],
  eguisheim: [
    ['Eguisheim Old Town', 'Medieval village centre', 'Concentric lanes of half-timbered houses, flowers and wine-cellar façades.', 'https://www.google.com/maps/search/?api=1&query=Eguisheim+Old+Town'],
    ['Château Saint-Léon', 'Historic castle site', 'Central castle remains around which the medieval village developed.', 'https://www.google.com/maps/search/?api=1&query=Chateau+Saint-Leon+Eguisheim'],
    ['Colmar', 'Alsatian old town', 'Nearby historic town with canals, preserved architecture and regional museums.', 'https://www.google.com/maps/search/?api=1&query=Colmar+France']
  ],
  'mount-fuji': [
    ['Chureito Pagoda', 'Mountain viewpoint', 'Five-story pagoda with a famous view toward Mount Fuji and the surrounding valley.', 'https://www.google.com/maps/search/?api=1&query=Chureito+Pagoda'],
    ['Lake Kawaguchi', 'Fuji lakeshore', 'One of the Fuji Five Lakes, with open water views toward the mountain.', 'https://www.google.com/maps/search/?api=1&query=Lake+Kawaguchi'],
    ['Fuji Five Lakes', 'Mountain landscape', 'Lakeside region offering different perspectives on Fuji’s volcanic form.', 'https://www.google.com/maps/search/?api=1&query=Fuji+Five+Lakes']
  ],
  portofino: [
    ['Castello Brown', 'Harbour viewpoint', 'Historic castle above the harbour with views across Portofino and the Ligurian coast.', 'https://www.google.com/maps/search/?api=1&query=Castello+Brown+Portofino'],
    ['Abbazia di San Fruttuoso', 'Coastal abbey', 'Secluded Benedictine abbey reached by footpath or boat along the coast.', 'https://www.google.com/maps/search/?api=1&query=San+Fruttuoso+Abbey'],
    ['Portofino Regional Park', 'Coastal trails', 'Protected headland of woodland paths, cliffs and Mediterranean views.', 'https://www.google.com/maps/search/?api=1&query=Portofino+Regional+Park']
  ]
};
const weatherCache = new Map();
const weatherLabels = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle',
  55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
  81: 'Rain showers', 82: 'Heavy showers', 95: 'Thunderstorm',
  96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail'
};

const destinations = [
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', region: 'Europe', latitude: 55.9533, longitude: -3.1883, description: 'A historic Scottish capital where medieval character meets dramatic landscapes and a world-famous festival culture.', history: 'Edinburgh grew around its castle on volcanic rock, becoming a royal and political centre in the medieval era. The elegant New Town followed during the Scottish Enlightenment.', culture: 'Traditional Scottish music and heritage meet modern creativity in the Edinburgh Festival Fringe and a year-round arts scene.', significance: 'A city where ancient stone, hills, and contemporary culture form one of Europe’s most distinctive capitals.', location: 'Set between hills and the Firth of Forth in southeastern Scotland.', heroImage: 'edinburgh_insidehome_1.jpg', gallery: ['edinburgh_insidehome_1.jpg', 'edinburgh_insidehome_2.jpg', 'edinburgh_front_page_image.jpg'], videos: ['edinburgh_video.mp4', 'edinburgh_video2.mp4'], mapUrl: 'https://maps.app.goo.gl/MA7L7mL9ftxyQsew8' },
  { id: 'lauterbrunnen', name: 'Lauterbrunnen', country: 'Switzerland', region: 'Europe', latitude: 46.5935, longitude: 7.909, description: 'A glacier-carved Alpine valley of waterfalls, cliffs, wooden chalets, and extraordinary mountain scale.', history: 'First mentioned in 1240, the village grew from Alpine farming into a destination for travellers during the rise of nineteenth-century mountain tourism.', culture: 'Its culture remains rooted in mountain life, local festivals, timber architecture, and strong Swiss Alpine traditions.', significance: 'The valley’s many fountains and sheer cliffs make it one of Europe’s defining landscapes.', location: 'In the Bernese Oberland, surrounded by steep Alpine cliffs and waterfalls.', heroImage: 'Lauterbrunnen_insidehome_1.jpg', gallery: ['Lauterbrunnen_insidehome_1.jpg', 'lauterbrunnen_insidehome_2.jpg', 'Lauterbrunnen_front_page_image.jpg'], videos: ['lauterbrunnen_video.mp4', 'lauterbrunnen_video2.mp4'], mapUrl: 'https://maps.app.goo.gl/aSJbxNyGGy32AX3f9' },
  { id: 'hallstatt', name: 'Hallstatt', country: 'Austria', region: 'Europe', latitude: 47.5613, longitude: 13.6493, description: 'A lakeside village shaped by mountains, salt, and more than seven thousand years of human history.', history: 'Hallstatt’s salt mines and archaeological heritage connect the village to one of Europe’s earliest Iron Age cultures.', culture: 'Life follows the lake and mountain seasons, with wooden homes, local craft, and a deep relationship to the surrounding landscape.', significance: 'Its compact shoreline and immense mountain setting have made Hallstatt an enduring image of Alpine Europe.', location: 'On the western shore of Lake Hallstatt in Austria’s Salzkammergut region.', heroImage: 'Hallstatt_insidehome_1.jpg', gallery: ['Hallstatt_insidehome_1.jpg', 'Hallstatt_insidehome_2.jpg', 'hallstatt_front_page_image.jpg'], videos: ['Hallstatt_video.mp4', 'Hallstattvideo2.mp4'], mapUrl: 'https://maps.app.goo.gl/fuBc5UEsNdjQSaWT9' },
  { id: 'santorini', name: 'Santorini', country: 'Greece', region: 'Europe', latitude: 36.3932, longitude: 25.4615, description: 'A volcanic island of whitewashed villages, blue domes, and caldera horizons over the Aegean Sea.', history: 'A massive eruption around 1600 BCE shaped the caldera and left the remarkable Minoan settlement at Akrotiri.', culture: 'Island life is expressed through wine-making, seafood, whitewashed architecture, and the ritual of watching the sun descend into the sea.', significance: 'Its volcanic geology and ancient history give Santorini a landscape unlike any other Greek island.', location: 'In the southern Aegean Sea, around 200 kilometres southeast of mainland Greece.', heroImage: 'santorini_insidehome_1.jpg', gallery: ['santorini_insidehome_1.jpg', 'santorini_insidehome_2.jpg', 'santorini_front_page_image.jpg'], videos: ['santorini_video.mp4', 'santorini_video2.mp4'], mapUrl: 'https://maps.app.goo.gl/SLodChX2n5EGZiiB6' },
  { id: 'eguisheim', name: 'Eguisheim', country: 'France', region: 'Europe', latitude: 48.0424, longitude: 7.307, description: 'A circular medieval village of colourful façades, winding lanes, and celebrated Alsatian wine heritage.', history: 'Eguisheim grew around a medieval castle and retains concentric streets that trace its historic fortifications.', culture: 'The village is known for its half-timbered homes, flower-filled lanes, wine traditions, and intimate seasonal festivals.', significance: 'Its preserved form and warm architectural palette make Eguisheim one of Alsace’s most distinctive villages.', location: 'In the Alsace wine country near Colmar, eastern France.', heroImage: 'eguisheim_insidehome_1.jpg', gallery: ['eguisheim_insidehome_1.jpg', 'eguisheim_insidehome_2.jpg', 'eguisheim_front_page_image.jpg'], videos: [], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Eguisheim%2C%20France' },
  { id: 'mount-fuji', name: 'Mount Fuji', country: 'Japan', region: 'Asia', latitude: 35.3606, longitude: 138.7274, description: 'Japan’s snow-capped volcanic icon, held in equal measure as a sacred mountain and a subject of art.', history: 'Fuji was formed through volcanic activity and has been a pilgrimage site for centuries. During the Edo period it became a defining subject in art and literature.', culture: 'The mountain represents harmony, beauty, and reverence, inspiring prints, poetry, pilgrimage, and contemporary Japanese identity.', significance: 'A UNESCO World Heritage Site where natural scale and cultural meaning are inseparable.', location: 'On Honshu Island, rising above lakes and forests west of Tokyo.', heroImage: 'mountfuji_insidehome_1.jpg', gallery: ['mountfuji_insidehome_1.jpg', 'mountfuji_insidehome_2.jpg', 'mountfuji_front_page_image.jpg'], videos: ['mountfuji_video.mp4', 'mountfuji_video2.mp4'], mapUrl: 'https://maps.app.goo.gl/zQQBAMCeDEtSoj1y5' },
  { id: 'portofino', name: 'Portofino', country: 'Italy', region: 'Europe', latitude: 44.3032, longitude: 9.209, description: 'A colourful harbour on the Italian Riviera where Mediterranean nature meets enduring coastal elegance.', history: 'Known to the Romans as Portus Delphini, Portofino grew from a fishing village into a haven for artists, travellers, and aristocrats.', culture: 'Italian coastal traditions, seafood, art, and an unhurried harbour life sit alongside the town’s modern luxury.', significance: 'A small, protected landscape with a global image and a strong sense of place.', location: 'Along the Ligurian coast between lush hills and the Mediterranean Sea.', heroImage: 'portofino_insidehome_1.jpg', gallery: ['portofino_insidehome_1.jpg', 'portofino_insidehome_2.jpg', 'portofino_home_page_image.jpg'], videos: ['portofino_video.mp4', 'portofino_video2.mp4'], mapUrl: 'https://maps.app.goo.gl/YViR5UEDFvrEn6L99' },
];
const visitorData = {
  edinburgh: { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'VisitScotland research', sourceUrl: 'https://www.visitscotland.org/research-insights' },
  lauterbrunnen: { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'Jungfrau Region tourism', sourceUrl: 'https://www.jungfrauregion.swiss/en/destination/about-us.html' },
  hallstatt: { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'Upper Austria tourism', sourceUrl: 'https://www.oberoesterreich.at/en/oesterreich-staedte-und-regionen/regionen/salzkammergut.html' },
  santorini: { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'Greek tourism statistics', sourceUrl: 'https://www.statistics.gr/en/statistics/-/publication/STO01' },
  eguisheim: { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'Alsace destination statistics', sourceUrl: 'https://www.visit.alsace/en/our-commitments/our-tourism-observatory/' },
  'mount-fuji': { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'Japan tourism statistics', sourceUrl: 'https://www.jnto.go.jp/statistics/' },
  portofino: { year2025: 'Not yet published', year2026: 'Not yet published', sourceLabel: 'Liguria tourism statistics', sourceUrl: 'https://www.regione.liguria.it/homepage/turismo.html' }
};

function latLngToVector3(latitude, longitude, radius = 1) {
  const phi = (90 - latitude) * Math.PI / 180;
  const theta = (longitude + 180) * Math.PI / 180;
  return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); update(); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []);
  return reduced;
}

function WorldCanvas({ activeDestination, onFocus, onSelect, introComplete, explorationActive, focusedId, onReady, onError }) {
  const mountRef = useRef(null);
  const interactionRef = useRef({ explorationActive, focusedId });
  interactionRef.current = { explorationActive, focusedId };
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.1, 100); camera.position.set(0, 0.1, 3.1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); const pixelRatioCap = window.innerWidth <= 800 ? 1.25 : 1.5; renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap)); renderer.setSize(mount.clientWidth, mount.clientHeight); renderer.outputColorSpace = THREE.SRGBColorSpace; mount.appendChild(renderer.domElement);
    const group = new THREE.Group(); group.rotation.y = -1.1; scene.add(group); scene.add(new THREE.AmbientLight(0x7088a8, 0.65)); const key = new THREE.DirectionalLight(0xd9ecff, 2.3); key.position.set(-3, 2, 4); scene.add(key);
    const loader = new THREE.TextureLoader();
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x315a70, emissive: new THREE.Color(0x18344a), emissiveIntensity: 0.35, shininess: 8 });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMaterial); group.add(earth);
    const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.012, 32, 32), cloudMaterial); group.add(clouds);
    let day;
    let night;
    let cloud;
    let primaryTextureReady = false;
    let readyNotified = false;
    let enhancementIdleId;
    const loadEnhancements = () => {
      loader.load(`${A}earth_day.jpg`, (texture) => { const previous = day; day = texture; day.colorSpace = THREE.SRGBColorSpace; earthMaterial.map = day; earthMaterial.needsUpdate = true; previous?.dispose(); });
      loader.load(`${A}earth_nightmap_initial.jpg`, (nightTexture) => { night = nightTexture; earthMaterial.emissiveMap = night; earthMaterial.needsUpdate = true; });
      loader.load(`${A}earth_clouds_initial.jpg`, (cloudTexture) => { cloud = cloudTexture; cloud.colorSpace = THREE.SRGBColorSpace; cloudMaterial.map = cloud; cloudMaterial.opacity = 0.22; cloudMaterial.needsUpdate = true; });
    };
    loader.load(`${A}earth_day_initial.jpg`, (texture) => {
      primaryTextureReady = true;
      day = texture; day.colorSpace = THREE.SRGBColorSpace; earthMaterial.map = day; earthMaterial.color.set(0xffffff); earthMaterial.needsUpdate = true;
    }, undefined, () => { if (!readyNotified) onError?.(); });
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x6ec8ff, transparent: true, opacity: 0.1, side: THREE.BackSide, blending: THREE.AdditiveBlending });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.07, 32, 32), glowMaterial); group.add(glow);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x6ec8ff, transparent: true, opacity: 0.16, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(new THREE.RingGeometry(1.22, 1.225, 64), orbitMaterial);
    orbit.rotation.x = Math.PI * 0.36;
    orbit.rotation.z = Math.PI * 0.12;
    group.add(orbit);
    const points = new THREE.Group(); group.add(points); const markers = new Map();
    destinations.forEach((destination) => { const marker = new THREE.Group(); marker.position.copy(latLngToVector3(destination.latitude, destination.longitude, 1.035)); marker.lookAt(new THREE.Vector3(0, 0, 0)); const ring = new THREE.Mesh(new THREE.RingGeometry(0.018, 0.027, 24), new THREE.MeshBasicMaterial({ color: 0x69d9ff, transparent: true, opacity: 0.9, side: THREE.DoubleSide })); const core = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf5fbff })); const halo = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.043, 24), new THREE.MeshBasicMaterial({ color: 0x7ddfff, transparent: true, opacity: 0, side: THREE.DoubleSide })); marker.add(ring, core, halo); points.add(marker); markers.set(destination.id, marker); });
    const routeMaterial = new THREE.LineBasicMaterial({ color: 0x7ddfff, transparent: true, opacity: 0.16 }); const routePoints = destinations.map((item) => latLngToVector3(item.latitude, item.longitude, 1.045)); const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(routePoints), routeMaterial); route.visible = false; points.add(route);
    const starGeometry = new THREE.BufferGeometry(); const starPositions = new Float32Array(900);
    for (let i = 0; i < starPositions.length; i += 3) { const radius = 5 + Math.random() * 3; const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); starPositions[i] = radius * Math.sin(phi) * Math.cos(theta); starPositions[i + 1] = radius * Math.cos(phi); starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta); }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3)); scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x9db7d2, size: 0.012, transparent: true, opacity: 0.46 })));
    const pointer = { x: 0, y: 0 };
    const interaction = { mode: 'auto', pointerId: null, pointerType: null, lastX: 0, lastY: 0, moved: false, lastDownTime: 0, lastDownTarget: null };
    const raycaster = new THREE.Raycaster(); const raycastMouse = new THREE.Vector2(); const interactiveObjects = []; const objectToDestination = new Map(); let hoveredId = null;
    markers.forEach((marker, id) => marker.children.forEach((child) => { interactiveObjects.push(child); objectToDestination.set(child, id); }));
    const getHit = (event) => { const rect = renderer.domElement.getBoundingClientRect(); raycastMouse.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1); raycaster.setFromCamera(raycastMouse, camera); const hit = raycaster.intersectObjects(interactiveObjects, false)[0]; return hit ? objectToDestination.get(hit.object) ?? null : null; };
    const onPointerMove = (event) => { const rect = mount.getBoundingClientRect(); const x = event.clientX - rect.left; const y = event.clientY - rect.top; pointer.x = x / rect.width - 0.5; pointer.y = y / rect.height - 0.5; if (interaction.mode === 'manual' && event.pointerId === interaction.pointerId) { const deltaX = x - interaction.lastX; const deltaY = y - interaction.lastY; if (Math.abs(deltaX) + Math.abs(deltaY) > 1) interaction.moved = true; group.rotation.y += deltaX * 0.006; group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + deltaY * 0.006, -0.62, 0.62); interaction.lastX = x; interaction.lastY = y; if (event.pointerType === 'touch') event.preventDefault(); } const hitId = getHit(event); if (hitId !== hoveredId) { hoveredId = hitId; onFocus(hitId); mount.style.cursor = hitId ? 'pointer' : interaction.mode === 'manual' ? 'grabbing' : ''; } };
    const onPointerDown = (event) => { if (event.pointerType === 'mouse' && event.button !== 0) return; interaction.moved = false; const hitId = getHit(event); const now = performance.now(); const secondPress = event.pointerType === 'mouse' && interaction.lastDownTarget === hitId && now - interaction.lastDownTime < 360; interaction.lastDownTime = now; interaction.lastDownTarget = hitId; if (hitId) return; if (event.pointerType !== 'mouse' || secondPress) { interaction.mode = 'manual'; interaction.pointerId = event.pointerId; interaction.pointerType = event.pointerType; interaction.lastX = event.clientX - mount.getBoundingClientRect().left; interaction.lastY = event.clientY - mount.getBoundingClientRect().top; mount.setPointerCapture?.(event.pointerId); mount.style.cursor = 'grabbing'; if (event.pointerType === 'touch') event.preventDefault(); } };
    const onPointerUp = (event) => { if (interaction.mode !== 'manual' || event.pointerId !== interaction.pointerId) return; interaction.mode = 'auto'; interaction.pointerId = null; interaction.pointerType = null; interaction.lastX = 0; interaction.lastY = 0; mount.releasePointerCapture?.(event.pointerId); mount.style.cursor = hoveredId ? 'pointer' : ''; };
    const onPointerLeave = () => { if (interaction.mode === 'manual' && interaction.pointerType === 'mouse') return; hoveredId = null; onFocus(null); mount.style.cursor = ''; };
    const onClick = (event) => { if (interaction.moved) return; const hitId = getHit(event); if (hitId) { onFocus(hitId); onSelect(hitId); } };
    let resizeFrame;
    const onResize = () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => { camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); }); };
    mount.addEventListener('pointermove', onPointerMove); mount.addEventListener('pointerdown', onPointerDown); mount.addEventListener('pointerup', onPointerUp); mount.addEventListener('pointercancel', onPointerUp); mount.addEventListener('pointerleave', onPointerLeave); mount.addEventListener('click', onClick); window.addEventListener('resize', onResize); let frame;
    const targetScale = new THREE.Vector3(introComplete ? 1.12 : 0.9, introComplete ? 1.12 : 0.9, introComplete ? 1.12 : 0.9);
    let previousFrameTime = performance.now();
    let stableFrames = 0;
    const animate = () => { if (document.visibilityState !== 'visible') { frame = requestAnimationFrame(animate); return; } frame = requestAnimationFrame(animate); const now = performance.now(); const frameDelta = now - previousFrameTime; previousFrameTime = now; stableFrames = frameDelta < 40 ? stableFrames + 1 : 0; const rotationBefore = group.rotation.y; if (interaction.mode === 'auto') group.rotation.y += 0.00055; orbit.rotation.y -= 0.00035; clouds.rotation.y += 0.0005; const time = now * 0.002; const { focusedId: currentFocusedId, explorationActive: currentExploration } = interactionRef.current; markers.forEach((marker, id) => { const focused = id === currentFocusedId; marker.scale.setScalar((focused ? 1.8 : 1) + Math.sin(time + marker.position.x * 5) * (focused ? 0.2 : 0.08)); marker.children[2].material.opacity += ((focused ? 0.55 : 0) - marker.children[2].material.opacity) * 0.12; marker.children[0].material.opacity += ((currentExploration ? (focused ? 1 : 0.6) : 0.18) - marker.children[0].material.opacity) * 0.08; }); route.visible = currentExploration; group.scale.lerp(targetScale, 0.025); renderer.render(scene, camera); if (!readyNotified && primaryTextureReady && interaction.mode === 'auto' && group.rotation.y !== rotationBefore && stableFrames >= 4) { readyNotified = true; onReady?.(); enhancementIdleId = window.requestIdleCallback ? window.requestIdleCallback(loadEnhancements, { timeout: 1800 }) : window.setTimeout(loadEnhancements, 1200); } };
    animate();
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); if (window.cancelIdleCallback && enhancementIdleId) window.cancelIdleCallback(enhancementIdleId); else if (enhancementIdleId) window.clearTimeout(enhancementIdleId); mount.removeEventListener('pointermove', onPointerMove); mount.removeEventListener('pointerdown', onPointerDown); mount.removeEventListener('pointerup', onPointerUp); mount.removeEventListener('pointercancel', onPointerUp); mount.removeEventListener('pointerleave', onPointerLeave); mount.removeEventListener('click', onClick); window.removeEventListener('resize', onResize); renderer.dispose(); scene.traverse((object) => { if (!object.isMesh && !object.isPoints && !object.isLine) return; object.geometry?.dispose(); if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose()); else object.material?.dispose(); }); day?.dispose(); night?.dispose(); cloud?.dispose(); mount.removeChild(renderer.domElement); };
  }, [onFocus, onSelect, introComplete, onReady, onError]);
  return <div className="world-canvas" ref={mountRef} aria-label="Interactive Earth atlas" />;
}

function Navigation({ scene, menuOpen, setMenuOpen, onWorld, onAbout }) {
  return <header className="nav"><button className="wordmark" onClick={onWorld} aria-label="Return to Voyage / Atlas world"><span>Voyage</span><i>/</i><span>Atlas</span></button><div className="nav-actions"><button className="nav-item" onClick={onAbout}>About</button><button className={`nav-item menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><span>Index</span><b /><b /></button></div></header>;
}

function DestinationIndex({ onSelect }) {
  const groups = useMemo(() => destinations.reduce((acc, item) => { (acc[item.region] ??= []).push(item); return acc; }, {}), []);
  return <aside className="index-panel" aria-label="Destination index"><div className="index-heading"><span>Atlas index</span><small>{destinations.length.toString().padStart(2, '0')} places</small></div>{Object.entries(groups).map(([region, items]) => <div className="index-group" key={region}><p>{region}</p>{items.map((item, index) => <button key={item.id} onClick={() => onSelect(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong><em>{item.country}</em></button>)}</div>)}</aside>;
}

function WorldOverlay({ activeDestination, focusedDestination, onSelect, explorationActive }) {
  const [query, setQuery] = useState('');
  const visible = destinations.filter((d) => `${d.name} ${d.country} ${d.region}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="world-overlay"><div className={`world-intro-copy ${explorationActive ? 'is-exploring' : ''}`}><p className="eyebrow">A cinematic atlas of places worth getting lost in.</p><h1 className="world-title">Find your<br /><i>elsewhere.</i></h1><p className="world-description">A spatial archive of places, landscapes, and the stories that make them stay with you.</p></div><div className="world-meta"><span>{explorationActive ? 'Discovery / Active' : 'World / Earth'}</span><span className="line" /><span>{explorationActive ? 'Hover a marker to focus' : 'Drag to look around'}</span></div>{focusedDestination && <div className="marker-preview"><span>LOCATION FOCUS</span><strong>{focusedDestination.name}</strong><small>{focusedDestination.country} · {focusedDestination.latitude.toFixed(2)}° {focusedDestination.latitude >= 0 ? 'N' : 'S'} / {Math.abs(focusedDestination.longitude).toFixed(2)}° {focusedDestination.longitude >= 0 ? 'E' : 'W'}</small><button onClick={() => onSelect(focusedDestination.id)}>Enter this place <i>↗</i></button></div>}{activeDestination && <div className="active-coordinate"><span>FOCUSING</span><strong>{activeDestination.name}</strong><small>{activeDestination.latitude.toFixed(2)}° {activeDestination.latitude >= 0 ? 'N' : 'S'} / {Math.abs(activeDestination.longitude).toFixed(2)}° {activeDestination.longitude >= 0 ? 'E' : 'W'}</small></div>}<div className="discover-dock"><label htmlFor="atlas-search">Find a place to begin.</label><div className="search-line"><span>⌕</span><input id="atlas-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the atlas" /></div>{query && <div className="search-results">{visible.slice(0, 5).map((item) => <button key={item.id} onClick={() => onSelect(item.id)}>{item.name}<span>{item.country}</span></button>)}</div>}</div></div>;
}

function Gallery({ destination }) {
  const archiveRef = useRef(null); const [visible, setVisible] = useState(false);
  const sourceImages = destination.gallery.length ? destination.gallery : destination.heroImage ? [destination.heroImage] : [];
  useEffect(() => {
    const node = archiveRef.current;
    if (!node) return undefined;
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        revealed = true;
        setVisible(true);
        observer?.disconnect();
        window.removeEventListener('scroll', reveal);
      }

    };
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { if (entry.isIntersecting) reveal(); }, { threshold: 0.01, rootMargin: '12% 0px' })
      : null;
    observer?.observe(node);
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();
    return () => { observer?.disconnect(); window.removeEventListener('scroll', reveal); };
  }, []);
  if (!sourceImages.length) return <div className="gallery-empty"><span>Photography archive</span><strong>Coming from the field.</strong><p>This destination is part of the atlas, while its visual archive is still being assembled.</p></div>;
  const images = Array.from({ length: 6 }, (_, index) => sourceImages[index % sourceImages.length]);
  return <div className={`gallery-archive ${visible ? 'is-visible' : ''}`} ref={archiveRef}><div className="gallery-caption"><span>06 / Visual archive</span><strong>{destination.name} / Field notes</strong></div><div className="gallery-grid">{images.map((image, index) => <figure className="gallery-card" key={`${image}-${index}`}><img src={`${A}${image}`} alt={`${destination.name} archive view ${index + 1}`} loading="lazy" /><figcaption><span>{String(index + 1).padStart(2, '0')}</span><em>{destination.region} / {destination.country}</em></figcaption></figure>)}</div></div>;
}

function LiveDestinationExperience({ destination }) {
  const [weather, setWeather] = useState({ status: 'loading', data: null });
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const cached = weatherCache.get(destination.id);
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) { setWeather({ status: 'ready', data: cached.data }); return undefined; }
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: destination.latitude, longitude: destination.longitude,
      current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
      daily: 'sunrise,sunset', timezone: 'auto', forecast_days: '1'
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Weather request failed: ${response.status}`); return response.json(); })
      .then((data) => { weatherCache.set(destination.id, { timestamp: Date.now(), data }); setWeather({ status: 'ready', data }); })
      .catch((error) => { if (error.name !== 'AbortError') setWeather({ status: 'unavailable', data: null }); });
    return () => controller.abort();
  }, [destination.id, destination.latitude, destination.longitude]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const timezone = weather.data?.timezone;
  const localTime = timezone ? new Intl.DateTimeFormat(undefined, { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now) : 'Unavailable';
  const current = weather.data?.current;
  const places = nearbyPlaces[destination.id] ?? [];
  const visitors = visitorData[destination.id];
  return <section className="live-experience" aria-labelledby="live-experience-title">
    <div className="live-heading"><span>08 / Destination field notes</span><h3 id="live-experience-title">{destination.name}<i> / in context</i></h3><p>A final connection between the story, the place and the world around it. Weather is model-based and refreshed when you arrive.</p></div>
    <div className="live-grid">
      <div className="live-conditions"><div className="live-status"><i /> {weather.status === 'ready' ? 'Live conditions' : weather.status === 'loading' ? 'Requesting conditions' : 'Live conditions unavailable'}</div>
        {weather.status === 'ready' && current ? <><strong>{Math.round(current.temperature_2m)}°</strong><span>{weatherLabels[current.weather_code] ?? 'Current conditions'}</span><small>Feels like {Math.round(current.apparent_temperature)}° · Wind {Math.round(current.wind_speed_10m)} km/h</small></> : <p>Live conditions are temporarily unavailable. The destination story remains available.</p>}
      </div>
      <div className="live-context"><span>Local time</span><strong>{localTime}</strong><small>{timezone ? timezone.replace('_', ' ') : 'Destination timezone unavailable'}</small><div className="visitor-data"><span>Published visitor data</span><div><strong>2025</strong><em>{visitors.year2025}</em></div><div><strong>2026</strong><em>{visitors.year2026}</em></div><a href={visitors.sourceUrl} target="_blank" rel="noreferrer">Source · {visitors.sourceLabel} ↗</a></div></div>
    </div>
    <div className="nearby-places"><div><span>Nearby places</span><p>Continue outward from {destination.name}.</p></div><div className="nearby-list">{places.map(([name, category, description, url]) => <article key={name}><strong>{name}</strong><small>{category}</small><p>{description}</p><a href={url} target="_blank" rel="noreferrer">Open in Maps ↗</a></article>)}</div></div>
    <div className="live-footer"><span>{destination.latitude.toFixed(4)}° {destination.latitude >= 0 ? 'N' : 'S'} / {Math.abs(destination.longitude).toFixed(4)}° {destination.longitude >= 0 ? 'E' : 'W'}</span><a className="map-link" href={destination.mapUrl} target="_blank" rel="noreferrer">Open coordinates in Google Maps ↗</a></div>
  </section>;
}

function ParticleTitle({ children, reducedMotion }) {
  const titleRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const title = titleRef.current;
    const canvas = canvasRef.current;
    if (!title || !canvas || reducedMotion) return undefined;
    const context = canvas.getContext('2d');
    const sample = document.createElement('canvas');
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    if (!context || !sampleContext) return undefined;
    let frame;
    let cancelled = false;
    const particles = [];
    const consolidationParticles = [];
    const bounds = title.getBoundingClientRect();
    const style = getComputedStyle(title);
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const horizontalPadding = Math.max(18, Math.min(72, width * 0.18));
    const verticalPadding = Math.max(12, Math.min(48, height * 0.2));
    const canvasWidth = width + horizontalPadding * 2;
    const canvasHeight = height + verticalPadding * 2;
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.left = `${-horizontalPadding}px`;
    canvas.style.top = `${-verticalPadding}px`;
    sample.width = canvas.width;
    sample.height = canvas.height;
    sampleContext.setTransform(1, 0, 0, 1, 0, 0);
    sampleContext.clearRect(0, 0, sample.width, sample.height);
    sampleContext.scale(scale, scale);
    sampleContext.fillStyle = '#fff';
    sampleContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    sampleContext.textBaseline = 'top';
    const letterSpacing = Number.parseFloat(style.letterSpacing) || 0;
    let cursor = 0;
    String(children).split('').forEach((character) => {
      sampleContext.fillText(character, cursor + horizontalPadding, verticalPadding);
      cursor += sampleContext.measureText(character).width + letterSpacing;
    });
    const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
    const step = width < 520 ? 4 : 3;
    for (let y = 0; y < sample.height; y += step * scale) {
      for (let x = 0; x < sample.width; x += step * scale) {
        if (pixels[(Math.floor(y) * sample.width + Math.floor(x)) * 4 + 3] > 120) {
          const targetX = x / scale;
          const targetY = y / scale;
          const spreadX = width * (0.14 + Math.random() * 0.18);
          const spreadY = height * (0.2 + Math.random() * 0.3);
          particles.push({
            x: targetX + (Math.random() - 0.5) * spreadX,
            y: targetY + (Math.random() - 0.5) * spreadY,
            targetX,
            targetY,
            size: Math.random() * 1.35 + 0.55,
            alpha: Math.random() * 0.4 + 0.55,
            delay: Math.random() * 0.18
          });
        }
      }
    }
    const consolidationStep = width < 520 ? 2.2 : 1.8;
    const maxConsolidationParticles = width < 520 ? 12000 : 22000;
    for (let y = 0; y < sample.height && consolidationParticles.length < maxConsolidationParticles; y += consolidationStep * scale) {
      for (let x = 0; x < sample.width && consolidationParticles.length < maxConsolidationParticles; x += consolidationStep * scale) {
        if (pixels[(Math.floor(y) * sample.width + Math.floor(x)) * 4 + 3] > 45) {
          consolidationParticles.push({
            targetX: x / scale,
            targetY: y / scale,
            size: Math.random() * 0.8 + (width < 520 ? 1.1 : 1.25),
            alpha: Math.random() * 0.22 + 0.62
          });
        }
      }
    }
    const started = performance.now();
    const draw = (now) => {
      if (cancelled) return;
      const progress = Math.min(1, (now - started) / 1450);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(scale, scale);
      particles.forEach((particle) => {
        const local = Math.max(0, Math.min(1, (progress - particle.delay) / 0.82));
        const ease = local * local * (3 - 2 * local);
        const drift = (1 - ease) * Math.sin((particle.targetX + particle.targetY) * 0.04 + progress * 5) * 1.5;
        const finalCoverage = 1 + Math.max(0, (progress - 0.82) / 0.18) * 0.28;
        context.fillStyle = `rgba(215, 243, 250, ${particle.alpha})`;
        context.fillRect(
          particle.x + (particle.targetX - particle.x) * ease + drift,
          particle.y + (particle.targetY - particle.y) * ease,
          particle.size * finalCoverage,
          particle.size * finalCoverage
        );
      });
      const consolidation = Math.max(0, Math.min(1, (progress - 0.72) / 0.28));
      const consolidationEase = consolidation * consolidation * (3 - 2 * consolidation);
      if (consolidationEase > 0) {
        consolidationParticles.forEach((particle) => {
          context.fillStyle = `rgba(220, 245, 251, ${particle.alpha * consolidationEase})`;
          context.fillRect(
            particle.targetX - particle.size * 0.18,
            particle.targetY - particle.size * 0.18,
            particle.size * (1 + consolidationEase * 0.35),
            particle.size * (1 + consolidationEase * 0.35)
          );
        });
      }
      context.restore();
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [children, reducedMotion]);
  return <span className={`particle-title ${reducedMotion ? 'is-reduced' : ''}`} ref={titleRef}><span className="particle-title-text">{children}</span><canvas ref={canvasRef} aria-hidden="true" /></span>;
}

function DestinationStory({ destination, onBack }) {
  const [section, setSection] = useState(0); const [chapterProgress, setChapterProgress] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true); const [videoVisible, setVideoVisible] = useState(destination.videos.length === 0);
  const heroRef = useRef(null); const videoRef = useRef(null); const videoFeatureRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const motion = destinationMotion[destination.id] ?? destinationMotion['mount-fuji'];
  const chapterImages = [destination.heroImage, destination.gallery[1] ?? destination.heroImage, destination.gallery[2] ?? destination.heroImage, destination.heroImage];
  const chapters = [{ label: 'The place', title: destination.name, body: destination.description }, { label: 'History', title: 'Layers of time', body: destination.history }, { label: 'Culture', title: 'A living character', body: destination.culture }, { label: 'Significance', title: 'Why it stays', body: destination.significance }];
  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [destination.id]);
  useEffect(() => {
    if (!heroVisible) return undefined;
    let frame; let started = performance.now(); const duration = 5200;
    const tick = (now) => {
      const elapsed = now - started; const progress = Math.max(0, Math.min(1, elapsed / duration)); setChapterProgress(progress);
      if (progress >= 1) { setSection((current) => (current + 1) % chapters.length); started = now; setChapterProgress(0); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [heroVisible, destination.id, chapters.length]);
  useEffect(() => {
    const video = videoRef.current; const feature = videoFeatureRef.current; if (!feature) return undefined;
    const observer = new IntersectionObserver(([entry]) => { setVideoVisible(entry.isIntersecting); if (!video) return; if (entry.isIntersecting) video.play().catch(() => {}); else video.pause(); }, { threshold: 0.2 });
    observer.observe(feature); return () => { observer.disconnect(); video?.pause(); };
  }, [destination.id, destination.videos.length]);
  const current = chapters[section];
  return <main className={`story destination-story mood-${motion.mood} reveal-${motion.reveal} chapter-${section}`} style={{ '--destination-accent': motion.accent }}><section className="story-chapters" ref={heroRef}><div className="story-chapter-stage"><div className="story-atmosphere" aria-hidden="true" /><div className="story-backdrop">{chapterImages[section] ? <img src={`${A}${chapterImages[section]}`} alt={`${destination.name} chapter ${section + 1}`} key={`${destination.id}-${section}`} /> : <div className="fallback-art">{destination.name.slice(0, 1)}</div>}<span className="story-coordinate">{destination.latitude.toFixed(2)}° {destination.latitude >= 0 ? 'N' : 'S'} / {Math.abs(destination.longitude).toFixed(2)}° {destination.longitude >= 0 ? 'E' : 'W'}</span></div><div className="story-shade" /><div className="story-safe-header"><button className="return-button" onClick={onBack}>← Return to world</button><span>Destination / {destination.region}</span></div><div className={`chapter-copy ${section === 3 ? 'chapter-copy-significance' : ''}`}><div className="chapter-heading-wrap" key={`${destination.id}-${section}-heading`}>  <h2 className="chapter-heading has-particle" aria-label={current.title}><ParticleTitle reducedMotion={reducedMotion}>{current.title}</ParticleTitle></h2></div><div className="chapter-editorial" key={`${destination.id}-${section}-editorial`}><p className="eyebrow">{current.label} <span>·</span> {destination.country}</p><p className="story-body">{current.body}</p>{section === 3 && <p className="story-body story-location">{destination.location}</p>}{section === 3 && <a className="map-link" href={destination.mapUrl} target="_blank" rel="noreferrer">Open coordinates in Google Maps ↗</a>}</div></div><div className="chapter-progress" aria-label={`Story chapter ${section + 1} of ${chapters.length}`}><span>{String(section + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span><div><i style={{ width: `${chapterProgress * 100}%` }} /></div><small>{Math.round(chapterProgress * 100)}%</small></div></div></section><section className="story-media"><div ref={videoFeatureRef} className={`video-feature ${videoVisible ? 'is-visible' : ''}`}>{destination.videos.length > 0 ? <><div className="video-copy"><span>05 / Moving image</span><h3>{destination.name} in motion.</h3><p>A moving fragment of the destination.</p></div><div className="video-frame"><video ref={videoRef} autoPlay muted loop playsInline controls preload="none" poster={destination.heroImage ? `${A}${destination.heroImage}` : undefined}><source src={`${A}${destination.videos[0]}`} type="video/mp4" /></video></div></> : <><div className="video-copy"><span>05 / Photographic motion</span><h3>{destination.name} in still motion.</h3><p>A slow visual study built from this destination’s own image archive.</p></div><div className="video-frame photo-motion-frame"><img src={`${A}${destination.heroImage}`} alt={`${destination.name} photographic motion`} /></div></>}</div><Gallery destination={destination} /><LiveDestinationExperience destination={destination} /></section></main>;
}

function About({ onClose }) { return <div className="about-layer"><button className="about-close" onClick={onClose}>Close <span>×</span></button><div className="about-content"><p className="eyebrow">Voyage / Atlas / About</p><h2>Places are not pins.<br /><i>They are stories.</i></h2><p>Voyage / Atlas is an interactive atlas built from landscapes, local memory, and the feeling of arriving somewhere new. Explore at your own pace, follow a coordinate, and let the image lead.</p><div className="about-rule" /><span>Built as a digital field guide · 2026</span></div></div>; }

function App() {
  const [intro, setIntro] = useState(true); const [earthState, setEarthState] = useState('loading'); const [worldPhase, setWorldPhase] = useState(0); const [scene, setScene] = useState('world'); const [activeId, setActiveId] = useState(null); const [focusedId, setFocusedId] = useState(null); const [explorationActive, setExplorationActive] = useState(true); const [menuOpen, setMenuOpen] = useState(false); const [aboutOpen, setAboutOpen] = useState(false); const [transitioning, setTransitioning] = useState(false); const earthAwakenedRef = useRef(false); const reducedMotion = useReducedMotion(); const activeDestination = destinations.find((item) => item.id === activeId); const focusedDestination = destinations.find((item) => item.id === focusedId);
  useEffect(() => { if (reducedMotion) setIntro(false); }, [reducedMotion]);
  const handleWorldReady = useCallback(() => { setEarthState('ready'); if (earthAwakenedRef.current) return; earthAwakenedRef.current = true; setIntro(false); if (reducedMotion) { setWorldPhase(6); return; } setWorldPhase(1); }, [reducedMotion]);
  const handleWorldError = useCallback(() => { setEarthState('error'); if (earthAwakenedRef.current) return; earthAwakenedRef.current = true; setIntro(false); setWorldPhase(reducedMotion ? 6 : 1); }, [reducedMotion]);
  useEffect(() => { if (earthState !== 'ready' && earthState !== 'error') return undefined; if (worldPhase < 1 || reducedMotion) return undefined; const schedule = [[2, 550], [3, 700], [4, 650], [5, 500], [6, 1200]].find(([phase]) => phase > worldPhase); if (!schedule) return undefined; const timer = window.setTimeout(() => setWorldPhase(schedule[0]), schedule[1]); return () => window.clearTimeout(timer); }, [earthState, worldPhase, reducedMotion]);
  useEffect(() => { const onKey = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.getElementById('atlas-search')?.focus(); } if (event.key === 'Escape') { setMenuOpen(false); setAboutOpen(false); if (scene === 'story') { setScene('world'); setActiveId(null); } } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [scene]);
  const selectDestination = useCallback((id) => { setMenuOpen(false); setAboutOpen(false); setTransitioning(true); setActiveId(id); setFocusedId(null); setScene('story'); window.history.pushState({ destination: id }, '', `#${id}`); }, []);
  const focusDestination = useCallback((id) => { setFocusedId(id); }, []);
  const returnWorld = useCallback(() => { setTransitioning(true); setScene('world'); setActiveId(null); setExplorationActive(true); window.history.pushState({}, '', '#world'); }, []);
  useEffect(() => { const hash = window.location.hash.slice(1); if (destinations.some((d) => d.id === hash)) { setActiveId(hash); setScene('story'); } const onPop = () => { const next = window.location.hash.slice(1); const found = destinations.find((d) => d.id === next); setActiveId(found?.id ?? null); setScene(found ? 'story' : 'world'); }; window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  return <div className={`app world-phase-${scene === 'world' ? worldPhase : 6} world-${earthState} ${worldPhase >= 2 ? 'world-typing' : ''} ${worldPhase === 6 ? 'world-revealed' : ''} ${intro ? 'is-intro' : ''} ${scene === 'story' ? 'is-story' : ''} ${transitioning ? 'is-transitioning' : ''}`}><div className="intro-screen" aria-hidden="true" /><div className="transition-veil" onAnimationEnd={() => setTransitioning(false)} aria-hidden="true"><span /></div><Navigation scene={scene} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onWorld={returnWorld} onAbout={() => setAboutOpen(true)} />{scene === 'world' ? <main className="world"><WorldCanvas activeDestination={activeDestination} onFocus={focusDestination} onSelect={selectDestination} introComplete onReady={handleWorldReady} onError={handleWorldError} explorationActive={explorationActive} focusedId={focusedId} /><WorldOverlay activeDestination={activeDestination} focusedDestination={focusedDestination} onSelect={selectDestination} explorationActive={explorationActive} /></main> : <DestinationStory key={activeId} destination={activeDestination} onBack={returnWorld} />}{menuOpen && <DestinationIndex onSelect={selectDestination} />}{aboutOpen && <About onClose={() => setAboutOpen(false)} />}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
