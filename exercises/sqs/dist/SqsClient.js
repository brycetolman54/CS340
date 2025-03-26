"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
let sqsClient = new client_sqs_1.SQSClient();
async function sendMessage() {
    const sqs_url = "https://sqs.us-east-1.amazonaws.com/745138876849/bat54tweeter";
    const messageBody = "Hello there Pickle... we meet again";
    const params = {
        DelaySeconds: 10,
        MessageBody: messageBody,
        QueueUrl: sqs_url,
    };
    try {
        const data = await sqsClient.send(new client_sqs_1.SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    }
    catch (err) {
        throw err;
    }
}
sendMessage();
//# sourceMappingURL=SqsClient.js.map