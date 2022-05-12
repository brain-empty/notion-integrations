a personal project for the most part. i've tried to make it so that other users can use it but i honestly doubt anyone would find it any bit helpful to actually use this. eitherway, i'm keeping the code here just in case.

the only feature it has right now is a adding tweets since last tweet in notion db to the notion db.

SETUP : 

1 -  make a .env file and stash this stuff in it : 

NOTION_KEY=
NOTION_DATABASE_ID=

TWITTER_BEARER_TOKEN=
TWITTER_USERNAME=

you'll have to go find these for yourself. twitter needs you to signup for their api to get the keys while notion key comes from an integration you make and the database ID is specific to the database.

reading the docs will help you work with these well enough

2 - download all the required packages by checking the package.json file