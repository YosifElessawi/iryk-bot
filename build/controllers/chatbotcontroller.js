"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postWebHook = exports.getWebHook = void 0;
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var getWebHook = function (req, res) {
    // Get my verfiy token
    var verify_token = process.env.MY_VERFIY_TOKEN;
    // Parse the query params
    var mode = req.query["hub.mode"];
    var token = req.query["hub.verify_token"];
    var challenge = req.query["hub.challenge"];
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === verify_token) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        }
        else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};
exports.getWebHook = getWebHook;
var postWebHook = function (req, res) {
    var body = req.body;
    console.log("\uD83D\uDFEA Received webhook:");
    console.dir(body, { depth: null });
    // Send a 200 OK response if this is a page webhook
    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
    }
    else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};
exports.postWebHook = postWebHook;
//curl -X GET "localhost:3000/webhook?hub.verify_token=iryktoken&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
