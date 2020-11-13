var apiKey = "94157f8fc0fe1b469ba572c42422ffcf";
var city = "Sochi";
var lat = "lat=";
var lon = "lon=";

var drawedCards = [];

async function setDataHead(url) {
    let big_card_city = document.getElementById(
        'big-card-city');
    let big_card_params = document.getElementById(
        'big-card-params');
    let loadInform = document.getElementById(
        'loadInfrorm');
    big_card_city.style.display = 'none';
    big_card_params.style.display = 'none';
    loadInform.style.display = 'block';
    
    let json = await fetch(url).then(res => res.ok ? res : Promise.reject(res))
.then(function (resp) {
            return resp.json()
        })
        .catch(function () {
            alert("Ошибка при выполнении запроса! Попробуйте обновить страницу");
        });
    
    let city_name = json.name;
    let city_temp = Math.round(json.main.temp);

    let iconcode = json.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    console.log(iconurl);
    document.getElementById('big-icon-weather').src = iconurl;
    document.getElementById('big-icon-weather').style.display = "block";

    let coord_lat = json.coord.lat;
    let coord_lon = json.coord.lon;
    let coords = "[" + coord_lat.toString() + ", " +
        coord_lon.toString() + "]";
    let wind = json.wind.speed;
    let clouds = json.clouds.all;
    let pressure = json.main.pressure;
    let humidity = json.main.humidity;

    document.getElementById('big-wind').innerHTML = wind.toString() + " m/s";
    document.getElementById('big-clouds').innerHTML = clouds.toString() + "%";
    document.getElementById('big-pressure').innerHTML = pressure.toString() + " hpa";
    document.getElementById('big-humidity').innerHTML = humidity.toString() + "%";
    document.getElementById('big-coords').innerHTML = coords;

    loadInform.style.display = 'none';

    big_card_params.style.display = 'block';

    document.getElementById('big-name').innerHTML = city_name.toString();
    document.getElementById('big-name').style.display = "block";
    document.getElementById('big-temp').innerHTML = city_temp.toString() + "°C";
    document.getElementById('big-temp').style.display = "block";
    big_card_city.style.display = 'block';
}

async function success(position) {
    console.log("Доступ разрешён.");

    var latitude = position.coords.latitude.toString();
    var longitude = position.coords.longitude.toString();
    var url = "http://api.openweathermap.org/data/2.5/weather?" + lat + latitude + "&" + lon + longitude + "&appid=" + apiKey + "&units=metric";

    setDataHead(url);
    
    checkLocalStorage();
};

async function error(err) {
    if (err.PERMISSION_DENIED) {
        console.log("В доступе отказано!");

        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
        
        setDataHead(url);
        checkLocalStorage();
    }
};

function checkLocalStorage() {
    if (localStorage.getItem("cities") !== null) {
        var cards = JSON.parse(localStorage["cities"]);
        console.log(drawedCards);
        let diff = [];
        for (let i = 0; i < cards.length; ++i) {
            var flag = true;
            for (let j = 0; j < drawedCards.length; ++j) {
                if (cards[i]["0"] == drawedCards[j]["0"]) {
                    flag = false;
                    break;
                }
            }
            if (flag === true) {
                diff.push(cards[i]);
            }
        }
        console.log(diff);
        diff.forEach(data => addCard(data));
        console.log(diff);
        drawedCards = drawedCards.concat(diff);
        console.log(drawedCards);
    }
}


navigator.geolocation.getCurrentPosition(success, error);

function addCard(city) {
    let t = document.createElement("template");
    t = new_card.content.cloneNode(true);
    var td = t.querySelector("#city-name");
    td.textContent = city["1"];
    var idCard = city["0"];
    var idt = t.querySelector("#card");
    idt.id = idCard.toString();
    const idd = t.querySelector("#delete");
    idd.id += idCard.toString();
    var tb = document.getElementById("list-cards");
    var clone = document.importNode(t, true);
    tb.prepend(clone);
    setDataCard(city);
}

function clickAdd() {
    var city = [Date.now(), document.getElementById("add-city-name").value];
    addCard(city);
    var cards = [];
    if (localStorage.getItem("cities") !== null) {
        cards = JSON.parse(localStorage["cities"]);
    }
    cards.push(city);
    drawedCards.push(city);
    localStorage.setItem("cities", JSON.stringify(drawedCards));
}

function deleteItem(obj) {
    let idCard = obj.parentElement.parentElement.id;
    var cards;
    if (localStorage.getItem("cities") !== null) {
        cards = JSON.parse(localStorage["cities"]);
    }
    drawedCards = cards.filter(item => item["0"] != idCard);
    localStorage.setItem("cities", JSON.stringify(drawedCards));
    obj.parentElement.parentElement.remove();
    return;
}

async function setDataCard(city) {
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city["1"] + "&appid=" + apiKey + "&units=metric";
    
    let error = false; 
    
    let json = await fetch(url).then(res => res.ok ? res : Promise.reject(res))
.then(function (resp) {
            return resp.json()
        }).catch(function () {
            alert("Не удалось найти данный пункт! Удалите карточку и попробуйте снова");
            deleteItemByCity(city);
        });
    
    console.log(json);
    let city_temp = Math.round(json.main.temp);

    let iconcode = json.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    let coord_lat = json.coord.lat;
    let coord_lon = json.coord.lon;
    let coords = "[" + coord_lat.toString() + ", " +
        coord_lon.toString() + "]";
    let wind = json.wind.speed;
    let clouds = json.clouds.all;
    let pressure = json.main.pressure;
    let humidity = json.main.humidity;
    
    let cityCard = document.getElementById(city["0"]);
    
    console.log(cityCard.firstChild);
    
    var cityTemp = cityCard.querySelector("#temp");
    cityTemp.textContent = city_temp.toString() + "°C";
    var cityIcon = cityCard.querySelector("#icon_weather");
    cityIcon.src = iconurl;
    var cityWind = cityCard.querySelector("#wind");
    cityWind.textContent = wind.toString() + " m/s";
    var cityClouds = cityCard.querySelector("#clouds");
    cityClouds.textContent = clouds.toString() + "%";
    var cityPressure = cityCard.querySelector("#pressure");
    cityPressure.textContent = pressure.toString() + " hpa";
    var cityHumidity = cityCard.querySelector("#humidity");
    cityHumidity.textContent = humidity.toString() + "%";
    var cityCoords = cityCard.querySelector("#coords");
    cityCoords.textContent = coords;
    
    cityCard.querySelector("#loadInformCard").style.display = "none";
    cityCard.querySelector("#card-params").style.display = "block";
    cityCard.querySelector("#icon_weather").style.display = "block";
    cityCard.querySelector("#temp").style.display = "block";
}