const state = {
  playerGold: 1200,
  playerArmy: 230,
  influence: 66,
  turn: 1,
  selectedCountryId: null,
  countryStats: {},
  log: ["World map initialized."]
};

const ui = {
  turn: document.getElementById("turn-value"),
  gold: document.getElementById("gold-value"),
  army: document.getElementById("army-value"),
  influence: document.getElementById("influence-value"),
  countryName: document.getElementById("country-name"),
  countryRegion: document.getElementById("country-region"),
  countryArmy: document.getElementById("country-army"),
  countryEconomy: document.getElementById("country-economy"),
  countryStability: document.getElementById("country-stability"),
  logList: document.getElementById("log-list"),
  deployBtn: document.getElementById("deploy-btn"),
  nextTurnBtn: document.getElementById("next-turn-btn")
};

async function initMap() {
  const myWorldMap = await svgWorldMap({
    libPath: "../src/",
    bigMap: false,
    showInfoBox: true,
    groupCountries: true,
    mapClick: "gameMapClick",
    mapOver: "gameMapOver",
    mapOut: "gameMapOut",
    backgroundImage: ""
  });

  window.myWorldMap = myWorldMap;
  buildCountryStats();
  renderWorldState();
  selectCountry("US");
}

function buildCountryStats() {
  const map = window.myWorldMap.countryData || {};

  for (const [countryId, countryInfo] of Object.entries(map)) {
    const seed = countryId.split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    state.countryStats[countryId] = {
      id: countryId,
      name: countryInfo.name || countryId,
      region: countryInfo.region || "Unknown",
      army: 20 + (seed % 140),
      economy: 18 + (seed % 100),
      stability: 30 + (seed % 70),
      playerOwned: countryId === "US" || countryId === "CA" || countryId === "GB"
    };
  }
}

function renderWorldState() {
  ui.turn.textContent = String(state.turn);
  ui.gold.textContent = String(state.playerGold);
  ui.army.textContent = String(state.playerArmy);
  ui.influence.textContent = String(state.influence);
  renderLog();
}

function renderCountryInfo(countryId) {
  const country = state.countryStats[countryId];
  if (!country) {
    return;
  }

  ui.countryName.textContent = country.name;
  ui.countryRegion.textContent = country.region;
  ui.countryArmy.textContent = String(country.army);
  ui.countryEconomy.textContent = String(country.economy);
  ui.countryStability.textContent = String(country.stability);
}

function selectCountry(countryId) {
  state.selectedCountryId = countryId;
  if (window.myWorldMap && window.myWorldMap.click) {
    window.myWorldMap.click(countryId);
  }
  renderCountryInfo(countryId);
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
  renderLog();
}

function renderLog() {
  ui.logList.innerHTML = "";
  state.log.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ui.logList.appendChild(li);
  });
}

window.gameMapClick = function (country) {
  const countryId = country && country.id ? country.id : country;
  if (!countryId || !state.countryStats[countryId]) {
    return;
  }

  state.selectedCountryId = countryId;
  renderCountryInfo(countryId);
  addLog(`${state.countryStats[countryId].name} selected.`);
};

window.gameMapOver = function (country) {
  const countryId = country && country.id ? country.id : country;
  const info = state.countryStats[countryId];
  if (!info) {
    return;
  }

  const div = document.getElementById("map-infobox");
  if (div) {
    div.innerHTML = `<strong>${info.name}</strong><br/>${info.region}`;
  }
};

window.gameMapOut = function () {
  const div = document.getElementById("map-infobox");
  if (div) {
    div.innerHTML = "";
  }
};

function deployTroops() {
  if (!state.selectedCountryId) {
    addLog("Select a country before deploying troops.");
    return;
  }

  const country = state.countryStats[state.selectedCountryId];
  if (!country) {
    return;
  }

  country.army += 25;
  state.playerArmy += 25;
  state.playerGold = Math.max(0, state.playerGold - 150);
  renderWorldState();
  renderCountryInfo(state.selectedCountryId);
  addLog(`Deployment complete in ${country.name}.`);
}

function nextTurn() {
  state.turn += 1;

  Object.values(state.countryStats).forEach((country) => {
    if (country.playerOwned) {
      country.economy += 6;
      country.army += 3;
      state.playerGold += 40 + Math.round(country.economy / 6);
      state.influence = Math.min(100, state.influence + 3);
    } else {
      country.stability = Math.max(10, country.stability - 2);
    }
  });

  state.playerArmy += 10;
  renderWorldState();
  if (state.selectedCountryId) {
    renderCountryInfo(state.selectedCountryId);
  }
  addLog(`Turn ${state.turn} begins. Frontline updated.`);
}

ui.deployBtn.addEventListener("click", deployTroops);
ui.nextTurnBtn.addEventListener("click", nextTurn);

initMap();
