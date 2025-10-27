# 📝 Task Manager Microservices Project

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge\&logo=kubernetes\&logoColor=white)](https://kubernetes.io/)
[![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge\&logo=prometheus\&logoColor=white)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge\&logo=grafana\&logoColor=white)](https://grafana.com/)

---

## 🧩 Overview

The **Task Manager** is a **microservices-based application** that allows users to manage their tasks efficiently.
It is built using **Node.js** for authentication and **Python** for task management.
All services are containerized with **Docker**, orchestrated with **Kubernetes (EKS)**, and monitored using **Prometheus** and **Grafana**. 🚀

---

## 📁 Project Structure

```
.github/
 └── workflows/
     └── deploy.yml

auth-service/
 ├── Dockerfile
 ├── app.js
 └── package.json

tasks-service/
 ├── Dockerfile
 ├── app.py
 └── requirements.txt

k8s/
 ├── auth-deployment.yaml
 ├── auth-service.yaml
 ├── auth-servicemonitor.yaml
 ├── tasks-deployment.yaml
 ├── tasks-service.yaml
 ├── tasks-servicemonitor.yaml
 ├── mongodb-statefulset.yaml
 ├── ebs-sc.yaml
 ├── ingress.yaml
```

---

## ⚙️ Microservices Summary

| Service                | Technology | Type         | Port / Access           | Description                           |
| ---------------------- | ---------- | ------------ | ----------------------- | ------------------------------------- |
| **auth-service**       | Node.js    | ClusterIP    | 3000 (internal)         | Handles user authentication and JWT.  |
| **tasks-service**      | Python     | ClusterIP    | 5000 (internal)         | Manages CRUD operations for tasks.    |
| **tasks-loadbalancer** | Python     | LoadBalancer | 80 (external access)    | Exposes the tasks service externally. |
| **mongo**              | MongoDB    | ClusterIP    | 27017 (internal)        | Stores user and task data.            |
| **prometheus**         | Prometheus | ClusterIP    | 9090 (via port-forward) | Monitors application metrics.         |
| **grafana**            | Grafana    | ClusterIP    | 3000 (via port-forward) | Visualizes monitoring dashboards.     |

---

## 🧰 Prerequisites

Ensure you have the following installed locally or in your CI/CD environment:

* 🐳 **Docker**
* ☸️ **kubectl**
* ☁️ **AWS CLI**
* 💻 **Kubernetes cluster** (EKS recommended)

---

## 🚀 Deployment Guide

### **Step 1️⃣ — Build and Push Docker Images**

#### Auth Service (Node.js)

```bash
docker build -t <dockerhub-username>/auth-service:v1 ./auth-service
docker push <dockerhub-username>/auth-service:v1
```

#### Tasks Service (Python)

```bash
docker build -t <dockerhub-username>/tasks-service:v1 ./tasks-service
docker push <dockerhub-username>/tasks-service:v1
```

---

### **Step 2️⃣ — Deploy on Kubernetes**

Apply the manifests in order:

```bash
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/tasks-deployment.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/tasks-service.yaml
kubectl apply -f k8s/ebs-sc.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/auth-servicemonitor.yaml
kubectl apply -f k8s/tasks-servicemonitor.yaml
```

---

### **Step 3️⃣ — Test the Services**

* 🌐 **External Access:**
  Visit the Tasks Service via LoadBalancer:

  ```
  http://<LoadBalancer-IP>/
  ```

* 🔗 **Internal Access (via port-forward):**

  ```bash
  kubectl port-forward svc/auth-service 3000:3000
  kubectl port-forward svc/tasks-service 5000:5000
  ```

---

## 📊 Monitoring Setup

### **Prometheus**

```bash
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```

➡️ Access at: [http://localhost:9090](http://localhost:9090)

### **Grafana**

```bash
kubectl port-forward svc/grafana 3000:3000 -n monitoring
```

➡️ Access at: [http://localhost:3000](http://localhost:3000)

---

## 🧠 Key Highlights

* ✅ Microservices architecture (Node.js + Python)
* 🐳 Containerized with Docker
* ☸️ Deployed on Kubernetes (EKS)
* 💾 Persistent storage with MongoDB
* 📈 Real-time monitoring using Prometheus & Grafana

---

