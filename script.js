// wait for page to finish loading
$(() => {
  // setup modals
  M.Modal.init(record, {
    onOpenEnd: () => {
      // focus first input
      eventName.focus();
    },
    onCloseEnd: () => {
      // reset form contents for next open
      eventName.value = "";
      eventName.classList.remove("valid", "invalid"); // reset validation colour
      valence.noUiSlider.reset();
      arousal.noUiSlider.reset();
      details.value = "";
    }
  });

  M.Modal.init(summary, {
    onOpenStart: () => {
      // load stats
      var events = getAllEvents();
      var avgValence = 0, avgArousal = 0, totalEvents = events.length;
      for (let event of events) {
        avgValence += event.valence;
        avgArousal += event.arousal;
        let row = summaryHistory.insertRow();
        let date = new Date(event.time);
        row.insertCell().innerText = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        row.insertCell().innerText = event.name;
        row.insertCell().innerText = capitalise(categoriseAffectiveState(event.valence, event.arousal));
        row.insertCell().innerText = event.valence;
        row.insertCell().innerText = event.arousal;
        row.insertCell().innerText = event.details;
      }
      avgValence /= totalEvents;
      avgArousal /= totalEvents;
      summaryEventsTotal.innerText = totalEvents + " event" + (totalEvents == 1 ? "" : "s");
      summaryValenceAvg.innerText = avgValence;
      summaryArousalAvg.innerText = avgArousal;
      summaryAffectiveStateAvg.innerText = categoriseAffectiveState(avgValence, avgArousal);
    },
    onCloseEnd: () => {
      for (let tr of document.querySelectorAll("#summaryHistory tr:not(:first-child)")) {
        tr.remove();
      }
    }
  });

  // set up sliders - the tooltips contain emoji to represent each affective state
  noUiSlider.create(valence, {
    start: 0,
    step: 1,
    range: {
      'min': -50,
      'max': 50
    },
    tooltips: {
      to: value => categoriseValence(value),
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
      to: value => categoriseArousal(value),
      from: value => Number(value)
    }
  });

  // Show current serviceworker version in footer
  $.get("/version", data => version.innerText = data);

  // setup action handlers
  recordSubmit.addEventListener('click', event => {
    if (!eventName.value) {
      // eventName is required and cannot be blank
      eventName.focus();
      return;
    }

    // Affective State Events will be stored as part of an array in localStorage
    var events = getAllEvents();
    events.push({
      time: getTime(),
      name: eventName.value,
      valence: Number(valence.noUiSlider.get()),
      arousal: Number(arousal.noUiSlider.get()),
      details: details.value
    });
    localStorage.setItem("stateEvents", JSON.stringify(events));

    // A toast notification is shown to confirm data was saved successfully and modal is closed
    M.toast({html: '<i class="fas fa-check-circle"></i>&nbsp;Event Recorded'});
    record.M_Modal.close();
  });
});

function getAllEvents() {
  return JSON.parse(localStorage.getItem("stateEvents")) || [];
}

function categoriseValence(value) {
  if (value < -25) return '&#x1F62D;'; // sobbing
  if (value < 0)   return '&#x1F622;'; // crying
  if (value == 0)  return '&#x1F610;'; // neutral
  if (value > 25)  return '&#x1F604;'; // laughing
  if (value > 0)   return '&#x1F642;'; // smiling
}

function categoriseArousal(value) {  
  if (value < -25) return '&#x1F634;'; // sleeping zzz's
  if (value < 0)   return '&#x1F62A;'; // sleepy
  if (value == 0)  return '&#x1F610;'; // neutral
  if (value > 25)  return '&#x1F525;'; // fire
  if (value > 0)   return '&#x1F9E0;'; // brain
}

function categoriseAffectiveState(valence, arousal) {
  if (valence == 0 && arousal == 0) return 'neutral';
  var ratio = Math.abs(arousal == 0 ? valence : valence/arousal);
  var slight = (valence < 20 && valence > -20) || (arousal < 20 && arousal > -20);
  var strong = valence >= 35 || valence <= -35 || arousal >= 35 || arousal <= -35;
  var prefix = strong ? 'very ' : slight ? 'somewhat ' : '';

  if (valence > 0) {
    if (arousal > 0) {
      // determine whether arousal (low ratio) or valence (high ratio) is stronger
      if (ratio < 0.5) return prefix + 'alert';
      if (ratio < 0) return prefix + 'excited';
      if (ratio < 2) return prefix + 'elated';
      return prefix + 'happy';
    } else {
      if (ratio < 0.5) return prefix + 'calm';
      if (ratio < 0) return prefix + 'relaxed';
      if (ratio < 2) return prefix + 'serene';
      return prefix + 'contented';
    }
  } else {
    if (arousal > 0) {
      if (ratio < 0.5) return prefix + 'tense';
      if (ratio < 0) return prefix + 'nervous';
      if (ratio < 2) return prefix + 'stressed';
      return prefix + 'upset';
    } else {
      if (ratio < 0.5) return prefix + 'bored';
      if (ratio < 2) return prefix + 'depressed';
      return prefix + 'sad';
    }
  }
}

function capitalise(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

if ('serviceWorker' in navigator) {
  // Register the serviceworker - allows offline access, client-side caching, etc
  // also required by Chrome to allow a PWA to be installed
  navigator.serviceWorker.register('/sw.js').then(() => console.log("Registered sw.js"));
}