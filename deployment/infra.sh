#!/bin/bash
set -e

env=$1
project=gotron
domain=gotronmusic.com

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $domain
echo ====================================================================================

echo deploy AWS infrastructure...
cd ../backend
npm i
npm run pre:deploy
aws cloudformation package --template-file aws/cloudformation/infra.yaml --output-template-file packaged.yaml --s3-bucket gotron-cf-midway-ap-southeast-1
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-infra-stack --parameter-overrides TargetEnvr=$env Project=$project Domain=$domain --no-fail-on-empty-changeset --s3-bucket gotron-cf-midway-ap-southeast-1 --capabilities CAPABILITY_NAMED_IAM
echo ====================================================================================
