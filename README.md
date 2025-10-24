# Task Manager Project

This project demonstrates a full-stack Node.js application deployed on Kubernetes with Docker, including monitoring via Prometheus and Grafana.

## Project Structure

- `src/` - Application source code
- `docker/` - Dockerfiles for each service
- `k8s/` - Kubernetes manifests
- `.gitignore` - Git ignore file

## Services

| Service         | Type          | Port/Access                        |
|-----------------|---------------|-----------------------------------|
| auth            | ClusterIP     | 3000 (internal)                   |
| tasks           | ClusterIP     | 5000 (internal)                   |
| tasks-loadbalancer | LoadBalancer | 80 (external access)              |
| mongo           | ClusterIP     | 27017 (internal)                  |
| prometheus      | ClusterIP     | 9090 (via port-forward)           |
| grafana         | ClusterIP     | 3000 (via port-forward)           |

## Prerequisites

- Docker
- kubectl
- AWS CLI
- Kubernetes cluster (EKS recommended)

## Deployment Steps

1. Build Docker images:

```bash
docker build -t <dockerhub-username>/auth-service:v1 ./docker/auth
docker build -t <dockerhub-username>/tasks-service:v1 ./docker/tasks
docker push <dockerhub-username>/auth-service:v1
docker push <dockerhub-username>/tasks-service:v1
Apply Kubernetes manifests:

bash
Copy code
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/tasks-deployment.yaml
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml
Test services via LoadBalancer or port-forward.

Monitoring
Prometheus: kubectl port-forward svc/prometheus-operated 9090 -n monitoring

Grafana: kubectl port-forward svc/grafana 3000:3000 -n monitoring