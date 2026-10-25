const weatherForm = document.getElementById("weather-form");
const stateInput = document.getElementById("state-input");
const errorMessage = document.getElementById("error-message");
const alertsDisplay = document.getElementById("alerts-display");

if (weatherForm) {
  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const state = stateInput ? stateInput.value.trim().toUpperCase() : "";

    if (!state || state.length !== 2) {
      displayError({ message: "Please enter a valid two-letter state abbreviation." });
      return;
    }

    fetchWeatherAlerts(state);
  });
}

function fetchWeatherAlerts(state) {
  clearUI();

  return fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch weather alerts. Please try again.");
      }
      return response.json();
    })
    .then((data) => {
      displayAlerts(data, state);
      return data;
    })
    .catch((errorObject) => {
      console.log(errorObject.message);
      displayError(errorObject);
    });
}

function displayAlerts(data, state) {
  clearUI();

  const alertCount = data && data.features ? data.features.length : 0;
  
  if (alertsDisplay) {
    alertsDisplay.textContent = `Weather Alerts: ${alertCount}`;

    if (data && Array.isArray(data.features)) {
      data.features.forEach((feature) => {
        const headlineText = feature.properties ? feature.properties.headline : "";
        if (headlineText) {
          const p = document.createElement("p");
          p.textContent = headlineText;
          alertsDisplay.appendChild(p);
        }
      });
    }
  }

  if (stateInput) {
    stateInput.value = "";
  }
}

function clearUI() {
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
  }
  if (alertsDisplay) {
    alertsDisplay.innerHTML = "";
  }
}

function displayError(errorObject) {
  if (errorMessage) {
    errorMessage.textContent = errorObject.message || "An unexpected error occurred.";
    errorMessage.classList.remove("hidden");
  }
}