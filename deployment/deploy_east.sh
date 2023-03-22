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

# echo execute db scripts...
# cd ../db
# host=$(aws ssm get-parameter --name $env-db-host | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# user=$(aws ssm get-parameter --name $env-db-user | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# pwd=$(aws ssm get-parameter --name $env-db-pwd | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# cluster=$(aws ssm get-parameter --name $env-db-cluster | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# psql postgresql://$user:$pwd@$host:26257/$cluster.$project -f deploy.sql
# echo ====================================================================================

echo deploy backend AWS...
cd ../backend
npm i
npm run pre:deploy
aws cloudformation package --template-file aws/cloudformation/ap-southeast-1.yaml --output-template-file packaged.yaml --s3-bucket gotron-cf-midway-ap-southeast-1
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket gotron-cf-midway-ap-southeast-1
echo ====================================================================================

echo deploy frontend to S3...
cd ../frontend
npm i
npm run pre:deploy
aws s3 sync ./dist s3://$project-$env-2 --delete --cache-control no-cache
echo ====================================================================================
