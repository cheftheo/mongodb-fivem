# FiveM MongoDB driver
Hello, this is my FiveM MongoDB driver!
Feel free to use it into you projects

### Description
I've developed this one 1 year ago and today I decided to give it public.
Why? The old one which was used on FiveM for a long time was so outdated. So, I created my own one started from the old one ideea.
Why to use mine? Easy to replace, faster, flexible, more logging options.

### How fast?
I've used JavaScript performance method to compare them. I made a simple query to collect all data from collection "users" where id = 1. Down you have the screenshot. 
You can also test it on your machine.

![image](https://github.com/cheftheo/mongodb-fivem/assets/46166826/041fa692-5456-41c5-9eab-cfec87f0c035)

### Better logs?
Ye, it clearly have better logs. 

You have 3 options:
1. No logs (default option, no logs)

![image](https://github.com/cheftheo/mongodb-fivem/assets/46166826/818f7173-44b4-4093-b643-ef98fad87686)

Usage: `mongologger`

2. Only types of logs (update, updateOne, updateMany, find, findOne, findMany, delete, deleteOne, deleteMany, count, insert, insertMany, insertOne)
   
![image](https://github.com/cheftheo/mongodb-fivem/assets/46166826/095710c0-1311-46c9-ab61-6c432f58f91b)
   
Usage: `mongologger`

3. Full log (type + argument)
   
![image](https://github.com/cheftheo/mongodb-fivem/assets/46166826/87ed22e5-f54e-4228-8b65-eb55f27ef143)
   
Usage: `mongologger true`

### How to install? 
Clone this repo into your resource folder. Use NPM to install the dependencies ( `npm install` ).
After, go to `server.js` and edit line `18` with your URL and database name.
Note: don't forget to add it to `server.cfg`

### How to use it?

Methods: update, updateOne, updateMany, find, findOne, findMany, delete, deleteOne, deleteMany, count, insert, insertMany, insertOne

Find:

![image](https://github.com/cheftheo/mongodb-fivem/assets/46166826/13cb8d51-c161-444f-a9d4-13c9f544c80b)

Update: 

![image](https://github.com/cheftheo/mongodb-fivem/assets/46166826/4928d9b4-1893-4264-808a-c75dd561ca36)

Note: These are just some examples. Other queries use the same syntaxes. 

## Final note
This was made some time ago, so is not perfect. If you have any update to do, just open a request. I'm down to any changes.
If you enjoy it, give it a star ⭐
Have fun!
