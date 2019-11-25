import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Search field for specific country
const Search = ({searchCountry, onChange}) => {
    
    return (
        <div>
            find countries <input value={searchCountry}
                            onChange={onChange}/>
        </div>
    )
}

// Display result for selected country
const ShowView = ({handleShowView, state}) => {
    return (
        <button onClick={() => handleShowView(state)}>
            show
        </button>
    )
}

// Display results for filtered country
const Filter = ({handleShowView, nations, nation, capital}) => {  
    const [weatherData, setWeatherData] = useState(null)

    useEffect(() => {
        const params = {
            access_Key: 'c0783766116c141658a739df594e451d',
            query: `${capital}`
        }

        axios.get('http://api.weatherstack.com/current', {params})
            .then(response => {
                setWeatherData(response.data.current)
            })

    },[capital])
    
    if(nations.length > 10) {
        
        return(             
            <div>                
                Too many matches. specify another filter                
            </div>
        )
    } else if(nations.length === 1) {            

        return (            
            <div>
                <h1>
                    {nation.name}                                                            
                </h1>
                <p>capital {nation.capital}
                    <br></br>
                    population {nation.population}</p>
                <h3>languages</h3>    
                <ul>
                    {nation.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}       
                </ul>
                <img src={nation.flag} alt={`${nation.name}'s flag'`} height={'100'} width={'120'}/>   
                <h1>Weather in {nation.capital}</h1>                
                <Weather weatherData={weatherData}/>
            </div>
        )
    }
    return (
        <div>
            {nations.map(state => <div key={state}>{state} <ShowView handleShowView={handleShowView} state={state}/></div>)} 
        </div>
    )
}

const Weather = ({ weatherData }) => {
    if (weatherData === null || weatherData === undefined) {
        return null
    }

    return (
        <div>
            <div>
            {console.log('weta: ', weatherData)}
            </div>
            <div>
                Temperature: {weatherData.temperature} degrees Celcius
            </div>
            <div>
                <img src={weatherData.weather_icons} alt={weatherData.weather_descriptions}/>
            </div>
            <div>
                Wind: {weatherData.wind_speed} kph direction {weatherData.wind_dir}
            </div>
        </div>
    )

}

const App = () => {

    const [searchCountry, setSearchCountry] = useState('')
    const [countries, setCountries] = useState([])    
    let capital = ''

    const handleSearch = (event) => {
        setSearchCountry(event.target.value)
    }
    const handleShowView = (state) => {
        setSearchCountry(state)
        
    } 
    const nations = [...countries].map(state => state.name).filter(country =>
        country.toLowerCase().includes(searchCountry.toLowerCase()) && searchCountry.length > 0)
       
   const nation = countries[countries.findIndex(c => c.name.toLowerCase().includes(searchCountry.toLowerCase()) && searchCountry.length > 0)]

   if (nation !== undefined && nations.length === 1) {
    capital = countries[countries.findIndex(c => c.name.toLowerCase().includes(searchCountry.toLowerCase()) && searchCountry.length > 0)].capital
       
   }

    const hook = () => {
     
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {                              
                setCountries(response.data)                   
            })
    }
    useEffect(hook, [])     
    
    return(
        <div>            
            <Search searchCountry={searchCountry} onChange={handleSearch}/>
            <Filter handleShowView={handleShowView} nations={nations} nation={nation} capital={capital}/>
        </div>
    )

}

export default App