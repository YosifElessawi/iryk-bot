import { Request, Response } from "express"
import request from "request"
import * as dotenv from "dotenv"
dotenv.config()

const handleMessage: any = (sender_psid: any, received_message: any) => {
  let response: { text: string } | undefined

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response)
}
const handlePostback: any = (sender_psid: any, received_message: any) => {}

const callSendAPI: any = (sender_psid: any, response: any) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  }

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v15.0/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!")
      } else {
        console.error("Unable to send message:" + err)
      }
    }
  )
}

export const getWebHook = (req: Request, res: Response) => {
  // Get my verfiy token
  let verify_token = process.env.MY_VERFIY_TOKEN
  // Parse the query params
  let mode = req.query["hub.mode"]
  let token = req.query["hub.verify_token"]
  let challenge = req.query["hub.challenge"]

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
}

export const postWebHook = (req: Request, res: Response) => {
  let body = req.body

  console.log(`\u{1F7EA} Received webhook:`)
  //console.dir(body, { depth: null })

  // Send a 200 OK response if this is a page webhook
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry: { messaging: any[] }) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0]
      //console.log(webhook_event)

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log("Sender PSID: " + sender_psid)

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback)
      }
    })
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED")
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
}
//curl -X GET "https://iryk.herokuapp.com/webhook?hub.verify_token=iryktoken&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
//curl -H "Content-Type: application/json" -X POST "https://iryk.herokuapp.com/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "hi there!!"}]}]}'
//heroku logs --app iryk
