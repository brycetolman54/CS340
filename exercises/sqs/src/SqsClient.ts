import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(): Promise<void> {
  const sqs_url = "https://sqs.us-east-1.amazonaws.com/745138876849/bat54tweeter";
  const messageBody = "Hello there Pickle... we meet again";

  const params = {
    DelaySeconds: 10,
    MessageBody: messageBody,
    QueueUrl: sqs_url,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
  } catch (err) {
    throw err;
  }
}

sendMessage();
