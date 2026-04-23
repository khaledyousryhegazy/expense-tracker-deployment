#!/bin/bash

set -eu

log_header() {
	echo -e "\n\e[1;34m========================================\e[0m"
	echo -e "\e[1;34m  $1\e[0m"
	echo -e "\e[1;34m========================================\e[0m"
}

log_header "STARTING INFRASTRUCTURE DEPLOYMENT"

echo "[*] Start creating infrastructure"
echo "[*] Creating (expense-frontend, expense-backend) repos in ECR ..."

./create-ecr.sh || {
	echo "❌ ECR Creation Failed"
	exit 1
}

echo "[*] Creating cluster in EKS ..."
./create-cluster.sh || {
	echo "❌ EKS Cluster Creation Failed"
	exit 1
}

log_header "INFRASTRUCTURE BUILD FINISHED SUCCESSFULLY"
