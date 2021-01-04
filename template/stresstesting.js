const StressTestingData = [];

for (let row = 0; row < 1000000; row++) {
  const items = [];
  for (let col = 0; col < 25; col++) {
    items.push('111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
  }
  StressTestingData.push(items);
}

window.StressTestingData = StressTestingData;
