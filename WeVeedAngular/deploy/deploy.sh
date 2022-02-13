#/bin/bash
#upload files
aws s3 cp ./dist s3://weveed.cloud.com --recursive --acl public-read