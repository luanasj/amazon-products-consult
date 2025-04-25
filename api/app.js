import express from 'express'
import path from 'path'
import cors from 'cors'
import { dataScraping } from '../services/catalogSearch'

const app = express()
const port = 4527

app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname, '../dist/index.html'));
})

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