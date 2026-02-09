#!/usr/bin/env bash
# Creates the initial AWS Secrets Manager secret in Localstack
set -euo pipefail

SECRET_NAME="${SECRET_MANAGER_APP_CONFIG_PATH:-saleor-app-config}"
ENDPOINT="http://localhost:4566"

echo "Creating secret '${SECRET_NAME}' in Localstack..."

awslocal secretsmanager create-secret \
  --name "${SECRET_NAME}" \
  --secret-string '{}' \
  --region "${AWS_REGION:-us-east-1}" \
  2>/dev/null || echo "Secret already exists, skipping."

echo "Localstack secrets initialized."
