"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var chatbotcontroller_1 = require("../controllers/chatbotcontroller");
var router = (0, express_1.Router)();
router.get("/", function (_req, res) {
    res.send("Main api route");
});
router.get("/webhook", chatbotcontroller_1.getWebHook);
router.post("/webhook", chatbotcontroller_1.postWebHook);
exports.default = router;
