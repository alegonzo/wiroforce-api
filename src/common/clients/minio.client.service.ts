import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from 'minio';

@Injectable()
export class MinioClientService {
    minioClient: Minio.Client;
    defaultBucket: string;

    constructor(private configService: ConfigService) {
        this.defaultBucket = this.configService.get<string>('DEFAULT_BUCKET');
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_URL'),
            port: parseInt(this.configService.get<string>('MINIO_PORT')),
            useSSL: false,
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY')
        });
    }

    createBucket() {

    }

    setPolicy(bucketName: string): Promise<any> {
        const policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": [
                            "*"
                        ]
                    },
                    "Action": [
                        "s3:GetBucketLocation",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${bucketName}`
                    ]
                },
                {
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": [
                            "*"
                        ]
                    },
                    "Action": [
                        "s3:GetObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${bucketName}/*`
                    ]
                }
            ]
        };
        return this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    }

    async uploadFileBuffer(path: string, buffer: Buffer): Promise<any> {
        const metaData = {
            'Content-Type': 'application/octet-stream',
            'X-Amz-Meta-Testing': 1234,
            'example': 5678
        }
        return await this.minioClient.putObject(this.defaultBucket, path, buffer, metaData);
    }

    async downloadFile(filename: string) {
        return this.minioClient.getObject(this.defaultBucket, filename);
    }
}