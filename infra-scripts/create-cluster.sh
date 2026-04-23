#!/bin/bash

set -euo pipefail

CLUSTER_NAME="expense-tracker-cluster"
REGION="us-east-1"
NODE_NAME="expense-tracker-nodes"
KEY_NAME="expense-tracker-instance"
LOG_FILE="../logs/create-cluster.log"

log_info() {
	INFO_TIME=$(date "+%Y-%m-%d %H:%M:%S")
	echo "[*][INFO]["$INFO_TIME"][$1]" 2>&1 | tee -a "$LOG_FILE"
}

log_error() {
	ERROR_TIME=$(date "+%Y-%m-%d %H:%M:%S")
	echo "[*][ERROR]["$ERROR_TIME"][$1]" 2>&1 | tee -a "$LOG_FILE"
}

aws sts get-caller-identity --query Account --output text

if [ $? -eq 0 ]; then
	log_info "Credentials tested, proceeding with the cluster creation."

	if eksctl get cluster --name "$CLUSTER_NAME" --region "$REGION" >/dev/null 2>&1; then
		log_error "Cluster already exist, Skipping creation."
	else
		log_info "Cluster not exist, Creating cluster"

		eksctl create cluster \
			--name "$CLUSTER_NAME" \
			--region "$REGION" \
			--nodegroup-name "$NODE_NAME" \
			--nodes 1 \
			--nodes-min 1 \
			--nodes-max 1 \
			--node-type t3.small \
			--node-volume-size 30 \
			--ssh-access \
			--ssh-public-key "$KEY_NAME" \
			--managed
	fi

	if [ $? -eq 0 ]; then
		log_info "Cluster Setup Completed with eksctl command."
	else
		log_error "Cluster Setup Failed while running eksctl command."
	fi

else
	log_error "Please run aws configure & set right credentials."
	log_error "Cluster setup failed."
fi

log_info "Process completed."
