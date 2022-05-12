// general setup
    if (process.env.NODE_ENV !== 'production'){require('dotenv').config()}       // env initialization

// notion api
    var { Client } = require("@notionhq/client")
    const notion = new Client ({auth:process.env.NOTION_KEY})
    const databaseId = process.env.NOTION_DATABASE_ID

// local integration files
    const twitter = require("./twitter-integration.js")  

async function main () {

    // run twitter integration 
        if (process.env.TWITTER_BEARER_TOKEN){
            await twitter.twitterIntegration()
        } else {
            console.log("twitter integration not running (no bearer token provided)")
        }
}

// only run code if notion key and database id is provided
if (process.env.NOTION_KEY||NOTION_DATABASE_ID){
    main()
} else {
    console.log ("notion key and/or notion database id not provided")
}