import './App.css';
import React, { useState, useEffect } from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import { Card, CardContent } from '@mui/material';
import Table from './components/Table';
import { sortData, prettyPrintStat } from './util';
import numeral from "numeral";
import LineGraph from './components/LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

  const [country, setCountry] = useState("worldwide");
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: 0.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {

    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide" ? setMapCenter([ 34.80746, 0.4796 ]) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]) 
        countryCode === "worldwide" ? setMapZoom(3) : setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <div className='title_holder'>
            <h1>COVID-19 Tracker</h1><p> by Kemo Sonko</p>
          </div>
          <FormControl>
            <Select
              variant="outlined"
              style={{ backgroundColor: "rgb(255, 255, 255)" }}
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem key="worldwide" value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        <p style={{fontWeight: "bold"}} className="update_text">As of 8/5/21, recovered cases are no longer being tracked </p>
      </div>
      <Card className="app_right">
        <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app_graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
