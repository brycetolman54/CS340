import fs from "fs";

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

s3upload();

async function s3upload() {
  if(process.argv.length !== 3) {
    console.log("Specify the file to upload on the command line");
    process.exit();
  }

  try {
    const client = new S3Client();
    const fileContent = fs.readFileSync(process.argv[2]);

    const params = {
      "Body": fileContent,
      "Bucket": "bat54sdk",
      "Key": "sdkFile",
    }

    const command = new PutObjectCommand(params)
    const response = await client.send(command)

    console.log("File upload successful with ", response.$metadata.httpStatusCode);
  } catch (error) {
    console.log(error);
  }
}

