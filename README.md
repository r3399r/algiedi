# algiedi

When we need to deploy a new environment, we need to run `db/infra.sh` once. Then we can run `db/deploy.sh`. After every service built, we need to configure cloudfront alias ans SSL, and DNS record in GoDaddy.

For any modification, we just need to run `db/deploy.sh`.

## install dependencies
docker-compose -f docker-compose.builder.yml run --rm compile
