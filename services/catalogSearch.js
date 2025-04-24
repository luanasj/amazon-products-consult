import axios from "axios"

const amazonSearch = (keyword) =>{ 
    return axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`)
    .then(res=>console.log(res.data))
}


amazonSearch("planta")

