document.addEventListener('DOMContentLoaded', getLinks);
const baseUrl = "http://flip2.engr.oregonstate.edu:4333/searching?searchTerm=";
const baseUrlV2 = "http://flip2.engr.oregonstate.edu:4333/link-check";
function getLinks(){
  document.getElementById('get-results').addEventListener('click', function (event) {
    const req = new XMLHttpRequest();
    const search = document.getElementById('search').value;
    req.open('GET', baseUrl + search, true);

    req.addEventListener('load', function () {
      if (req.status >= 200 && req.status < 400) {

        console.log(JSON.parse(req.responseText));
        const obj = JSON.parse(req.responseText);
        // console.log(obj.parse.links[1]["*"]);

        // populates linksObj
        // need to remove comma for last URL
        const resultsLength = obj.parse.links.length;
        const linksObj = {links: ''};
        for (var i = 1; i < resultsLength; i++) {
          const title = obj.parse.links[i]["*"];
          linksObj.links += "https://en.wikipedia.org/wiki/" + title + ", ";
        }

        //POST request to server which will be sent to Corey's service from server
        const req2 = new XMLHttpRequest();
        const payload = linksObj;
        req2.open('POST', baseUrlV2, true);
        req2.setRequestHeader('Content-Type', 'application/json');
        req2.addEventListener('load',function(){
          if(req2.status >= 200 && req2.status < 400){
            console.log(req2.responseText);
            var response = JSON.parse(req2.responseText);
            console.log(response);
            const resultsTitle = document.createElement("p");
            resultsTitle.id = "results-title";
            resultsTitle.innerHTML = "Results (&#x2713; = link is working, &#x2717; = not working): "
            const list = document.createElement("ul");
            var count = 31
            for (var i = 1; i < count; i++) {
              const listItem = document.createElement("li");
              const title = obj.parse.links[i]["*"];
              const link = "https://en.wikipedia.org/wiki/" + title;
              if (response.notWorking.includes(link)) {
                var titleWithGrade = title + "&#x2717";
                console.log("triggered");
              } else {
                var titleWithGrade = title + "&#x2713";
              }
              listItem.innerHTML = titleWithGrade.link("https://en.wikipedia.org/wiki/" + title);
              list.appendChild(listItem);
              linksObj.links += "https://en.wikipedia.org/wiki/" + title + ", ";
            }
              
            const nl = document.createElement("br");
            list.appendChild(nl);        
            resultsTitle.appendChild(list);
            const resultsDiv = document.getElementById("results-div");
            resultsDiv.appendChild(resultsTitle);
            const moreResults = document.createElement("button");
            moreResults.innerHTML = "More Results";
            moreResults.id = "more-results";
            list.appendChild(moreResults);
    
            // Creates results search bar and button
            const resultsSearchTitle = document.createElement("p");
            resultsSearchTitle.id = "results-search-title";
            resultsSearchTitle.innerHTML = "Search for a specific result: ";
            const resultsSearchButton = document.createElement("button");
            resultsSearchButton.innerHTML = "Search";
            resultsSearchButton.id = "results-search-button";
            const resultsSearchBar = document.createElement("input");
            resultsSearchBar.type = "text";
            resultsSearchBar.name = "results-search";
            resultsSearchBar.id = "results-search-bar";
            resultsSearchTitle.appendChild(resultsSearchBar);
            resultsSearchTitle.appendChild(resultsSearchButton);
            const resultsSearch = document.getElementById("results-search");
            resultsSearch.appendChild(resultsSearchTitle);
            const resultsSearchList = document.createElement("ul");
            resultsSearchList.id = "results-search-list"
            resultsSearch.appendChild(resultsSearchList);
    
            // Provides "more results" functionality
            // Could add a const here with a message "No more results" to include in the loop before the break
            moreResults.addEventListener('click', function (event) {
              for (var i = count; i < count + 31; i++) {
                if (i == resultsLength) { break; }
                const listItem = document.createElement("li");
                const title = obj.parse.links[i]["*"];
                const link = "https://en.wikipedia.org/wiki/" + title;
                if (response.notWorking.includes(link)) {
                  var titleWithGrade = title + "&#x2717";
                  console.log("triggered");
                } else {
                  var titleWithGrade = title + "&#x2713";
                }
                listItem.innerHTML = titleWithGrade.link("https://en.wikipedia.org/wiki/" + title);
                list.appendChild(listItem);
              }
              count = count + 31;
              list.appendChild(document.createElement("br"));
              list.removeChild(moreResults);
              list.appendChild(moreResults);
            })
    
            // Provides "results search" functionality
            resultsSearchButton.addEventListener('click', function (event) {
              const searchTerm = resultsSearchBar.value;
              for (var i = 1; i < resultsLength; i++) {
                const title = obj.parse.links[i]["*"];
                const link = "https://en.wikipedia.org/wiki/" + title;
                if (searchTerm == title) {
                  const listItem = document.createElement("li");

                  if (response.notWorking.includes(link)) {
                    var titleWithGrade = title + "&#x2717";
                    console.log("triggered");
                  } else {
                    var titleWithGrade = title + "&#x2713";
                  }

                  listItem.innerHTML = titleWithGrade.link("https://en.wikipedia.org/wiki/" + title);
                  resultsSearchList.appendChild(listItem);
                  console.log("success")
                }
              }
              count = count + 31;
              list.removeChild(moreResults);
              list.appendChild(moreResults);
            })

          } else {
            console.log("Error in network request: " + req2.statusText);
          }});
        req2.send(JSON.stringify(payload));
        event.preventDefault();

      } else {
        console.log("Error in network request: " + req.statusText);
      }

    });
    req.send(null);
    event.preventDefault();
  })
}

function convert(linksArray){

}