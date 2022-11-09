// Elise VERHOEST-PIROUELLE AP4
// webservice météo : http://api.openweathermap.org/data/2.5/weather?lat=xxxxxx&lon=xxx&appid=${apikey}`
// api key : 82005d27a116c2880c8f0fcb866998a0

const mes = document.querySelector(".message");
const input = document.querySelector("#capital"); // on récupère le champ qui prendra en entrée la valeur
const send = document.querySelector("#soumission");
const apikey = "82005d27a116c2880c8f0fcb866998a0";
const tempValue = document.querySelector(".temperature-value");
const tempDesc = document.querySelector(".temperature-description");
const localisation = document.querySelector(".location");
const icon = document.querySelector(".weather-icon");

document.getElementById("gif").style.display = "none"; // empêche loader.gif de s'afficher en continue

// Récupération des données du fichier json
async function cap() {
  const response = await fetch("country-capitals.json");
  const capital = await response.json();

  send.addEventListener("click", (event) => {
    // cas d'erreur de soummission à vide
    if (input.value === "") {
      mes.innerHTML = "<p>Erreur : le champ est obligatoire</p>";
      input.style.borderColor = "red"; // La bordure apparaît lorsque l'on clique sur l'écran
      send.setAttribute("disabled", "");
      input.focus();
    } else {
      // cas lorsque la soummission est correcte
      let find = false;
      for (var current of capital) {
        if (input.value.toLowerCase() === current.CapitalName.toLowerCase()) {
          find = true;
          document.getElementById("gif").style.display = "block"; // Affichage loader.gif
          input.value = ""; // champ à .weaavide
          send.setAttribute("disabled", ""); // désactivation du bouton "Envoyer"

          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${current.CapitalLatitude}&lon=${current.CapitalLongitude}&appid=${apikey}`
          )
            .then(function (weather) {
              return weather.json();
            })
            .then(function (resultJson) {
              document.getElementById("gif").style.display = "none"; // Puisque nous avons trouvé nos infos, nous ne l'affichons plus
              // Affichage de la valeur de la température
              let tempC = Math.round(resultJson.main.temp - 273.15);
              tempValue.innerHTML = `<p><span id="temp">${tempC} </span>°<span id="unity">C</span></p>`;

              // Affichage de la description de la température
              tempDesc.innerHTML = `<p>${resultJson.weather[0].description}</p>`;

              // Affichage icone
              icon.innerHTML = `<img src="/icons/${resultJson.weather[0].icon}.png" alt="" />`;

              // Question 7 : switcher C° F°
              const unity = document.querySelector("#unity");
              const temp = document.querySelector("#temp");
              let celsius = true;
              unity.addEventListener("click", (event) => {
                if (celsius) {
                  temp.textContent = Math.round(tempC * 1.8 + 32);
                  unity.textContent = "F";
                  celsius = false;
                } else {
                  temp.textContent = Math.round((temp.textContent - 32) / 1.8);
                  unity.textContent = "C";
                  celsius = true;
                }
              });
            });

          // Afficher le nom de la ville
          localisation.innerHTML = `<p>${current.CapitalName}</p>`;
        }
      }

      if (!find) {
        // si find = false
        mes.innerHTML = "<p>Erreur : résultat introuvable</p>";
        input.style.borderColor = "red";
        send.setAttribute("disabled", "");
        input.focus();
        input.value = ""; // Réinitialise le champ
      }
    }
  });

  // question 6 : dès que l'utilisateur saisie à nouveau dans le champ
  input.addEventListener("beforeinput", (event) => {
    send.removeAttribute("disabled");
    mes.innerHTML = "";
    input.style.borderColor = "";
  });
}

cap();
