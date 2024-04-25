# algiedi

When we need to deploy a new environment, we need to run `db/infra.sh` once. Then we can run `db/deploy.sh`. After every service built, we need to configure cloudfront alias ans SSL, and DNS record in GoDaddy.

For any modification, we just need to run `db/deploy.sh`.

## install dependencies
docker-compose -f docker-compose.builder.yml run --rm compile

## work with docker
go to the folder you want to work in docker container and run
```
docker run -dit -v .:/usr/src/app --name algiedi sleavely/node-awscli:18.x
```
then you can use vs-code extenstion, Remote Development, to attach to the container and work in it.