# 🚀 Project map: Expense Tracker Deployment

## 📌 Project Overview

A production-ready deployment of a Microservices-based Expense Tracker application using a modern DevOps stack (Docker, AWS, Kubernetes, Helm, and GitHub Actions).

---

## 🛠 Phase 1: Local Development & Containerization

**Goal:** Ensure the app runs consistently across all environments.

- [ ] Create **Multi-stage Dockerfiles** for Frontend and Backend (Optimization).
- [ ] Write a `docker-compose.yml` to orchestrate the app locally with its environment variables.
- [ ] **Validation:** Run `docker-compose up` and test the app functionality on `localhost`.

---

## 🏗 Phase 2: Infrastructure as Code (Bash Automation)

**Goal:** Provision the AWS environment using scripts (Simulating IaC).

- [ ] **Bash Script 1:** Create a **VPC** (Public/Private Subnets, IGW, NAT Gateway, Route Tables).
- [ ] **Bash Script 2:** Create an **AWS ECR** (Elastic Container Registry) to host private images.
- [ ] **Bash Script 3:** Provision an **AWS EKS Cluster** (using `eksctl` or AWS CLI) with a Managed Node Group.
- [ ] **Validation:** Verify cluster access using `kubectl get nodes`.

---

## ☸️ Phase 3: Kubernetes Orchestration & Helm

**Goal:** Define how the app lives and scales inside the cluster.

- [ ] Create **Kubernetes Manifests** (Deployments, Services, ConfigMaps, Secrets).
- [ ] Package the manifests into a **Helm Chart** for versioning and easy rollbacks.
- [ ] Implement **Nginx Ingress Controller** to manage external access via a single Load Balancer.
- [ ] **Validation:** Deploy manually once using `helm install` to ensure everything is correct.

---

## 🔄 Phase 4: CI/CD Pipeline (GitHub Actions)

**Goal:** Automate the entire lifecycle from code push to production.

- [ ] **Trigger:** On `push` to the `main` branch.
- [ ] **Build Job:** Lint code + Build Docker images with **Git Commit SHA Tags**.
- [ ] **Push Job:** Authenticate with AWS and push images to **ECR**.
- [ ] **Deploy Job:** Update Helm values and trigger a `helm upgrade` on the **EKS** cluster.

---

## 🩺 Phase 5: Reliability & Monitoring (Python Task)

**Goal:** Ensure the system is healthy and notify on failures.

- [ ] Write a **Python Script** to:
  - Perform a Heartbeat check on the Load Balancer URL.
  - Check EKS Node status via AWS SDK (Boto3).
  - Send **Email/Slack notifications** if the site is down (Status Code != 200).
- [ ] (Optional) Deploy this script as a K8s **CronJob**.

---

## 📁 Suggested Folder Structure

```text
.
├── app/                    # Source code
├── docker/                 # Dockerfiles & Compose
├── infra-scripts/          # Bash scripts for VPC/EKS/ECR
├── k8s-helm/               # Helm charts & K8s Manifests
├── monitoring/             # Python health check script
└── .github/workflows/      # CI/CD Pipeline definitions
```
