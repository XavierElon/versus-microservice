#!/bin/bash
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 275136276893.dkr.ecr.us-west-2.amazonaws.com
docker build -t xsj-users-microservice .
docker tag xsj-users-microservice:latest 275136276893.dkr.ecr.us-west-2.amazonaws.com/xsj-users-microservice:latest
docker push 275136276893.dkr.ecr.us-west-2.amazonaws.com/xsj-users-microservice:latest
#sudo aws ecs update-service --cluster xsj-users-microservice-cluster --service xsj-users-microservice-service --force-new-deployment --region us-west-2
