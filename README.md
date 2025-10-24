

# 📝 Task Manager Microservices Project

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) 
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/) 
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

This project is a **microservices-based Task Manager application**, built with **Node.js (Auth Service)** and **Python (Tasks Service)**, deployed on **Kubernetes** with **Docker**. It also includes monitoring using **Prometheus** and **Grafana**. 🚀

---

## 📂 Project Structure

.github/ └── workflows/ └── deploy.yml auth-service/ ├── Dockerfile ├── app.js └── package.json tasks-service/ ├── Dockerfile ├── app.py └── requirements.txt k8s/ ├── auth-deployment.yaml ├── auth-service.yaml ├── auth-servicemonitor.yaml ├── ebs-sc.yaml ├── ingress.yaml ├── mongodb-statefulset.yaml ├── tasks-deployment.yaml ├── tasks-service.yaml └── tasks-servicemonitor.yaml

---

## ⚙️ Services

| Service           | Technology | Type           | Port / Access                   |
|------------------|------------|----------------|--------------------------------|
| auth-service      | Node.js    | ClusterIP      | 3000 (internal)                |
| tasks-service     | Python     | ClusterIP      | 5000 (internal)                |
| tasks-loadbalancer| Python     | LoadBalancer   | 80 (external access)           |
| mongo             | MongoDB    | ClusterIP      | 27017 (internal)               |
| prometheus        | Prometheus | ClusterIP      | 9090 (via port-forward)        |
| grafana           | Grafana    | ClusterIP      | 3000 (via port-forward)        |

---

## 🛠 Prerequisites

- Docker 🐳  
- kubectl ☸️  
- AWS CLI ☁️  
- Kubernetes cluster (EKS recommended)  

---

## 🚀 Deployment Steps

### 1️⃣ Build Docker images

**Auth Service (Node.js):**

```bash
docker build -t <dockerhub-username>/auth-service:v1 ./auth-service
docker push <dockerhub-username>/auth-service:v1

Tasks Service (Python):

docker build -t <dockerhub-username>/tasks-service:v1 ./tasks-service
docker push <dockerhub-username>/tasks-service:v1


---

2️⃣ Apply Kubernetes manifests

kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/tasks-deployment.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/tasks-service.yaml
kubectl apply -f k8s/ebs-sc.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/auth-servicemonitor.yaml
kubectl apply -f k8s/tasks-servicemonitor.yaml


---

3️⃣ Test Services

Access the Tasks Service externally via LoadBalancer 🌐 (e.g., http://<LB-IP>/)

Access internal services using port-forward 🔗 if needed



---

📊 Monitoring

Prometheus:

kubectl port-forward svc/prometheus-operated 9090 -n monitoring

Grafana:

kubectl port-forward svc/grafana 3000:3000 -n monitoring
