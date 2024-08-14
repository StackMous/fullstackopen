import { useState, useEffect } from 'react'
import axios from 'axios'

const Names = ({names, showClickedCountry}) => {
  if (names.length > 10) return (
    <div> 'Too many matches, specify another filter'</div>
  )
  else if (names.length > 1 ) return (
    names.map((name) => 
    <div key={name}>{name}
      <button onClick={() => showClickedCountry(name)}>show</button>
    </div>)
  ) 
  // skip 'empty' and 'only one found' cases
}

const Weather = ({weather, capital}) => {
  if (weather) {
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    return(
      <div>
        <h2>Weather in {capital}</h2>
        <p>temperature {weather.main.temp} Celsius</p>
        <img src={iconUrl}/>
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    )
  }
}

const Country =({country, weather}) => {
  if (country) {
    return(
      <div> 
        <h1> {country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.keys(country.languages).map((key, index) => (
            <li key={index}>{country.languages[key]}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <Weather weather={weather} capital={country.capital}/>
      </div>
    )
  }
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [filteredNames, setFilteredNames] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log('effect run, country is now', country)

    if (filter) {
      console.log('fetching countries...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)        
        .then(response => {
          const filtered = response.data.filter(countries => countries.name.common.toLowerCase().includes(filter.toLowerCase()))
          setFilteredList(filtered)
          const namesOnly = filtered.map(countries => countries.name.common)
          console.log(namesOnly)
          setFilteredNames(namesOnly)
          if (namesOnly.length == 1) {
            // filter found the only one
            setCountry(filtered[0])
            showCountryWeather(filtered[0])
          } else if (namesOnly.length > 1) {
            // don't show a country if list of countries is shown
            setCountry(null) 
          } else {
            // show nothing if nothing matches
            setFilteredList([])
            setCountry(null)
          }
        })
        .catch(error => {
          console.log(
            `Error '${error}' happened when fetching all countries`
          )
        })
    } else {
      // if filter is empty, filtered list should be empty too
      setFilteredList([])
      setFilteredNames([])
      setCountry(null)
    }
  }, [filter])

  const showClickedCountry = name => {
    console.log(`user clicked ${name}`)
    const countryDetails = filteredList.find(element => 
      element.name.common === name
    )
    console.log(`Country's details:`, countryDetails)
    // Don't show the list of countries when user clicked one
    setFilteredNames([])
    // set the chosen country
    setCountry(countryDetails)
    showCountryWeather(countryDetails)
  }

  const showCountryWeather = countryDetails => {
    const lat = countryDetails.capitalInfo.latlng[0]
    const long = countryDetails.capitalInfo.latlng[1]
    console.log(`latitude: ${lat} longitude: ${long}`)
    const api_key = import.meta.env.VITE_SOME_KEY
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${api_key}`)        
      .then(response => {
        console.log(response.data)
        setWeather(response.data)
      })
      .catch(error => {
        console.log(
          `Error '${error}' happened when fetching the weather`
        )
      })
  }

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    // Do nothing when enter pressed
    console.log("User clicked enter")
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        Find countries: <input value={filter} onChange={handleChange} />
      </form>
      <Names names={filteredNames} showClickedCountry={showClickedCountry}/>
      <Country country={country} weather={weather}/>
    </div>
  )
}

export default App