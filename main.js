let countries = [];

const themeToggle = document.getElementById('theme-toggle')
const container = document.getElementById("countries-container");
const searchInput = document.getElementById("search-input"); 
const regionSelect = document.getElementById("region-filter");

searchInput.addEventListener("input", filterAndDisplay);
regionSelect.addEventListener("change", filterAndDisplay);

  

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle("dark");

   // Toggle the theme icon (moon/sun)
  const icon = themeToggle.querySelector("i");
    if (document.documentElement.classList.contains("dark")) {
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");
    }
});

// On load, apply saved theme
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
        const icon = themeToggle.querySelector("i");
        icon.classList.replace("fa-moon", "fa-sun");
    }
})

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    console.log("Fetched data:", data); // Add this line
    countries = data;
    displayCountries(countries);
  });

function displayCountries(data) {
  container.innerHTML = "";
  data.forEach(country => {
    const div = document.createElement("div");
    div.className = "bg-white pb-12 rounded-lg shadow-md dark:bg-gray-800";
    div.innerHTML = `
      <div class="h-48 bg-cover bg-center rounded-t-lg mb-2" style="background-image: url('${country.flags.svg}');"></div>
      <h2 class="text-lg font-semibold mb-1 px-4">${country.name}</h2>
      <p class="text-sm mb-0.5 px-4 pt-2">Population: ${country.population.toLocaleString()}</p>
      <p class="text-sm mb-0.5 px-4 pt-2">Region: ${country.region}</p>
      <p class="text-sm px-4 pt-2">Capital: ${country.capital ? country.capital : "N/A"}</p>
    `;
    container.appendChild(div);
  });
}

function filterAndDisplay(){
    const searchValue = searchInput.value.toLowerCase();
    const regionValue = regionSelect.value;
  
    const filtered = countries.filter(c => {
      const matchesName = c.name.common.toLowerCase().includes(searchValue);
      const matchesRegion = regionValue ? c.region === regionValue : true;
      return matchesName && matchesRegion;
    });
  
    displayCountries(filtered);
}
