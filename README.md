# graphtoimage
A service that creates HTML Graphs to Images using HTTP request. The template being used is [Charts.js](https://www.chartjs.org/)

## Setup
### Using docker
1. `docker run -d -p 3000:3000 gideonairex/graphtoimage`

### Using node.js
1. `git clone git@github.com:gideonairex/graphtoimage.git`
2. `npm install`
3. `node .`


## How to create an image
### Using Axios
```
var axios = require('axios');
var data = JSON.stringify({"type":"line","data":{"labels":["Red","Blue","Yellow","Green","Purple","Orange"],"datasets":[{"label":"# Hugh","data":[12,20,10],"backgroundColor":["rgba(255, 99, 132, 0.2)","rgba(54, 162, 235, 0.2)","rgba(255, 206, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 159, 64, 0.2)"],"borderColor":["rgba(255, 99, 132, 1)","rgba(54, 162, 235, 1)","rgba(255, 206, 86, 1)","rgba(75, 192, 192, 1)","rgba(153, 102, 255, 1)","rgba(255, 159, 64, 1)"],"borderWidth":1}]},"options":{"scales":{"yAxes":[{"ticks":{"beginAtZero":true}}]}}});

var config = {
  method: 'post',
  url: 'http://localhost:3000/generate-graph',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data,
  responseType: 'arraybuffer'
};

axios(config)
.then(function (response) {
    console.log(`data:img/png;base64,${Buffer.from(response.data).toString('base64')}`);
})
.catch(function (error) {
  console.log(error);
});

```

### Using jQuery
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>
<div id="container">
    <img id="image"/>
</div>
<script>
var settings = {
  "url": "http://localhost:3000/generate-graph",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  xhrFields:{
            responseType: 'blob'
  },
  "data": JSON.stringify({"type":"bar","data":{"labels":["Red","Blue","Yellow","Green","Purple","Orange"],"datasets":[{"label":"# Hugh","data":[12,20,10],"backgroundColor":["rgba(255, 99, 132, 0.2)","rgba(54, 162, 235, 0.2)","rgba(255, 206, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 159, 64, 0.2)"],"borderColor":["rgba(255, 99, 132, 1)","rgba(54, 162, 235, 1)","rgba(255, 206, 86, 1)","rgba(75, 192, 192, 1)","rgba(153, 102, 255, 1)","rgba(255, 159, 64, 1)"],"borderWidth":1}]},"options":{"scales":{"yAxes":[{"ticks":{"beginAtZero":true}}]}}}),
};

$.ajax(settings).done(function (response) {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(response);
    document.querySelector("#image").src = imageUrl;
});
</script>
```

## Usage
1. create a POST request to the service `http://localhost:3000/generate-graph`
2. create an application/json payload. Base it on the [Chart.js data](https://www.chartjs.org/docs/latest/)
See example:
```
{
  "type": "line",
  "data": {
    "labels": [
      "Red",
      "Blue",
      "Yellow",
      "Green",
      "Purple",
      "Orange"
    ],
    "datasets": [
      {
        "label": "# Hugh",
        "data": [
          12,
          20,
          10
        ],
        "backgroundColor": [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        "borderColor": [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        "borderWidth": 1
      }
    ]
  },
  "options": {
    "scales": {
      "yAxes": [
        {
          "ticks": {
            "beginAtZero": true
          }
        }
      ]
    }
  }
}
```

### Roadmap
1. Test different graphs
2. Create API keys
3. Add different viewports
4. Add different templates
