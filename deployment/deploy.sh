#!/bin/bash
set -e

env=dev
project=gotron
domain=gotronmusic.com

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $domain
echo ====================================================================================

cd ..
npm install
npm run install:frontend
npm run install:backend

echo deploy backend AWS...
npm run pre:deploy:backend
aws cloudformation package --template-file backend/aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket gotron-cf-midway-ap-southeast-1
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project Domain=$domain --no-fail-on-empty-changeset --s3-bucket gotron-cf-midway-ap-southeast-1 --capabilities CAPABILITY_NAMED_IAM
echo ====================================================================================

echo deploy frontend to S3...
npm run pre:deploy:frontend
aws s3 sync frontend/dist s3://$project-$env --delete --cache-control no-cache
echo ====================================================================================
