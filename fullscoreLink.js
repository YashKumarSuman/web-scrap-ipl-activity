// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path=require("path");

function processSinglematch(url) {

    request(url, cb);
}
function cb(error, response, html) {

    if (error) {
        console.log(error); // Print the error if one occurred
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    }
    else {
        // console.log(html); // Print the HTML for the request made 
        dataExtracter(html);
    }
}
function dataExtracter(html) {
    let searchTool = cheerio.load(html);
    // team name
    let descElem = searchTool(".event .description");
    let result = searchTool(".event .status-text");
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();
    let bothInningArr = searchTool(".Collapsible");
    for (let i = 0; i < bothInningArr.length; i++) {
        // scoreCard = searchTool(bothInningArr[i]).html();
        let teamNameElem = searchTool(bothInningArr[i]).find("h5");
        let teamName = teamNameElem.text();
        // console.log(teamName);
        teamName = teamName.split("INNINGS")[0];
        // console.log(teamName);
        teamName = teamName.trim();
        // console.log(teamName);

        let opponentTeamName="";
        if(i==0)
                {
                     opponentTeamName=searchTool(bothInningArr[1]).find("h5").text();
                    opponentTeamName=opponentTeamName.split("INNINGS")[0].trim();
                }
        else
                {
                   
                    opponentTeamName=searchTool(bothInningArr[0]).find("h5").text();
                    opponentTeamName=opponentTeamName.split("INNINGS")[0].trim();
                }
        let batsManTableBodyAllRows = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        // console.log(batsManTableBodyAllRows.length)
        // type cohersion loops -> 
        for (let j = 0; j < batsManTableBodyAllRows.length; j++) {
            let numberofTds = searchTool(batsManTableBodyAllRows[j]).find("td");
            // console.log(numberofTds.length);
            if (numberofTds.length == 8) {
                // console.log("You are valid")
                let playerName = searchTool(numberofTds[0]).text().trim();
                // console.log(playerName);
                let runs = searchTool(numberofTds[2]).text().trim();
                let balls = searchTool(numberofTds[3]).text().trim();
                let fours = searchTool(numberofTds[5]).text().trim();
                let sixes = searchTool(numberofTds[6]).text().trim();
                let sr = searchTool(numberofTds[7]).text().trim();

                let teampath=path.join(__dirname,"Ipl",teamName);
                dircreator(teampath);
                
                console.log(teamName);
            console.log("-------------------------");
            console.log("My name: ",playerName);
            console.log("Venue: ",venue);
            console.log("My team name: ",teamName);
            console.log("Date: ",date);
            console.log("Opponent team name: ",opponentTeamName);
            console.log("Result: ",result);
            console.log("Runs: ",runs);
            console.log("Balls: ",balls);
            console.log("Fours: ",fours);
            console.log("Sixes: ",sixes);
            console.log("Strike rate: ",sr);
             processonplayer(teamName,playerName,venue,date,opponentTeamName,result,runs,balls,fours,sixes,sr,teampath);

            }
            
            
        }
        console.log("``````````````````````````````````````")
        // fs.writeFileSync(`innning${i+1}.html`,scoreCard);

    }
    // players name
}
function processonplayer(teamName,playerName,venue,date,opponentTeamName,result,runs,balls,fours,sixes,sr,teampath)
{
    let playerpath=path.join(teampath,playerName+".json");
    // dircreator(playerpath);
    let content=
    {
        playerName,
        teamName,
        venue,
        date,
        opponentTeamName,
        result,
        runs,
        balls,
        fours,
        sixes,
        sr

    }
    let finalresult=[];
    // let tempobj=content;
    // let res=[tempobj];
    // let jsonwritable=JSON.stringify(res);
    if(fs.existsSync(playerpath)==false)
    {   finalresult[0]=content;
        let jsonwritable=JSON.stringify(finalresult);
        // fs.mkdirSync(playerpath);
        fs.writeFileSync(playerpath,jsonwritable);
    }
    else
    {   
        // res.push(tempobj);
        // l
        let data = fs.readFileSync(playerpath);
        let myObject = JSON.parse(data);
        myObject.push(content);
        let jsonwritable=JSON.stringify(myObject);
        fs.writeFileSync(playerpath,jsonwritable);
        // let newData2 = JSON.stringify(myObject);
        // fs.writeFileSync(playerpath, newData2)
    }
}
module.exports = {
   ps: processSinglematch
}
function dircreator(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath);
    }
}
