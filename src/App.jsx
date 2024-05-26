import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { TiWeatherCloudy, TiWeatherDownpour,TiWeatherShower,TiWeatherSnow,TiWeatherStormy,TiWeatherSunny,TiWeatherWindy} from "react-icons/ti";
import {BsCloudHaze, BsFillCloudsFill } from "react-icons/bs";


const App = () => {
   const [data,setData] = useState({})
   const [index, setIndex] = useState(NaN)
   const [presentTemp,setPresentTemp] = useState()
   const [icon,setIcon] = useState(<></>)
   const [lastHistory,setHistory] = useState()
   const currentTime = new Date()
   const hour = currentTime.getHours()
   const day = currentTime.getDay()
   const date = currentTime.getDate()
   const month = currentTime.getMonth()+1
   const year = currentTime.getFullYear()
  const presentTime = `${year}-${month < 10? `0${month}` : `${month}`}-${date < 10? `0${date}` : `${date}`}T${hour < 10 ? `0${hour}` : `${hour}`}:00`


  const weatherIcon = (description)=>{

      if(description === 'clear sky'){
        setIcon(<TiWeatherSunny/>)
      }
      if(description === 'haze'){
        setIcon(<BsCloudHaze/>)
      }
      if(description === 'few clouds'){
        setIcon(<TiWeatherCloudy/>)
      }
      if(description === 'scattered clouds'){
        setIcon(<TiWeatherCloudy/>)
      }
      if(description === 'broken clouds'){
        setIcon(<BsFillCloudsFill/>)
      }
      if(description === 'shower rain'){
        setIcon(<TiWeatherShower/>)
      }
      if(description === 'rain'){
        setIcon(<TiWeatherDownpour/>)
      }
      if(description === 'thunderstorm'){
        setIcon(<TiWeatherStormy/>)
      }
      if(description === 'snow'){
        setIcon(<TiWeatherSnow/>)
      }
      if(description === 'mist'){
        setIcon(<TiWeatherWindy/>)
      }
   
  }



   useEffect(()=>{ 
      axios.get('https://weather-watch-backend.vercel.app/')
      .then(res=>{
        console.log(res.data)
      })


      let temIndex = NaN
      axios.get('http://localhost:5000/location')
      .then(res=>{
        res.data?.hourly?.time.filter((item,ind)=>{
              if(item===presentTime){
                  temIndex = ind
                 setIndex(ind)
              }
        })
        setPresentTemp(res.data?.hourly?.temperature_2m[temIndex])
        setData(res.data)
         axios.get('http://localhost:5000/history')
          .then(res2=>{
           setHistory(res2.data.hourly)
      })
      })

     

      
   },[])



   const find = (e)=>{
     e.preventDefault()
    let temIndex = NaN
    const location = e.target.location.value
    axios.get(`http://localhost:5000/findLocation?location=${location}`)
    .then(res=>{
      res.data?.hourly?.time.filter((item,ind)=>{
            if(item===presentTime){
                temIndex = ind
               setIndex(ind)
            }
      })
      setPresentTemp(res.data?.hourly?.temperature_2m[temIndex])
      setData(res.data)
       axios.get(`http://localhost:5000/findHistory?location=${location}`)
        .then(res2=>{
         setHistory(res2.data.hourly)
    })
    })

   }


  return (
    <div className=''>
        <div className='mt-3 mb-10 flex gap-3 items-center overflow-auto'>
            {
            lastHistory?.temperature_2m.slice(0,24).map((temp,ind)=>{
                const time = lastHistory.time[ind]
                if(time === presentTime){
                  return <div className='bg-gray-500 p-2 rounded-lg flex flex-col items-center'>
                  <h1 key={index}>{temp}&deg;</h1>
                  <h1 className='text-center w-max'>{presentTime}</h1>
               </div>
                }
                return <div className='bg-gray-300 p-2 rounded-lg flex flex-col items-center'>
                   <h1 key={index}>{temp}&deg;</h1>
                   <h1 className='text-center w-max'>{time}</h1>
                </div>
            })}
        </div>
        
        <div className='flex justify-center flex-col items-center gap-5'>
        <h1 className='text-4xl font-bold'>   
    {
        presentTemp
    }&deg;</h1>
    <h2 className='text-xl font-semibold'>
      {
         data?.weather?.[0].description
      }
    </h2>
      {icon}
    <form onSubmit={find} className='flex flex-col items-center gap-5'>
    <input name='location' className='input border-2 border-gray-300'/>
    <button className='btn'>Find</button>
    </form>
    </div>
    </div>
  );
};

export default App;