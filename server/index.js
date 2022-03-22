const express = require("express");
const path = require('path');
const pigLatin = require("./pig-latin");
const CSVToJSON = require('csvtojson');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../client/build')));

//End-point to get population data
app.post("/create_phrase", (req, res) => {
  
  const name = req.body.name.trim();
  const zip = req.body.zipCode.trim();
  
  (async() => {
    await fetchPopulation(zip, (data) => {
      if (data != null) {
        const population = data.population;
        const county = data.county_name;
        const message = `${pigLatin(name)}'s zip code is in ${county} County and has a population of ${population}`;
        res.json({ message: message });
      } else {
        res.json({ message: 'invalid zip code'});
      }
    })
  })()

});
//Method to read population data from CSV file
async function fetchPopulation(zipCode, callback) {
  console.log("find pop for zip = " + zipCode);
  CSVToJSON().fromFile('server/uszips.csv')
    .then(rows => {
      const result = rows.filter(row => row.zip == zipCode);
      if (result.length > 0) {
        callback(result[0])
        return
      }
      callback(null);
    }).catch(err => {
        callback(null);
    });
}
//All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

