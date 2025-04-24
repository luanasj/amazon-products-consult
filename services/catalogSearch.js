import axios from "axios"
import {JSDOM} from 'jsdom'

const amazonSearch = async (keyword) =>{ 
    const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`,{
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    })

    return response.status == 200 ? response.data : undefined

}

const dataScraping = async (keyword)=>{
    const pageDocument = await amazonSearch(keyword)

    const products = []

    if(pageDocument){
        const dom = new JSDOM(pageDocument)
        dom.window.document.querySelectorAll('.s-result-list [role="listitem"]').forEach((listitem)=>{
            if(listitem.id){
                products.push({
                    title:listitem.querySelector('[data-cy="title-recipe"] h2 span')?.innerHTML,
                    rating: listitem.querySelector('[data-cy="reviews-ratings-slot"] span')?.innerHTML ?? "0",
                    number_of_reviews: listitem.querySelector('[data-cy="reviews-block"] [data-component-type="s-client-side-analytics"] span')?.innerHTML ?? "0",
                    img: listitem.querySelector("img")?.src
                })
            }

        })

    }

    return products
}

dataScraping("livro").then(res=>console.log(res))



