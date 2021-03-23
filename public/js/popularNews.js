document.addEventListener('DOMContentLoaded', getNews);
const baseUrl = "http://flip2.engr.oregonstate.edu:4242/popular?timeRange=";

function getNews(){
  document.getElementById('formSubmit').addEventListener('click', function (event) {
    const req = new XMLHttpRequest();
    const range = document.getElementById('range').value;
    req.open('GET', baseUrl + range, true);

    req.addEventListener('load', function () {
      if (req.status >= 200 && req.status < 400) {
        const obj = JSON.parse(req.responseText);
        const list = document.createElement('ul');
        const size = obj.num_results;
        for (i = 0; i < size; i++) {
          const listItem = document.createElement('li');
          listItem.textContent = obj.results[i].title;
          list.appendChild(listItem);
          const link = document.createElement('a');
          link.href = obj.results[i].url;
          link.textContent = ' [link]';
          listItem.appendChild(link);
        }
        const nl = document.createElement('br');
        list.appendChild(nl);
        const results = document.getElementById('results');
        results.appendChild(list);

        console.log(obj);
      } else {
        console.log("Error in network request: " + req.statusText);
      }
    });
    req.send(null);
    event.preventDefault();
  })
}