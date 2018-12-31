"use strict";

//cryptocurrency api
const api_key1 ="960e428fdca399a09e41196327f5766b1f76aa979eec604f31318a4e0ac3f032";
//contains an array of responseJson data from API endpoint AllCoins
let dataArray;
//counter for All Coins page's index in the array dataArray
let pageCounter = 0;
//boolean to switch on/off back button
let backEnabled = false;

//formats parameters for urls
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//canvas settings for background
window.onload = function () {
    Particles.init({
        selector: ".background",
        color: "#c6a307",
        connectParticles: true,
        maxParticles: 160,
        minDistance: 90,
        speed: 0.33
    });
};

//event for clicking "CryptOracle logo"
function reloadPage() {
    $(".logo").on("click", function () {
        location.reload();
    });

}

function reloadSearch() {
    $(".landing").on("click", ".refresh", function () {
        location.reload();
    });

}

//event for clicking "Top 10 Coins"
function registerNavbtnI() {
    $(".nav-btn1").on("click",function(event) {
        $(this).prop("disabled", true);
        backEnabled = false;
        $(".landing").empty();
        generateTopTenLayout();
        generateTopTen();
    })
}

//event for clicking "All Coins"
function registerNavbtnII() {
    $(".nav-btn2").on("click", function(event) {
        $(this).prop("disabled", true);
        pageCounter = 0;
        backEnabled = true;
        $(".landing").empty();
        generateAllCoinsLayout();
        generateAllCoins();
    })

}

function registerBackBtn() {
    $(".landing").on("click",".back-btn", function (event) {
        $(this).prop("disabled", true);
        $(".landing").empty();
        generateAllCoinsLayout();
        generateAllCoins();
    })

}

//event for clicking "About"
function registerAbout() {
    $(".about-btn").on("click", function (event) {
        $(".landing").empty();
        $(".landing").append(`<div class="about-page">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        </div>
`);
    });
}

//generates html elements for generateTopTen() to append future td's
function generateTopTenLayout() {
    $(".landing").hide().fadeIn().html(`
        <section>
            <h2 class="hidden">Top Ten List by 24 Hour Volume Subscriptions</h2>
                <table class="top-currencies">
                    <tr class="main-table">
                        <th>Name</th>
                        <th>Price</th>
                        <th>High/Low</th>
                    </tr>
                </table>
        </section>`)
}

//generates html elements for generateAllCoins() to append future td's
function generateAllCoinsLayout() {
    $(".landing").hide().fadeIn().html(`
        <section>
            <h2>All Coins</h2>
                <table class="all-currencies">
                    <tr class="main-table">
                    </tr>
                </table>
        </section>`)
}

//fetch endpoint "Top 10 total volume" and append results to html elements generated by generateTopTenLayout()
function generateTopTen() {
    const searchUrl = "https://min-api.cryptocompare.com/data/top/totalvolfull";//correct base url?
    const baseImageUrl = "https://www.cryptocompare.com/";

    let params = {
        limit: "10",
        tsym: "USD",
        api_key: api_key1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString;

    return fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })
        .then(function (responseJson) {
            let tableitems = "";
            for (let i=0; i<responseJson.Data.length; i++) {
                tableitems = tableitems.concat(`
                <tr class="table-info" id="${responseJson.Data[i].CoinInfo.Name}">
                    <td class="cName"><a href="#"><img class="icons" src="${baseImageUrl}${responseJson.Data[i].CoinInfo.ImageUrl}">${responseJson.Data[i].CoinInfo.FullName}</a></td>
                    <td class="price">${responseJson.Data[i].DISPLAY.USD.PRICE}</td>
                    <td class="volume">${responseJson.Data[i].DISPLAY.USD.HIGHDAY}/${responseJson.Data[i].DISPLAY.USD.LOWDAY}</td>
                </tr>`);
            }
            $(".top-currencies").hide().fadeIn().html(tableitems);
            $("h2.hidden").removeClass("hidden");

        })
        .catch(error => console.log("generateTopTen failed"));
}

//on click redirect to more detail results
function coinDetail(){
    $(".landing").on("click", ".table-info", function(event){
        $(".landing").empty();
        let coinName = $(event.currentTarget).attr("id");
        console.log("value",coinName);
        generateResultsMedia(coinName);
        generateResults(coinName,"","USD");
    });
}

//fetch endpoint "all coin list"
function generateAllCoins() {
    const searchUrl = "https://min-api.cryptocompare.com/data/all/coinlist";

    return fetch(searchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })
        .then(function (responseJson) {
            dataArray = [];
            for (let key in responseJson.Data){
                dataArray.push(responseJson.Data[key]);
            }
            console.log("made it to generateQ");
            generateQuantity(dataArray);
        })
        .catch(error => console.log("generateAllCoins failed",error));

}

