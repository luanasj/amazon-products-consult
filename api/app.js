import express from 'express'
const app = express()
const port = 3000

app.get('/api/scrape', (req, res) => {
    const {keyword} = req.query

     if(keyword){
        //calls scraping function
     }   
  res.send('Hello World! ' + keyword)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})