import asyncio
import schedule
import datetime
from pymongo import MongoClient

# Establish a connection to the database
client = MongoClient("mongodb+srv://root:IhvkxnDwROpiDZpd@jsx.nwqtn5o.mongodb.net/users", port=1017)

# Get the database
db = client['users']

# Get the collection
collection = db['users']

async def deleteUnconfirmedUsers():
   
    currentTime = datetime.datetime.now()
    print('SCRIPT IS RUNNING')

    # Check if the connection is successful
    if client is not None:
        print(f"Connected to database '{db.name}'")
    else:
        print("Connection failed")
    

    # Calculate the timestamp for 2 minutes ago
    twoMinutesAgo = currentTime - datetime.timedelta(minutes=2)

    # Find all users that are unconfirmed and have a confirmation token expiration time
    # earlier than 2 minutes ago
    unconfirmedUsers = collection.find({'active': False, 'confirmationTokenExpirationTime': {'$lt': twoMinutesAgo}})
    userCount = collection.count_documents({'active': False}) # count the number of unconfirmed users
    print(f"Found {userCount} unconfirmed user(s).")
    if userCount > 0:
       for user in unconfirmedUsers:
            print(user)
            collection.delete_one({'_id': user['_id']})
    else:
      print("No unconfirmed user was found.")
  
    
def run_delete_unconfirmed_users():
    asyncio.run(deleteUnconfirmedUsers())

# Run the function every 5 seconds
schedule.every(5).seconds.do(run_delete_unconfirmed_users)

while True:
    schedule.run_pending()
    asyncio.sleep(1)
