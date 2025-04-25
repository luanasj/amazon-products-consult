import express from 'express'
import { dataScraping } from '../services/catalogSearch'

const app = express()
const port = 4527

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET");
   res.header("Access-Control-Allow-Headers", "Content-Type");
   next();
 });

app.get('/api/scrape', async (req, res) => {
    const {keyword} = req.query

     if(keyword){
        const productsColection = await dataScraping(keyword)

        productsColection.length ? res.status(200).json(productsColection) : res.status(201).json({ message: 'No products found for the given keyword.'})
     } else{
        res.status(400).json({message: 'Bad Request: information missing.'})
     }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})