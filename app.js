const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

const fs = require('fs');

const data = require('./data.json');
const imgs = require('./imgs.json');

app.use(express.json());
app.use(express.static('client'));

app.get('/data', function (request, response) {
  // Sends all data from data.json to client
  response.send(data);
});

app.get('/search', function (request, response) {
  const keyword = request.query.keyword;
  var matching = [];
  console.log(`Searching for ${keyword}`);
  for (let i = 0; i < data.length; i++) {
    try {
      if (data[i].Date.toLowerCase().includes(keyword.toLowerCase())) {
        matching.push(data[i]);
      } else {
        if (data[i].Home.toLowerCase().includes(keyword.toLowerCase())) {
          matching.push(data[i]);
        } else {
          if (data[i].HomeTeam.toLowerCase().includes(keyword.toLowerCase())) {
            matching.push(data[i]);
          } else {
            if (data[i].Score.toLowerCase().includes(keyword.toLowerCase())) {
              matching.push(data[i]);
            } else {
              if (data[i].Away.toLowerCase().includes(keyword.toLowerCase())) {
                matching.push(data[i]);
              } else {
                if (data[i].AwayTeam.toLowerCase().includes(keyword.toLowerCase())) {
                  matching.push(data[i]);
                }
              }
            }
          }
        }
      }
    } catch {};
  }
  response.send(matching);
});

app.post('/adddata', function (request, response) {
  const newRecord = request.body;

  data.push(newRecord);

  const json = JSON.stringify(data);
  fs.writeFile('data.json', json, 'utf8', console.log);

  response.send('Success');
});

app.get('/imgs', function (request, response) {
  response.send(imgs);
});

app.post('/addimg', function (request, response) {
  const newImg = request.body;

  imgs.push(newImg);

  const json = JSON.stringify(imgs);
  fs.writeFile('imgs.json', json, 'utf8', console.log);

  response.send('Success');
});

module.exports = app;
