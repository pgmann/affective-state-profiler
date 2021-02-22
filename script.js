$(() => {
  // Once the page has loaded, setup modals etc automatically with their default options
  M.AutoInit();

  noUiSlider.create(valence, {
    start: 0,
    step: 1,
    range: {
      'min': -50,
      'max': 50
    },
    tooltips: {
      to: value => value > 0 ? value > 25 ? '&#x1F604;' : '&#x1F642;' : value < 0 ? value < -25 ? '&#x1F62D;' : '&#x1F622;' : '&#x1F610;',
      from: value => Number(value)
    }
  });

  noUiSlider.create(arousal, {
    start: 0,
    step: 1,
    range: {
      'min': -50,
      'max': 50
    },
    tooltips: {
      to: value => value > 0 ? value > 25 ? '&#x1F525;' : '&#x1F9E0;' : value < 0 ? value < -25 ? '&#x1F634;' : '&#x1F62A;' : '&#x1F610;',
      from: value => Number(value)
    }
  });
});

if ('serviceWorker' in navigator) {
  // Register the serviceworker - allows offline access, client-side caching, etc
  // also required by Chrome to allow a PWA to be installed
  navigator.serviceWorker.register('/sw.js').then(() => console.log("Registered sw.js"));

  // Get current serviceworker version
  version.innerText = $.get("/version");
}