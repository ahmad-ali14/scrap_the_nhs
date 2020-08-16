const axios = require('axios');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
const fs = require('fs');



function getOrg(url, newFile = true) {
    axios.get(url).then(
        page => {

            // init
            var report = {};
            var $ = cheerio.load(page.data);

            // page title
            let title = $('title');
            report.page_title = title.text();

            // search term
            let search = $('h1');
            report.search = search.text();


            // the main table
            let res = [];
            var trs = $('table > tbody > tr');

            // each table row
            trs.each((i, tr) => {
                let el = {};
                el.tr_index = i;
                // el.tr = $(tr);

                // each table head
                $(tr).find("th").each((j, th) => {
                    el.th_index = j;
                    //   el.th = $(th);

                    // each a in the th 
                    $(th).find('a').each((l, a) => {
                        el.a_index = l;
                        el.organization_name = $(a).text();
                        el.organization_link = "https://www.nhs.uk" + $(a).attr('href');
                    })
                })

                // each table cell
                $(tr).find("td").each((k, td) => {
                    el.td_index = k;
                    // el.td = $(td);

                    // each div in the td 
                    $(td).find('div').each((m, div0) => {
                        el.div0_index = m;
                        //   el.div0 = $(div0);

                        // each p in div0
                        $(div0).find('p').each((n, p) => {
                            el.p_index = n;
                            el["p" + n] = $(p).text();
                        })
                    })
                })

                res.push(el);
            })




            // add res to the report
            report.res = res;
            report.numberOfResults = res.length;


            // log final report
            console.log("________________________ final report __________________________________", '\n')
            console.log(report);


            // save report as json file
            let filename = './data/' + report.search + '.json';

            // if file existed and asked for new file
            while (newFile && fs.existsSync(filename)) {
                random = Math.floor(Math.random() * Math.floor(100));
                filename = `./data/${report.search}(${random}).json`
            }

            jsonfile.writeFile(filename, report, function (err) {
                if (err) return console.error(err)
                console.log(`JSON file created: ${filename}`)
            })


        }

    ).catch(err => console.error(err));
}



// let url = "https://www.nhs.uk/service-search/other-services/Mental-health-support/ha1/Results/92/-0.340432852506638/51.5755271911621/330/0?distance=25";

function prepareUrl(lat, lang, postcode = "your-area", distance = 25, result_on_page = 25, is_national = 0, maximum_number_of_seach_results = 50, current_page_number = 1) {
    return `https://www.nhs.uk/service-search/other-services/Mental-health-support/${postcode}/Results/92/${lat}/${lang}/330/0?distance=${distance}&ResultsOnPageValue=${result_on_page}&isNational=${is_national}&totalItems=${maximum_number_of_seach_results}&currentPage=${current_page_number}`;
}



// get data
getOrg(prepareUrl(-0.340432852506638, 51.5755271911621));










// TODO
/**
 * grap n, number of pages in the results
 * add param to the url &currentPage=n to get all result data
 * if the user give me his location => scrap the nhs using this lat, lang
 * if the user give postcode  => convert postcode to lat, lang => scrap the nhs using lat, lang
 */