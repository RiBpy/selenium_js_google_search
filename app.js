const XLSX=require("xlsx")
const file=XLSX.readFile("Book1.xlsx")
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const today=new Date().getDay()
const fileSheet=file.Sheets[weekday[today]]
const arrData=XLSX.utils.sheet_to_json(fileSheet)
let keywords=arrData.map(el=>el.Keyword)
console.log(keywords[0]);

const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    //assuming you have an array of keywords
    //iterating through all keywords
    for (let keyword of keywords){
        await driver.get('http://www.google.com');
        await driver.findElement(By.name('q')).sendKeys(keyword);
        
        let titles =await driver.findElements(By.className("wM6W7d"));
        let title = titles.map( async title =>await title.getText());
        console.log("title:"+title.entries());
        await driver.wait(until.titleIs(keyword + '- Google Search'), 2000);
    }
  } catch(e) {
    console.log(e);
  }
})();



