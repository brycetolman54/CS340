import fs from "fs";
import {
    S3Client,
    PutObjectCommand,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";

export class DynamoImageDAO implements ImageDAO {
    private readonly BUCKET = "bat54-tweeter-images";
    private readonly REGION = "us-east-1";

    public async putImage(
        imageStringBase64: string,
        imageFileExtension: string,
        alias: string
    ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64,
            "base64"
        );
        let filename = alias + "." + imageFileExtension;
        const s3Params = {
            Bucket: this.BUCKET,
            Key: "image/" + filename,
            Body: decodedImageBuffer,
            ContentType: "image/" + imageFileExtension,
            ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: this.REGION });
        try {
            await client.send(c);
            return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${filename}`;
        } catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}
