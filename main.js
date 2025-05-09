let countries = [];

const container = document.getElementById("countries-container");
const searchInput = document.getElementById("search");
const regionSelect = document.getElementById("region-filter");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    countries = data;
    displayCountries(countries);
  });

function displayCountries(data) {
  container.innerHTML = "";
  data.forEach(country => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-lg shadow-md";
    div.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common}" class="w-full h-auto rounded mb-2 "/>
      <h2 class="text-lg font-semibold mb-1">${country.name.common}</h2>
      <p class="text-sm mb-0.5"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p class="text-sm mb-0.5"><strong>Region:</strong> ${country.region}</p>
      <p class="text-sm"><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    `;
    container.appendChild(div);
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(value)
  );
  displayCountries(filtered);
});

// Region filter
regionSelect.addEventListener("change", () => {
  const value = regionSelect.value;
  const filtered = value
    ? countries.filter(c => c.region === value)
    : countries;
  displayCountries(filtered);
});
