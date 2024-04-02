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

# echo execute db scripts...
# cd ../db
# host=$(aws cloudformation list-exports --query "Exports[?Name=='$project-$env-db-endpoint'].Value" --no-paginate --output text)
# port=$(aws cloudformation list-exports --query "Exports[?Name=='$project-$env-db-port'].Value" --no-paginate --output text)
# user=$(aws cloudformation list-exports --query "Exports[?Name=='$project-$env-db-username'].Value" --no-paginate --output text)
# pwd=$(aws ssm get-parameter --name $project-$env-db-pwd | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# mysqlsh --host=$host --user=$user --password=$pwd --database=$project < deploy.sql
# echo ====================================================================================

echo deploy backend AWS...
cd ../backend
docker-compose -f docker-compose.builder.yml run --rm install
docker-compose -f docker-compose.builder.yml run --rm pre-deploy
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project Domain=$domain --no-fail-on-empty-changeset --s3-bucket gotron-cf-midway-ap-southeast-1 --capabilities CAPABILITY_NAMED_IAM
docker-compose -f docker-compose.builder.yml run --rm compile
rm -rf ../frontend/src/model/backend
cp -R lib/src/model ../frontend/src/model/backend
echo ====================================================================================

# echo deploy frontend to S3...
# cd ../frontend
# npm i
# npm run pre:deploy
# aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
# echo ====================================================================================
