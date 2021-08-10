let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595"
let request=require("request");
let cheerio=require("cheerio");
let scoreCardObj=require("./fullscoreLink");
let fs=require("fs");
let path=require("path");

// const { func } = require("assert-plus");
// myTeamName	name	venue	date	opponentTeamName	result	runs	balls	fours	sixes	sr
let iplPath=path.join(__dirname,"Ipl");
dircreator(iplPath);
request(url,cb);
function cb(error,response,html)
{
    if(error)
    {
        console.log(error);  //Print error if one occured
    }
    else if(response.statusCode==404)
    {
        console.log("Page Not Found");
    }
    else{
        dataExtractor(html);
    }
}
function dataExtractor(html)
{
    let searchTool=cheerio.load(html);
    let anchorrep=searchTool('a[data-hover="View All Results"]');
    let halfLink=anchorrep.attr('href');
    let fullLink=`https://www.espncricinfo.com${halfLink}`;
    // now going to all matches page
    request(fullLink,allMatchesPageCb);
}
function allMatchesPageCb(error,response,html)
{
    if(error)
    {
        console.log(error);  //Print error if one occured
    }
    else if(response.statusCode==404)
    {
        console.log("Page Not Found");
    }
    else{
        getAllScorecardsPageLinks(html);
    }
}
function getAllScorecardsPageLinks(html)
{
    let searchTool=cheerio.load(html);
    let ScorecardArr=searchTool('a[data-hover="Scorecard"]');
    for(let i=0;i<ScorecardArr.length;i++)
    {
        let halfscoreLink=searchTool(ScorecardArr[i]).attr('href');
        let fullscoreLink=`https://www.espncricinfo.com${halfscoreLink}`;
        console.log(fullscoreLink);
        // request(fullscoreLink,TandPLink);
        console.log("--------------------------------------");
        scoreCardObj.ps(fullscoreLink);
    }


}
function dircreator(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath);
    }
}
