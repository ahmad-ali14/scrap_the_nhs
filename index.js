const axios = require('axios');
const cheerio = require('cheerio');

// let url = "https://hubofhope.co.uk/services?latitude=51.5828963&longitude=-0.3362885";

//let url = "https://ahmad-ali.co.uk/"

//let url = "https://www.nhs.uk/conditions/stress-anxiety-depression/mental-health-helplines/"

let url = "https://www.nhs.uk/service-search/other-services/Mental-health-support/ha1/Results/92/-0.340432852506638/51.5755271911621/330/0?distance=25";

axios.get(url,
    // {
    // headers: {
    //     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
    // }
    //}
).then(data => {
    const $ = cheerio.load(data.data);
    //console.log(data.data)
    //console.log($.html())
    // let x = $(".__f8bee");
    //console.log([...x]);
    let x = $('table > tbody');
    // console.log(x.children())
    //  var x = $.getElementsByClassName('__f8bee');
    // console.log(x.children());
    let result = []
    x.children().each((i, e) => {
        let td = e.children
        //.each(e => console.log('child'))
        result.push({
            index: i,
            name: e.name,
            content: td[4]

        })
    })

    console.log(result)
})