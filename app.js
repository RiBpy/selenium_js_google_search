const XLSX =require('xlsx');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const clc = require("cli-color");


const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const today=new Date().getDay()// get the current day (0 for Sunday, 1 for Monday, etc.)
let sheet=weekday[today]; //Select the sheet according current day



// Now we can access the data in the sheet for the current day
// We can use the SheetJS library to parse the Excel file and access the data in the sheet

// Read the Excel file
let workbook = XLSX.readFile("Book1.xlsx");
let worksheet = workbook.Sheets[sheet];
let json = XLSX.utils.sheet_to_json(worksheet);
let data=json.map(e=>e.Keyword)
console.log(data[0])


async function run(){
     try {
      const browser = await puppeteer.launch({headless:false}); 
    const page = await browser.newPage();
    for (let i= 0; i< data.length; i++){
        const keyword = data[i];
        await page.goto('https://www.google.com'); 
        await page.focus('input[name="q"]');
        await page.keyboard.type(keyword); 

        await page.waitForSelector('[role="listbox"]');
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ =  cheerio.load(html);
        const options = $('[role="listbox"] [role="option"]').map((i, el) =>$(el).text()).get();
        await new Promise(resolve => setTimeout(resolve, 2000));
        options.sort((a, b) => a.length - b.length);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const shortest = options.shift();
        const longest = options.pop();
        
        console.log(clc.blue(`Shortest Option for ${keyword} -> `,shortest));
        console.log(clc.green(`Longest  Option for ${keyword} -> `,longest));
        const row = i + 3 ;
        worksheet[`D${row}`] = { v: longest };
        worksheet[`E${row}`] = { v: shortest };

        XLSX.writeFile(workbook, 'Book1.xlsx'); 
        await new Promise(resolve => setTimeout(resolve, 1000));
          browser.close();
     }
    }catch (error) {
      console.log(error)
     }
    }
    run()
