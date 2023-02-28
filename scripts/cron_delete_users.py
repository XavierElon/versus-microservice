import time
import schedule
import datetime
from pymongo import MongoClient

def connect_to_database():
    client = MongoClient("mongodb+srv://root:IhvkxnDwROpiDZpd@jsx.nwqtn5o.mongodb.net/users", port=1017)
    db = client['users']
    collection = db['users']
    return collection

collection = connect_to_database()

def deleteUnconfirmedUsers():
    currentTime = datetime.datetime.now()
    print('SCRIPT IS RUNNING')

    # Check if the connection is successful
    if collection is not None:
        print(f"Connected to database '{collection.database.name}'")
    else:
        print("Connection failed")

    # Calculate the timestamp for 2 minutes ago
    twoMinutesAgo = currentTime - datetime.timedelta(minutes=2)
    # Get the count of unconfirmed users
    user_count = collection.count_documents({'active': False, 'confirmationTokenExpirationTime': {'$gte': twoMinutesAgo}})
    print(f"Found {user_count} unconfirmed user(s).")
    # Delete all users that are unconfirmed and have a confirmation token expiration time
    # earlier than 2 minutes ago
    deleted = collection.delete_many({'active': False, 'confirmationTokenExpirationTime': {'$gte': twoMinutesAgo}})
    print(f"Deleted {deleted.deleted_count} unconfirmed user(s).")
        # Get the count of unconfirmed users
  
       

def run_delete_unconfirmed_users():
    deleteUnconfirmedUsers()

# Run the function every 5 seconds
schedule.every(5).seconds.do(run_delete_unconfirmed_users)

while True:
    schedule.run_pending()
    time.sleep(1)
