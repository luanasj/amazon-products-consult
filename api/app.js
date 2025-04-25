//Import dependences to server
import express from 'express'
import path from 'path'
import cors from 'cors'

//Import web scrapping function
import { dataScraping } from '../services/catalogSearch'

//Create express/server instance
const app = express()
const port = 3000

//Integrates cors lib to avoid cors access restrictions on web requisitions
app.use(cors());

//shares static files with express so the server will be able to serve them
app.use(express.static(path.join(__dirname, '../dist')));

//Defines the web page as content to root route
app.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname, '../dist/index.html'));
})

//Creates route to request scrapping based on a query
app.get('/api/scrape', async (req, res) => {
    const {keyword} = req.query

     if(keyword){
        const productsColection = await dataScraping(keyword)

        productsColection.length ? res.status(200).json(productsColection) : res.status(201).json({ message: 'Failed to search'})
     } else{
        res.status(400).json({message: 'Bad Request: information missing.'})
     }
})


//starts server
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})