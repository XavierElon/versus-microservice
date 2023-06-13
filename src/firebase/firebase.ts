import * as admin from 'firebase-admin'

const { initializeApp } = require('firebase-admin/app')

console.log(process.env.DATABASE_URL)

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL
  }),
  databaseURL: 'https://xsj-consulting-ui-7c9e0.firebase.io'
})
