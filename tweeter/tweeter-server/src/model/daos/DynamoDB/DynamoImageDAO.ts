import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";

export class DynamoImageDAO implements ImageDAO {
    // async function s3upload() {
    //   if(process.argv.length !== 3) {
    //     console.log("Specify the file to upload on the command line");
    //     process.exit();
    //   }
    //   try {
    //     const client = new S3Client();
    //     const fileContent = fs.readFileSync(process.argv[2]);
    //     const params = {
    //       "Body": fileContent,
    //       "Bucket": "bat54sdk",
    //       "Key": "sdkFile",
    //     }
    //     const command = new PutObjectCommand(params)
    //     const response = await client.send(command)
    //     console.log("File upload successful with ", response.$metadata.httpStatusCode);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //     }  async putImage(
    //     fileName: string,
    //     imageStringBase64Encoded: string
    //   ): Promise<string> {
    //     let decodedImageBuffer: Buffer = Buffer.from(
    //       imageStringBase64Encoded,
    //       "base64"
    //     );
    //     const s3Params = {
    //       Bucket: BUCKET,
    //       Key: "image/" + fileName,
    //       Body: decodedImageBuffer,
    //       ContentType: "image/png",
    //       ACL: ObjectCannedACL.public_read,
    //     };
    //     const c = new PutObjectCommand(s3Params);
    //     const client = new S3Client({ region: REGION });
    //     try {
    //       await client.send(c);
    //       return (
    //       `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`
    //   );
    // } catch (error) {
    //   throw Error("s3 put image failed with: " + error);
    // }
    //   }
}