//generates list of All Coins by passing in array of objects from generateAllCoins
function generateQuantity(arr) {
    let tableitems2 = "";
    const baseImageUrl = "https://www.cryptocompare.com/";
    for (let i=pageCounter; i<pageCounter+20; i++) {
        tableitems2 = tableitems2.concat(`
        <tr class="table-info" id="${arr[i].Name}">
            <td><a href="#"><img class = "icons" src="${baseImageUrl}${arr[i].ImageUrl}">${arr[i].FullName}</a></td>
            </tr>`);
    }

    if (pageCounter === 0) {
    $(".all-currencies").hide().fadeIn().html(tableitems2);
    $(".all-currencies").hide().fadeIn().append(`<div><a href="#" class="next-load">Next -></a></div>`);
    } else {
        $(".all-currencies").hide().fadeIn().append(tableitems2);
        $(".all-currencies").hide().fadeIn().append(`<div class="index-nav"><a href="#" class="previous-load"><- Previous </a><a href="#" class="next-load"> Next -></a></div>`);
    }
    window.scrollTo(0,0);
    
}

//register event for next button on All Coins
function loadNextCoins() {
    $(".landing").on("click", ".next-load", function(event){
        $(".all-currencies").empty();
        pageCounter = pageCounter + 20;
        generateQuantity(dataArray);
    })
}

//register event for previous button on All Coins
function loadPreviousCoins() {
    $(".landing").on("click", ".previous-load", function (event) {
        $(".all-currencies").empty();
        pageCounter = pageCounter - 20;
        generateQuantity(dataArray);
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//event for submitting a search on landing page
function registerEvents(){
    $(".search-bar").on("submit", function(event) {
        event.preventDefault();
        
        let searchTerm = (($(".search-term").val()).toUpperCase());
        console.log("search term", searchTerm);

        let searchMarket = $(".search-ex").val();
        console.log("market", searchMarket);

        let fCurrency = $(".search-xxx").val();
        console.log("fcurrecny", fCurrency);

        $(".landing").empty();
        $(".landing").html(`<div class="refresh"><- Back</div>`)
        generateResultsMedia(searchTerm);// endpoint that only gives the name
        generateResults(searchTerm, searchMarket, fCurrency);

        
    })
}

//generates statistics from Custom Average endpoint
function generateResults(search, exchange, currency) {
    const searchUrl = "https://min-api.cryptocompare.com/data/generateAvg"
    if (exchange ==="") {
        exchange = "CCCAGG";
    }

    if (search==="") {
        search ="BTC";
    }

    let params = {
        fsym: search,
        tsym: currency,
        e: exchange,
        api_key: api_key1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString;

    return fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            if(backEnabled === true){
            $(".landing").append(`<div class="back-btn"><- Back</div>`);}
            if (responseJson.DISPLAY.PRICE !== undefined){
            $(".landing").append(`<table class="search-results"></table>`);
            $(".search-results").append(`
                <tr><td>Price: ${responseJson.DISPLAY.PRICE}</td></tr>
                <tr><td>Open24: ${responseJson.DISPLAY.OPEN24HOUR}</td></tr>
                <tr><td>High24: ${responseJson.DISPLAY.HIGH24HOUR}</td></tr>
                <tr><td>Low24: ${responseJson.DISPLAY.LOW24HOUR}</td></tr>
                <tr><td>Change24: ${responseJson.DISPLAY.CHANGE24HOUR}</td></tr>
                <tr><td>ChangePercent: ${responseJson.DISPLAY.CHANGEPCT24HOUR}%</td></tr>
            `)} else{
                $(".landing").append(`<div class="no-data">No Data</div>`)
            }
        })
        .catch(error => console.log("1 error happened"));
}

//generates name from seperate endpoint, only that endpoint contains fullname of search query
function generateResultsMedia(search) {
    const searchUrl = "https://min-api.cryptocompare.com/data/all/coinlist"

    const url = searchUrl + "?" + api_key1;

    if(search ==""){
        search = "BTC"
    }
    return fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            console.log("generateResultsMedia fired:", responseJson.Data[search].FullName);
            $(".search-results").append(`<tr><td>${responseJson.Data[search].FullName}</td></tr>`);
            
        })
        .catch(error => console.log(error));
}

function documentReady() {
    registerEvents();
    registerNavbtnI();
    reloadSearch();
    registerNavbtnII();
    loadNextCoins();
    loadPreviousCoins();
    registerBackBtn();
    registerAbout();
    coinDetail();
    reloadPage();
}

$(documentReady);


















