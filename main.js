// ==============================
// Dark Mode Toggle
// ==============================
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

function setIcon(isDark) {
  if (isDark) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
}

// Toggle dark mode
themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  setIcon(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// On page load
window.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    setIcon(true);
  } else {
    document.documentElement.classList.remove("dark");
    setIcon(false);
  }
});


// ==============================
// Helper: Fetch All Countries
// ==============================
async function getCountries() {
  const res = await fetch('./data.json');
  if (!res.ok) {
    throw new Error('Failed to fetch local data.json');
  }
  return await res.json();
}

// ==============================
// Home Page Logic
// ==============================
const countriesContainer = document.getElementById("countries-container");
const searchInput = document.getElementById("search-input");
const regionFilter = document.getElementById("region-filter");

if (countriesContainer) {
  let countriesData = [];

  // Display country cards
  function displayCountries(data) {
    countriesContainer.innerHTML = "";
    data.forEach((country) => {
      const card = document.createElement("div");
      card.className =
        "bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden cursor-pointer transition hover:scale-[1.02]";
      card.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common}" class="w-full h-48 object-cover">
        <div class="p-5 space-y-2">
          <h2 class="font-bold text-lg">${country.name}</h2>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Capital:</strong> ${country.capital}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("selectedCountry", JSON.stringify(country));
        window.location.href = "countries.html";
      });

      countriesContainer.appendChild(card);
    });
  }

  // Filter function
  function filterCountries() {
    const query = searchInput.value.toLowerCase();
    const region = regionFilter.value;
    const filtered = countriesData.filter((country) => {
      const nameMatch = country.name.common.toLowerCase().includes(query);
      const regionMatch = region === "" || country.region === region;
      return nameMatch && regionMatch;
    });
    displayCountries(filtered);
  }

  // Load countries
  getCountries().then((data) => {
    countriesData = data;
    displayCountries(data);
  });

  // Event listeners
  searchInput.addEventListener("input", filterCountries);
  regionFilter.addEventListener("change", filterCountries);
}

// ==============================
//  Details Page Logic
// ==============================
const detailContainer = document.getElementById("country-detail");

if (detailContainer) {
  const country = JSON.parse(localStorage.getItem("selectedCountry"));

  if (!country) {
    detailContainer.innerHTML = "<p class='text-center text-red-500'>No country selected.</p>";
  } else {
    detailContainer.innerHTML = `
      <button onclick="window.history.back()" class="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded shadow">
        ← Back
      </button>
      <div class="grid md:grid-cols-2 gap-10">
        <img src="${country.flags.png}" alt="${country.name.common}" class="w-full h-auto">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">${country.name}</h2>
          <p><strong>Official Name:</strong> ${country.name.official}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
          <p><strong>Capital:</strong> ${country.capital}</p>
          <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
          <p><strong>Currencies:</strong> ${
            country.currencies
              ? Object.values(country.currencies)
                  .map((cur) => `${cur.name} (${cur.symbol})`)
                  .join(", ")
              : "N/A"
          }</p>
        </div>
      </div>
    `;
  }
}
