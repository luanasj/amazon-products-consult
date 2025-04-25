import express from 'express'
import path from 'path'
import { dataScraping } from '../services/catalogSearch'

const app = express()
const port = 4527

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET");
   res.header("Access-Control-Allow-Headers", "Content-Type");
   next();
});

app.use(express.static(path.join(__dirname, '../src')));

app.use(express.static(path.join(__dirname, '../index.html')));

app.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname, '../index.html'));
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