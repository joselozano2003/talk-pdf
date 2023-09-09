import AWS from 'aws-sdk';

export async function uploadToS3(file: File){
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: "us-west-1"
        });

        const fileKey= 'uploads/' + Date.now().toString() + file.name.replace(" ", "-")

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: fileKey,
            Body: file,
        }

        const upload = s3.putObject(params).on('httpUploadProgress', evt => {
            console.log("uploading to s3", parseInt((evt.loaded * 100 / evt.total).toString())) + "%"
        }).promise();


        await upload.then((data) => {
            console.log("Successfully uploaded to s3", fileKey);
        });

        return Promise.resolve({
            fileKey,
            fileName: file.name,
        });
    }
    catch (error) {
        console.log(error);
    }
}

export function getS3URL(fileKey: string){
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3-us-west-1.amazonaws.com/${fileKey}`;
}