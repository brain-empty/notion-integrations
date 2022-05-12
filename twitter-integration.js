// notion api
var { Client } = require("@notionhq/client")
const notion = new Client ({auth:process.env.NOTION_KEY})
const databaseId = process.env.NOTION_DATABASE_ID

// twitter api
const  { TwitterApi } = require('twitter-api-v2')
const appOnlyClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

async function twitterIntegration () {
    const lastNotionEntry = await findLastTweetNotion()
    const tweets = await findTweetsSinceLastNotionEntry(lastNotionEntry)
    if (tweets){
        addTweet (tweets)
    } else {
        console.log("no new tweets to add")
    }
}

async function findLastTweetNotion () {
    const lastNotionEntryResult = await notion.databases.query({
        database_id: databaseId,

        filter: {
            and: [
            {
                property: 'source',
                select: {
                    equals:'twitter'
                }
            }
          ],
        },

        sorts: [
          {
            property: 'date',
            direction: 'descending',
          },
        ],

        page_size:1
    });

    // finding the entries url field and slicing it to extract the ID of the tweet from the URL
    const lastNotionEntry = lastNotionEntryResult.results[0].properties.url.url.slice(-19)

    return lastNotionEntry
}

async function findTweetsSinceLastNotionEntry (lastNotionEntry) {
    const query = 'from:' + process.env.TWITTER_USERNAME
    const tweetsFound = await appOnlyClient.v2.search(query, {
            'since_id' : lastNotionEntry,
            'tweet.fields': 'conversation_id,created_at,in_reply_to_user_id,author_id'
        }
    )

    const tweets = tweetsFound._realData.data
    return tweets
        
}

async function addTweet(tweets) {
    try {
        const tweetAuthorObj = await appOnlyClient.v2.user(tweets[0].author_id)
        const tweetAuthor = tweetAuthorObj.data.username
    
        var tweetUrl = new Array()
        for (i=0;i<tweets.length;i++){
            tweetUrl[i] = "https://twitter.com/twitter/status/"
            tweetUrl[i] = tweetUrl[i].concat(tweets[i].id)
            
            const response = await notion.pages.create(
            {
            parent: { database_id: databaseId },

            properties: {
                title: { 
                title:[
                    {
                    "text": {
                        "content": tweets[i].text
                    }
                    }
                ]
                },
                "source": {
                    "type": "select",
                    "select": {
                        'name':'twitter'
                    }
                },
                "date":{
                    date : {
                        "start" : tweets[i].created_at
                    } 
                },
                "url":{
                    "type":"url",
                    "url": tweetUrl[i]
                },
                "username/alias":{
                    "rich_text": [{
                        "text" : {
                            "content" : tweetAuthor
                        }
                    }]
                }
            },

            children: [
                {
                    object:"block",
                    type: "embed",
                    'embed': {
                      "url": tweetUrl[i]
                    }
                  }
            ]
            })

        }

        console.log("Twitter integration ran successfully.")
    } catch (error) {
        console.log(error)
    }

}

module.exports = {twitterIntegration};