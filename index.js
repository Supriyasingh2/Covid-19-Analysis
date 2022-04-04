window.addEventListener("load", function () {
    var chartdata = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(chartdata, {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August","September","October"],
        datasets: [
          {
            label: "Confirmed",
            data: [4776541, 7333463, 7899508, 8958757, 18920028, 10060341, 16840989, 34420028, 33660341, 40776541],
            borderColor: ["red"]
          },
          {
            label: "Recoverd",
            data: [3663312, 3837319, 3637323, 6377275, 6556282, 1725523, 19835475, 21536482, 23653456, 27902276],
            borderColor: ["green",]
          },
          {
            label: "Deaths",
            data: [288212, 378219, 928223, 956375, 999882, 1038323, 1083375, 1035382, 1263723, 1124668],
            borderColor: ["yellow"]
          },
        ],
      },
    });
    function getDataByMonth() {
      var req = new XMLHttpRequest();
      var url ="​https://www.covid19api.com";
      req.open("GET", url);
      req.send();
      req.onload = function () {
        var res = JSON.parse(this.response);
        chart.data.datasets[0].data = [];
        chart.data.datasets[1].data = [];
        chart.data.datasets[2].data = [];
        for (var i = 0; i <= res.length; i += 8) {
          chart.data.datasets[0].data.push(res[i].TotalConfirmed);
          chart.data.datasets[1].data.push(res[i].TotalRecovered);
          chart.data.datasets[2].data.push(res[i].TotalDeaths);
        }
      };
    }
    getDataByMonth();
    getSummary();
    var timer;
    var searchBtn = document.getElementById("searchByCountry");
    searchBtn.addEventListener("input", function () {
      clearTimeout(timer);
      if (searchBtn.value) {
        timer = setTimeout(function () {
          filterCountry(searchBtn.value);
        },0);
      }
    });
  });
  
  var countries = [];
  function filterCountry(q) {
    q = q.toLowerCase();
    let result = countries.filter(function (country) {
      if (country.Country.toLowerCase().indexOf(q) != -1) {
        return country;
      }
    });
    displayCountryStats(result);
  }

  // display data country wise
  function displayCountryStats(res) {
    var countrylist = document.querySelector(".country-list ul");
    countrylist.textContent = "";
    if (res.length == 0) {
      countrylist.innerHTML = "<li><h2>No data of this country</h2></li>";
    } else {
      for (var i = 0; i < res.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "country-data");
        var span = document.createElement("span");
        let name = res[i].Country;
        span.textContent = res[i].TotalConfirmed;
        li.append(span, name);
        countrylist.append(li);
      }
    }
  }
  // getting and sotring data for display stats
  function getSummary() {
    var req = new XMLHttpRequest();
    var url = "https://api.covid19api.com/summary";
    req.open("GET", url);
    req.send();
    req.onload = function () {
      let res = JSON.parse(this.response);
      countries = res.Countries;
      
      displaySummary(res.Global);
      displayCountryStats(res.Countries);
    };
  }
  //display data on html page
  function displaySummary(res) {
    var total = document.querySelector(".total");
    var active = document.querySelector(".active");
    var recoverd = document.querySelector(".recoverd");
    var death = document.querySelector(".death");
    total.textContent = res.TotalConfirmed;
    active.textContent = res.NewConfirmed;
    recoverd.textContent = res.TotalRecovered;
    death.textContent = res.TotalDeaths;
  }