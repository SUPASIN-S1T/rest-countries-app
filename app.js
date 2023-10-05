const sectionContainer = document.querySelector(".country-container");
const modalContainer = document.querySelector(".modal-container");
const searchContainer = document.querySelector(".search-container");
const inputItem = document.querySelector("#input-search");
const selectItem = document.querySelector("#filter-region");
const btnToggleTheme = document.querySelector(".btn-toggle");
const headerContainer = document.querySelector(".header-container");
const inputSearchItem = document.querySelector(".input-search-style");
const selectSearchItem = document.querySelector(".filter-search select");
const countryItem = document.querySelectorAll(".countries-item");
let allCountries = [];

window.addEventListener("DOMContentLoaded", () => {
  fetchCountries();
});

// toggle theme
const darkModeTheme = () => {
  const getBody = document.querySelector("body");
  getBody.classList.toggle("dark-mode");

  if (getBody.classList.contains("dark-mode")) {
    btnToggleTheme.innerHTML = `<i class="fa-regular fa-lightbulb"></i> Light Mode`;
    headerContainer.classList.add("shadow");
    inputSearchItem.classList.add("shadow");
    selectSearchItem.classList.add("shadow");
  } else {
    btnToggleTheme.innerHTML = `<i class="fa-regular fa-moon"></i> Dark Mode`;
  }
};
btnToggleTheme.addEventListener("click", darkModeTheme);

// fetch data from api
const fetchCountries = async (value = "all") => {
  sectionContainer.innerHTML = "<h1>Loading...</h1>";
  try {
    const response = await fetch(`https://restcountries.com/v3.1/${value}`);
    const data = await response.json();

    if (!response.ok) {
      return (sectionContainer.innerHTML =
        "<h1>The information you were looking for was not found.</h1>");
    }
    allCountries = data;
    displayCountries(data);
  } catch (err) {
    console.error("error : " + err);
  }
};

// show or display data from fetch api
const displayCountries = (data) => {
  const displayed = data
    .map((countries, index) => {
      const {
        name: { common },
        flags: { png, alt },
        population,
        capital,
        region,
      } = countries;

      return `
    <article class="countries-item" data-id=${index} onclick="openModal(${index})">
      <div class="countries-image">
        <img src=${png} alt=${alt !== undefined ? alt : region} />
      </div>
        <div class="countries-detail">
            <h1>${common}</h1>
                <ul>
                    <li>Population : ${population.toLocaleString("en-US")}</li>
                    <li>Region : ${region !== undefined ? region : "none"}</li>
                    <li>Capital : ${
                      capital !== undefined ? capital : "none"
                    }</li>
                </ul>
        </div>
    </article>`;
    })
    .join("");
  sectionContainer.innerHTML = displayed;
};

// input search region
const inputSearch = (e) => {
  const inputValues = e.target.value;
  if (inputValues.trim() !== "") {
    fetchCountries(`name/${inputValues}`);
  } else {
    fetchCountries("all");
  }
};
inputItem.addEventListener("keyup", inputSearch);

// select or filter search region
const selectSearch = (e) => {
  const newValues = e.target.value;
  if (newValues !== "All") {
    fetchCountries(`region/${newValues}`);
  } else {
    fetchCountries("all");
  }
};
selectItem.addEventListener("change", selectSearch);

// open modal when user click card region
const openModal = (element) => {
  sectionContainer.classList.add("hidden");
  searchContainer.classList.add("hidden");
  const countryData = allCountries[element];
  modalContainer.classList.add("modal-active");
  modalContainer.innerHTML = displayModal(countryData);
};

// display card modal
const displayModal = (data) => {
  const nativeName = Object.values(data.name.nativeName)
    .map((nameNative) => {
      return nameNative.common;
    })
    .join(",");

  const currencies = Object.values(data.currencies)
    .map((currency) => {
      return currency.name;
    })
    .join(",");

  const languages = Object.values(data.languages).join(",");
  const {
    name: { common },
    flags: { png, alt },
    population,
    capital,
    region,
    subregion,
    tld,
    borders,
  } = data;

  const displayBorders = () => {
    if (borders !== undefined && borders.length > 0) {
      return borders
        .map((border) => {
          return `<li>${border}</li>`;
        })
        .join("");
    } else {
      return `<li>NONE</li>`;
    }
  };
  const displayed = `
        <button class="btn-close" onclick="closeModal(this)"><i class="fa-solid fa-arrow-left"></i> Back</button>
        <article class="modal-item"> 
          <div class="modal-image">
            <img src="${png}" alt=${alt}>
          </div>
          <div class="modal-detail">
            <div class="modal-title">
              <h1>${common}</h1>
            </div>
            <div class="modal-sub-title">
              <div class="modal-sub-col-1">
                <ul>
                <li><span>Native Name :</span> ${nativeName}</li>
                <li><span>Population :</span> ${population.toLocaleString(
                  "en-US"
                )}</li>
                <li><span>Region :</span> ${region}</li>
                <li><span>Sub Region :</span> ${subregion}</li>
                <li><span>Capital :</span> ${capital}</li>
                </u>
              </div>
              <div class="modal-sub-col-2">
                <ul>
                <li><span>Top Level Domain :</span> ${tld}</li>
                <li><span>Currencies :</span>${currencies}</li>
                <li><span>Languages :</span>${languages}</li>
                </u>
              </div>
            </div>
            <div class="modal-footer">
            <h4>Border Countries :</h4>
               <ul>
               ${displayBorders()}
              </ul>
            </div>
          </div>
        </article>`;
  return displayed;
};

// close modal when user click button
const closeModal = (element) => {
  const parentElement = element.parentNode;
  parentElement.classList.remove("modal-active");
  sectionContainer.classList.remove("hidden");
  searchContainer.classList.remove("hidden");
};
