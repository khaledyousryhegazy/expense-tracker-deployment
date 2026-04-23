#!/bin/bash

set -euo pipefail

ECR_NAMES=("expense-frontend" "expense-backend")
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
LOG_FILE="../logs/create-ecr.log"

mkdir -p "$(dirname "$LOG_FILE")"

log_info() {
	INFO_TIME=$(date "+%Y-%m-%d %H:%M:%S")
	echo "[*][INFO]["$INFO_TIME"][$1]" 2>&1 | tee -a "$LOG_FILE"
}

log_error() {
	ERROR_TIME=$(date "+%Y-%m-%d %H:%M:%S")
	echo "[*][ERROR]["$ERROR_TIME"][$1]" 2>&1 | tee -a "$LOG_FILE"
}

log_info "Checking existence of the repository ..."

for repo in "${ECR_NAMES[@]}"; do
	if aws ecr describe-repositories --repository-names "$repo" --region "$REGION" >/dev/null 2>&1; then
		log_error "Repo already exist in your account, skipping ..."
	else
		log_info "Repo not found, creating repo $repo ..."
		aws ecr create-repository \
			--repository-name "$repo" \
			--image-scanning-configuration scanOnPush=true \
			--region "$REGION" >/dev/null
		log_info "$repo Created successfully."
	fi
done
