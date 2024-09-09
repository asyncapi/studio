import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchOpenGraphTags(url: string, userAgent: string) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': userAgent
            }
        });
        console.log("the data is", data)
        const $ = cheerio.load(data);
        const ogTags: { [key: string]: string } = {};

        $('meta').each((_, element) => {
            const property = $(element).attr('property');
            if (property && property.startsWith('og:')) {
                ogTags[property] = $(element).attr('content') || '';
            }
        });

        return ogTags;
    } catch (error) {
        console.error(error);
    }
}
