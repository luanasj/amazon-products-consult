import express from 'express'
import { dataScraping } from '../services/catalogSearch'

const app = express()
const port = 3000

app.get('/api/scrape', async (req, res) => {
    const {keyword} = req.query

     if(keyword){
        const productsColection = await dataScraping(keyword)

        productsColection.length ? res.status(200).json(productsColection) : res.status(204).json({ message: 'No products found for the given keyword.' });
     } else{
        res.status(400).json({message: 'Bad Request: query param "keyword" is missing.'})
     }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})