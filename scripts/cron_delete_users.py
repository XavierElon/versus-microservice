import asyncio
import schedule
import datetime
import uuid
import mongoengine
from mongoengine import Document, StringField, IntField, BooleanField, DateTimeField

mongoengine.connect(db='users', host='mongodb+srv://root:IhvkxnDwROpiDZpd@jsx.nwqtn5o.mongodb.net', port=1017)

class User(Document):
    firstName = StringField(required=True)
    lastName = StringField(required=True)
    email = StringField(required=True)
    mobileNumber = IntField(required=True)
    userName = StringField(required=True)
    password = StringField(required=True)
    confirmationCode = StringField(default=uuid.uuid4().hex)
    confirmationTokenExpirationTime = DateTimeField(null=True)
    active = BooleanField(default=False)
    date = DateTimeField(default=datetime.datetime.utcnow())

async def deleteUnconfirmedUsers():
    currentTime = datetime.datetime.now()
    print('SCRIPT IS RUNNING')
    print(mongoengine.connection)
    print(mongoengine)

    # Calculate the timestamp for 24 hours ago
    twentyFourHoursAgo = currentTime - datetime.timedelta(hours=24)

    # Find all users that are unconfirmed and have a confirmation token expiration time
    # earlier than 24 hours ago
    unconfirmedUsers = User.objects(active=False ) #confirmationTokenExpirationTime__lt=twentyFourHoursAgo
    # Delete each unconfirmed user from the database
    print(unconfirmedUsers)
    for user in unconfirmedUsers:
        await user.remove()

def run_delete_unconfirmed_users():
    asyncio.run(deleteUnconfirmedUsers())

# Run the function every 5 seconds
schedule.every(5).seconds.do(run_delete_unconfirmed_users)

while True:
    schedule.run_pending()
    asyncio.sleep(1)
