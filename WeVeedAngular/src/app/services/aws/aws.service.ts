import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  constructor() { }

  public uploadFile(file: any, key: string, bucketName: string, handler: any) {
    AWS.config.accessKeyId = getKey();
    AWS.config.secretAccessKey = getKey();
    AWS.config.update({ region: 'eu-central-1' });
    var bucket = new AWS.S3({ params: { Bucket: bucketName } })
    var params = { Key: key, Body: file } as PutObjectRequest;

    bucket.upload(params, handler);
  }

  public uploadBinaryFile(binaryFile: any, key: string, bucketName: string, handler: any) {
    AWS.config.accessKeyId = getKey();
    AWS.config.secretAccessKey = getKey();
    AWS.config.update({ region: 'eu-central-1' });
    var bucket = new AWS.S3({ params: { Bucket: bucketName } });

    const Buffer = global.Buffer || require('buffer').Buffer;
    let buf = new Buffer(binaryFile.replace(/^data:image\/\w+;base64,/, ""),'base64')

    var params = { Key: key, Body: buf, ContentEncoding: 'base64', ContentType: 'image/png' } as PutObjectRequest;

    bucket.upload(params, handler);
  }

  public uploadBinaryFileWithProgress(binaryFile: any, key: string, bucketName: string, progressHandler: any, finishHandler: any) {
    AWS.config.accessKeyId = getKey();
    AWS.config.secretAccessKey = getKey();
    AWS.config.update({ region: 'eu-central-1' });
    var bucket = new AWS.S3({ params: { Bucket: bucketName } });

    const Buffer = global.Buffer || require('buffer').Buffer;
    let buf = new Buffer(binaryFile.replace(/^data:image\/\w+;base64,/, ""),'base64');

    var params = { Key: key, Body: buf, ContentEncoding: 'base64', ContentType: 'image/png' } as PutObjectRequest;

    bucket.upload(params).on('httpUploadProgress', progressHandler)
      .send(finishHandler);
  }

  public uploadFileWithProgress(file: any, key: string, bucketName: string, progressHandler: any, finishHandler: any) {
    AWS.config.accessKeyId = getKey();
    AWS.config.secretAccessKey = getKey();
    AWS.config.update({ region: 'eu-central-1' });
    var bucket = new AWS.S3({ params: { Bucket: bucketName } });

    var params = { Key: key, Body: file, ContentType: file.type } as PutObjectRequest;
    bucket.upload(params).on('httpUploadProgress', progressHandler)
      .send(finishHandler);
  }
}
