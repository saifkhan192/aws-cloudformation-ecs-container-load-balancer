# CI/CD Pipeline on AWS environment with dockerized express js app 

## Tools

* Docker / ExpressJs / AWS SDK for JavaScript
* AWS S3
* AWS SQS
* AWS CloudWatch Logs
* AWS CodePipeline
* AWS CodeCommit 
* AWS Elastic Container Registry (ECR)
* AWS EventBridge / EventBridge Rules / EventBus
* AWS Elastic Container Service (ECS)
  + Clutser 
  + Service
  + Task
* AWS Elastic Load Balancer (ELB)
  
## Project 

To deploy nodejs express application using Docker engine and multiple AWS serivices.

## Files 

+ [app.js](./app.js "app.js") is the express app entry point
+ [Dockerfile](./Dockerfile "Dockerfile") contains all the commands to assemble an image
+ [buildspec.yml](./buildspec.yml "buildspec.yml") is collection of build commands and related settings, in YAML format, that CodeBuild uses to run a build
 

## Workflow

+ Source code is stored in Github
+ When source code is updated with new push event, the pipeline is triggered. Below are the list of different stages of pipeline.
  + Build: 
    + AWS uses buildspec.yml file to build the image with the Dockerfile
  + Push:
    + Docker image is pushed to ECR Registry
  + Deploy:
    + Docker image is used to run a container in the ECS Service
+ Nodejs application is reachable with {LoadBalancerUrl} url that is shown in the Output tab of Cloudformation
  
  
 
 ### AWS CodePipeline Stpes 
 
 ![steps codepipeline](./images/1.png)
 

 ### Github WebHook (To trigger aws codepipeline)
 
 ![webhook](./images/3.png)

 ### ECS Tasks 
 
 ![ecs tasks](./images/4.png)
 

 ### Express.js App
 
 ![appnodejs](./images/2.png)

