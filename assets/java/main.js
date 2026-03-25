const collections = "assets/data/collection.json";
let collectionData = [];

function loadcollection() {
  $.ajax({
    url: collections,
    method: "get",
    dataType: "json",
    success: function (data) {
        collectionData = data;
        applyFilters();
    },
    error: function () {
      console.error("Greška pri učitavanju kolekcije.");
    }
  });
}

function getEraValue(period) {
  const text = period.toLowerCase();
  if (text.includes("prvi")) return "ww1";
  if (text.includes("drugi")) return "ww2";
  if (text.includes("hladan") || text.includes("hladan rat")) return "coldwar";
  return "other";
}

function getCountryMatch(item, filter) {
  if (filter === "all") return true;
  const countryText = (item.korisceno + " " + item.proizvodnja).toLowerCase();
  const map = {
    germany: "nemačka",
    ussr: "sovjetski",
    usa: "amerika",
    uk: "britanija",
    france: "francuska",
    hungary: "mađarska",
    yugoslavia: "jugoslavija",
    east_germany: "istočna nemačka",
    cechoslovakia: "čehoslovačka",
    poland: "poljska"
  };
  return map[filter] ? countryText.includes(map[filter]) : false;
}

function filterCollection() {
  const searchValue = $("#search").val() ? $("#search").val().toLowerCase() : "";
  const eraValue = $("#era").val();
  const countryValue = $("#country").val();

  return collectionData.filter(item => {
    const normalized = [item.ime, item.korisceno, item.proizvodnja, item.period, item.proizvodjac, item.top].join(" ").toLowerCase();

    const matchSearch = !searchValue || normalized.includes(searchValue);
    const matchEra = eraValue === "all" || getEraValue(item.period) === eraValue;
    const matchCountry = getCountryMatch(item, countryValue);

    return matchSearch && matchEra && matchCountry;
  });
}

function applyFilters() {
  const filtered = filterCollection();
  rendercollection(filtered);
}

if (window.location.pathname.includes("Kolekcija.html")) 
    {
        document.body.style.backgroundColor = "rgb(42, 59, 35)";
    }

    let html=``;

    html += `<div class="tank_search">
        <b>Pretraživač</b>
            <input type="text" id="search" placeholder="Pretraži...">
            </div>

    <div class="tank_filters">
        <b>Filteri</b>
            <select id="era">
                <option value="all">Period</option>
                <option value="ww1">Prvi Svetski rat</option>
                <option value="ww2">Drugi Svetski rat</option>
                <option value="coldwar">Hladan rat</option>
            </select>
    
    
            <select id="country">
                <option value="all">Država</option>
                <option value="germany">Nemačka</option>
                <option value="ussr">Sovjetski Savez</option>
                <option value="usa">Amerika</option>
                <option value="uk">Britanija</option>
                <option value="france">Francuska</option>
                <option value="hungary">Mađarska</option>
                <option value="yugoslavia">Jugoslavija</option>
                <option value="east_germany">Istočna Nemačka</option>
                <option value="cechoslovakia">Čehoslovačka</option>
                <option value="poland">Poljska</option>
            </select>
    </div>`;
    $("#filters").html(html);


function rendercollection(collection) {
  let html = ``;
  collection.forEach((item, index) => {
    let modelClass = index % 2 === 0 ? "model1" : "model2";
    let naslovClass = index % 2 === 0 ? "naslov1" : "naslov2";
    let opisClass = index % 2 === 0 ? "opistenka1" : "opistenka2";
    let delay = (index * 0.08).toFixed(2);

    html += `<div class="${modelClass} kolekcija-item" style="animation-delay: ${delay}s">
            <div class="slikatenk">
                <img src="${item.slika}" alt="${item.ime}">
            </div>
            <div class="${naslovClass}">
                <h1>${item.ime}</h1> <br>
                <div class="${opisClass}">
                    <div class="info">
                        <p>Korišćena od strane: ${item.korisceno}</p> <br>
                        <p>Proizvedeno od strane: ${item.proizvodnja}</p> <br>
                        <p>Period: ${item.period}</p>
                    </div>
                    <div class="info">
                        <p>Broj proizvedenih: ${item["broj proizvoda"]}</p> <br>
                        <p>Početak i kraj proizvodnje: ${item["pocetak i kraj"]}</p> <br>
                        <p>Proizvođač: ${item.proizvodjac}</p>
                    </div>
                    <div class="info">
                        <p>Težina: ${item.tezina}</p> <br>
                        <p>Maksimalna brzina: ${item["maximalna brzina"]}</p> <br>
                        <p>Glavni top: ${item.top}</p>
                    </div>
                </div>
            </div>
        </div>`;
  });
  $("#collectionContainer").html(html);
}

