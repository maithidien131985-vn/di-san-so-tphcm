import('../src/data/allMonumentsData.js').then(({ allMonumentsList }) => {
  [1, 2, 3, 4, 10, 50, 100].forEach(stt => {
    const m = allMonumentsList.find(x => x.stt === stt);
    console.log(`[#${stt}] ${m.info.name}`);
    console.log(`  GPS: ${m.info.lat}, ${m.info.lng}`);
    console.log(`  Directions: ${m.info.googleMapsDirectionsUrl}`);
  });
});
