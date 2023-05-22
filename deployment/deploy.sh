#!/bin/bash
set -e

env=dev
project=gotron

echo ====================================================================================
echo env: $env
echo project: $project
echo ====================================================================================

# echo execute db scripts...
# cd ../db
# host=$(aws cloudformation list-exports --query "Exports[?Name=='$project-$env-db-endpoint'].Value" --no-paginate --output text)
# port=$(aws cloudformation list-exports --query "Exports[?Name=='$project-$env-db-port'].Value" --no-paginate --output text)
# user=$(aws cloudformation list-exports --query "Exports[?Name=='$project-$env-db-username'].Value" --no-paginate --output text)
# pwd=$(aws ssm get-parameter --name $project-$env-db-pwd | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# mysql --host=$host --user=$user --password=$pwd --database=$project < deploy.sql
# echo ====================================================================================

echo deploy backend AWS...
cd ../backend
npm i
npm run pre:deploy
aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket gotron-cf-midway-ap-southeast-1
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project --no-fail-on-empty-changeset --s3-bucket gotron-cf-midway-ap-southeast-1 --capabilities CAPABILITY_NAMED_IAM
npm run copy
# echo ====================================================================================

echo deploy frontend to S3...
# cd ../frontend
# npm i
# npm run pre:deploy
# aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
# echo ====================================================================================
