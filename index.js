/*
= Project Title : Finding Freelancers Details from Freelancer.com
= Author : Siam Hasan
= Date : 23 . 05 . 2022
*/

const puppeteer = require('puppeteer');
var writeExcelFile = require('write-excel-file/node');

// Creating a table Structure
var table = [[{ value: 'SNO', fontWeight: 'bold' }, { value: 'Freelancer Name', fontWeight: 'bold', }, { value: 'Title', fontWeight: 'bold' }, { value: 'Reviews', fontWeight: 'bold' }, { value: 'Hourly Rate', fontWeight: 'bold' }, { value: 'Profile Link', fontWeight: 'bold' }]];

const freelancerFinder = async (totalPage) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (i = 1; i < (totalPage + 1); i++) {
    await page.goto(`https://www.freelancer.com/freelancers/${i}`);

    // Scrapping the Freelancer detail Element
    const freelancers = await page.evaluate((i) => {
      return Array.from(document.querySelectorAll('.freelancer-details')).map((ele, indx) => {

        let index = indx + 1 + ((i - 1) * 10);
        let name = ele.getElementsByClassName('find-freelancer-username')[0].innerText;
        let title = ele.getElementsByClassName('user-tagline')[0].innerText;
        let link = ele.getElementsByClassName('find-freelancer-username')[0].href;
        let hourlyRate = ele.getElementsByClassName('user-hourly-rate freelancer-hourlyrate')[0].innerText;
        let review = ele.getElementsByClassName('directory-freelancer-rating')[0].innerText;

        return { index: index, name: name, title: title, review: review, hrRate: hourlyRate, link: link };

      });
    });

    // Adding row and data in the table
    freelancers.forEach((item) => {
      table.push([{ type: Number, value: item.index }, { type: String, value: item.name }, { type: String, value: item.title }, { type: String, value: item.review }, { type: String, value: item.hrRate }, { type: String, value: item.link }]);
    });
  }
  // Closing the Browser !!! important !!!
  browser.close();
};

// Writing in .xlsx format
async function writeInExcel(totalPage, fileName) {
  await freelancerFinder(totalPage);
  await writeExcelFile(table, {
    filePath: `${fileName}.xlsx`,
  });
};

writeInExcel(5, "FreelancersList");


/*
// ScreenShotTaker
async function takeScreeShot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://bd.linkedin.com');
  await page.screenshot({
    path: 'linkedin2.jpg', fullPage: true
  });
  await browser.close(); // !! important !!
}
*/