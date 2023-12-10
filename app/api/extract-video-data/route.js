const puppeteer = require('puppeteer');
import { NextResponse } from "next/server";
import { convertRelativeDates, convertViewsToNumber, autoScroll } from "@/app/utils/utils";

// To handle a GET requests
export async function GET(request) {
    const convertedDate = convertRelativeDates('8 weeks ago');
    const convertedViewsNumber = convertViewsToNumber('8M views');
    const result = {
        date: {
            before: '8 weeks ago',
            after: convertedDate
        },
        views: {
            before: '8M views',
            after: convertedViewsNumber
        }
    }
    return NextResponse.json(result, { status: 200 });
}


// To handle a POST requests
export async function POST(request) {
    const data = await request.json();
    const url = data.url;

    const browser = await puppeteer.launch({
        args: ['--lang=en-US,en'],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en'
     });
    await page.goto(url);

    // scroll until there are no more videos to load
    await autoScroll(page);

    // Extract the video Data
    const result = await page.$$eval('#details', details => {
        return details.map(detail => {
            const title = detail.querySelector('#video-title').textContent;
            const views = detail.querySelector('#metadata-line > span:nth-child(3)').textContent;
            const date = detail.querySelector('#metadata-line > span:nth-child(4)').textContent;

            return { title, views, date };
        });
    });

    const formattedResult = result.map(e => {
        const formattedViews = convertViewsToNumber(e.views);
        const formattedDate = convertRelativeDates(e.date);
        return {
            title: e.title,
            views: formattedViews,
            date: formattedDate
        }
    })

    await browser.close();


    return NextResponse.json({formattedResult}, { status: 200 });
}
   
   