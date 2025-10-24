from flask import Flask, request, jsonify
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
from pymongo import MongoClient
import os

app = Flask(__name__)
client = MongoClient(os.getenv("MONGO_URI", "mongodb://mongo:27017"))
db = client['taskdb']
tasks = db['tasks']

REQUESTS = Counter('tasks_requests_total', 'Total requests to tasks service')

@app.route('/metrics')
def metrics():
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.route('/tasks', methods=['GET','POST'])
def tasks_route():
    REQUESTS.inc()
    if request.method == 'POST':
        doc = request.json
        res = tasks.insert_one(doc)
        return jsonify({'_id': str(res.inserted_id)}), 201
    else:
        docs = list(tasks.find({}, {'_id':0}))
        return jsonify(docs), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
