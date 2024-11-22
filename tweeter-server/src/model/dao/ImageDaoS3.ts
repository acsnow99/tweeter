import { ImageDao } from "./ImageDao";
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

export class ImageDaoS3 implements ImageDao {
    private readonly bucket = "cs340tweeter-images";
    private readonly region = "us-east-1";

    public async putImage(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );
        const s3Params = {
            Bucket: this.bucket,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: this.region });
        try {
            await client.send(c);
            return (
            `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`
            );
        } catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }

    public async getImage(fileName: string) {
        return "Not an image";
    }
}
