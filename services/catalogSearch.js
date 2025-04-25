//Imports dependences to Web Scrapping
import axios from "axios"
import {JSDOM} from 'jsdom'

//Lists multiple user agents to help avoiding automated access restrictions
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'    
];

//Returns a random user agend from a list
const getRandomUserAgent = (userAgents) => {
return userAgents[Math.floor(Math.random() * userAgents.length)];
};

//Returns de content of an Amazon Search Request web page
const amazonSearch = async (keyword) =>{ 
    const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`,{
        headers: {
            'User-Agent': getRandomUserAgent(userAgents),
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
        }
    }).catch((e)=>{console.log(e)})

    return response?.status == 200 ? response.data : undefined
}


//Retrieves specific content from Amazon Web Page Content
//Returns a list of product objects
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
                    imgURL: listitem.querySelector("img")?.src
                })
            }

        })

    }

    return products
}

export {dataScraping}



