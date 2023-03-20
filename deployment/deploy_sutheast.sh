#!/bin/bash
set -e

env=$1
project=gotron
subDomain=yyy
domain=xxx.com

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $subDomain.$domain
echo ====================================================================================

echo deploy backend AWS...
cd ../backend
aws cloudformation package --template-file aws/cloudformation/ap-southeast-1.yaml --output-template-file packaged.yaml --s3-bucket gotron-cf-midway-ap-southeast-1
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket gotron-cf-midway-ap-southeast-1

cd ..