import axios from 'axios';
import cheerio from 'cheerio';
import Cheerio = cheerio.Cheerio;
import {IArticle} from "./ArticleInterfaces";
import { parse } from 'json2csv';
import { writeFileSync } from 'fs';

const url = 'https://www.theguardian.com/international'; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance

// Send an async HTTP Get request to the url
AxiosInstance.get(url)
    .then( // Once we have data returned ...
        response => {
            const html = response.data; // Get the HTML from the HTTP request
            const loadedData = cheerio.load(html); // Load the HTML string into cheerio
            const titleTables: Cheerio = loadedData('.fc-item__title'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
            console.log(titleTables); // Log the number of captured elements

            const articles: IArticle[] = [];

            titleTables.each((index, element) => {
                const title = loadedData(element).text();
                const link = loadedData(element).find('a').attr('href');
                articles.push(<IArticle>{
                    title,
                    link
                });
            })
            console.log(articles)
            const csv = parse(articles);
            writeFileSync('articles.csv', csv);
        }
    )
    .catch(console.error); // Error handling