$(document).ready(function() {
    loadcollection();

    $(document).on("input change", "#search, #era, #country", function() {
      applyFilters();
    });
});

function toggleMenu() {
    let podela = document.querySelector(".podela");

    if (window.innerWidth <= 768) {
        
        if (window.getComputedStyle(podela).display === "none") {
            podela.style.display = "flex";
            podela.style.maxHeight = "0px";
            podela.style.opacity = "0";
            podela.style.transition = "all 0.5s ease-in-out";

            podela.offsetHeight;

            podela.style.maxHeight = "500px"; 
            podela.style.opacity = "1";
        } else {
            podela.style.maxHeight = "0px";
            podela.style.opacity = "0";
            
            setTimeout(() => {
                if (window.innerWidth <= 768) {
                    podela.style.display = "none";
                }
            }, 500);
        }
    }
}

window.addEventListener('resize', function() {
    let podela = document.querySelector(".podela");
    if (window.innerWidth > 768) {
        podela.style.display = "";
        podela.style.maxHeight = "";
        podela.style.opacity = "";
        podela.style.transition = "";
    }
});

document.querySelector('.slika i').addEventListener('click', toggleMenu);

$(document).ready(function() {
    function resetErrors() {
        $('.error-message').remove();
        $('input, select, textarea').removeClass('error');
    }

    function validateField(selector) {
        const field = $(selector);
        const value = field.val().trim();
        let ok = true;

        if (field.is('#ime')) {
            if (!value) { showError(selector, 'Ime je obavezno.'); ok = false; }
            else if (value.length < 2) { showError(selector, 'Ime mora imati najmanje 2 karaktera.'); ok = false; }
        }

        if (field.is('#prezime')) {
            if (!value) { showError(selector, 'Prezime je obavezno.'); ok = false; }
            else if (value.length < 2) { showError(selector, 'Prezime mora imati najmanje 2 karaktera.'); ok = false; }
        }

        if (field.is('#email')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) { showError(selector, 'Email je obavezan.'); ok = false; }
            else if (!emailRegex.test(value)) { showError(selector, 'Unesite validan email.'); ok = false; }
        }

        if (field.is('#telefon')) {
            const telefonRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{3}$/;
            if (!value) { showError(selector, 'Telefon je obavezan.'); ok = false; }
            else if (!telefonRegex.test(value)) { showError(selector, 'Format mora biti 123-456-789.'); ok = false; }
        }

        return ok;
    }

    $('#ime, #prezime, #email, #telefon').on('blur', function() {
        $(this).next('.error-message').remove();
        $(this).removeClass('error');
        validateField(this);
    });

    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        resetErrors();

        const validIme = validateField('#ime');
        const validPrezime = validateField('#prezime');
        const validEmail = validateField('#email');
        const validTelefon = validateField('#telefon');

        if (validIme && validPrezime && validEmail && validTelefon) {
            showNotification('Poruka je uspešno poslata!', 'success');
            $('#contactForm')[0].reset();
        }
    });
});

function showError(selector, message) {
    $(selector).addClass('error');
    $(selector).after('<div class="error-message">' + message + '</div>');
}

function showNotification(message, type) {
    let notification = $('#notification');
    notification.removeClass('success error').addClass(type).text(message).fadeIn();
    setTimeout(function() {
        notification.fadeOut();
    }, 3000);
}

