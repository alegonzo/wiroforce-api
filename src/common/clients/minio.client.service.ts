import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from 'minio';

@Injectable()
export class MinioClientService {
    minioClient: Minio.Client;
    defaultBucket: string;

    constructor(private configService: ConfigService) {
        this.defaultBucket = this.configService.get<string>('DEFAULT_BUCKET');
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_HOST_URL'),
            port: parseInt(this.configService.get<string>('MINIO_HOST_PORT')),
            useSSL: false,
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY')
        });
    }

    async createDefaultBucket() {
        if (!await this.minioClient.bucketExists(this.defaultBucket)) {
            await this.minioClient.makeBucket('mybucket', 'us-east-1');
            Logger.warn('Bucket creado');
        }
    }

    setPublicPolicy(): Promise<any> {
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
                        `arn:aws:s3:::${this.defaultBucket}`
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
                        `arn:aws:s3:::${this.defaultBucket}/*`
                    ]
                }
            ]
        };
        return this.minioClient.setBucketPolicy(this.defaultBucket, JSON.stringify(policy));
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