const fs = require("fs").promises;
const path = require("path");
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/aws_config");

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try{
        const data = await s3
        .send(new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            Prefix: "commits/" }));

            const objects = data.Contents || [];

            for(const object of objects){
                const key = object.Key;
                const  commitDir = path.join(
                    commitsPath,
                     path.dirname(key).split("/").pop()
                    );

                    await fs.mkdir(commitDir, { recursive: true });

                    const getParams = {
                    Bucket: S3_BUCKET,
                    Key: key
                };
                 const response = await s3.send(new GetObjectCommand(getParams));

                // const fileContent = await s3.getObject(getParams).promise();
                // await fs.writeFile(path.join(repoPath, key), fileContent.Body);

                // console.log(`Pulled ${key} from S3 and saved to local repository.`);
                // await s3.send(new PutObjectCommand(params));

                 // convert stream to buffer
            const chunks = [];
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            const fileBuffer = Buffer.concat(chunks);

            await fs.writeFile(path.join(repoPath, key), fileBuffer);
            console.log(`Pulled ${key} from S3 and saved to local repository.`);
            }
    }catch(err){
        console.error("Error pulling from S3:", err);
    }
}

module.exports = { pullRepo };