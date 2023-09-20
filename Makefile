createService:
	aws cloudformation create-stack \
	--stack-name core-service \
	--template-body file://./service.template-01.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=Subnet1ID,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=Subnet2ID,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=VPCID,ParameterValue=vpc-0d2f42a0b63b821ce \
	  ParameterKey=ContainerName,ParameterValue=core-app

updateService:
	aws cloudformation update-stack \
	--stack-name core-service \
	--template-body file://./service.template-01.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=Subnet1ID,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=Subnet2ID,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=VPCID,ParameterValue=vpc-0d2f42a0b63b821ce \
	  ParameterKey=ContainerName,ParameterValue=core-app


createPipelineCore:
	aws cloudformation create-stack \
	--stack-name core-deployment \
	--template-body file://./pipeline.template-02.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=RepoToken,ParameterValue=${REPO_TOKEN} \
	  ParameterKey=TaskName,ParameterValue=demo-app \
	  ParameterKey=ImageDefinitionFileName,ParameterValue=app-image.json

updatePipelineCore:
	aws cloudformation update-stack \
	--stack-name core-deployment \
	--template-body file://./pipeline.template-02.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=RepoToken,ParameterValue=${REPO_TOKEN} \
	  ParameterKey=TaskName,ParameterValue=demo-app \
	  ParameterKey=ImageDefinitionFileName,ParameterValue=app-image.json

createPipelineWorker:
	aws cloudformation create-stack \
	--stack-name worker-stack \
	--template-body file://./pipeline.template-02.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=RepoToken,ParameterValue=${REPO_TOKEN} \
	  ParameterKey=TaskName,ParameterValue=demo-worker \
	  ParameterKey=ImageDefinitionFileName,ParameterValue=worker-image.json

updatePipelineWorker:
	aws cloudformation update-stack \
	--stack-name worker-stack \
	--template-body file://./pipeline.template-02.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=RepoToken,ParameterValue=${REPO_TOKEN} \
	  ParameterKey=TaskName,ParameterValue=demo-worker \
	  ParameterKey=ImageDefinitionFileName,ParameterValue=worker-image.json



listTasks:
	aws ecs list-tasks

viewTask:
	aws ecs describe-task-definition --task-definition deployment-example-task:7

createQueue:
	aws cloudformation create-stack \
	--stack-name queue-example \
	--template-body file://./queue-template-03.yaml \
	--capabilities CAPABILITY_NAMED_IAM

updateQueue:
	aws cloudformation update-stack \
	--stack-name queue-example \
	--template-body file://./queue-template-03.yaml \
	--capabilities CAPABILITY_NAMED_IAM


createEvents:
	aws cloudformation create-stack \
	--stack-name core-events \
	--template-body file://./events-template-04.yaml \
	--capabilities CAPABILITY_NAMED_IAM

updateEvents:
	aws cloudformation update-stack \
	--stack-name core-events \
	--template-body file://./events-template-04.yaml \
	--capabilities CAPABILITY_NAMED_IAM

createDb:
	aws cloudformation create-stack \
	--stack-name core-db \
	--template-body file://./pg-database-template-06.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=PrivateSubnet01,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=PrivateSubnet02,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=PrivateSubnet03,ParameterValue=subnet-08b50ef9db08aafbb \
	  ParameterKey=DatabaseName,ParameterValue=coredb


updateDb:
	aws cloudformation update-stack \
	--stack-name core-db \
	--template-body file://./pg-database-template-06.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=PrivateSubnet01,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=PrivateSubnet02,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=PrivateSubnet03,ParameterValue=subnet-08b50ef9db08aafbb \
	  ParameterKey=DatabaseName,ParameterValue=coredb

printDbEngines:
	aws rds describe-orderable-db-instance-options --engine postgres --engine-version 11.20 --query "*[].{DBInstanceClass:DBInstanceClass,StorageType:StorageType}|[?StorageType=='gp2']|[].{DBInstanceClass:DBInstanceClass}"  --output text  

listSubnets:
	aws ec2 describe-subnets --filter Name=vpc-id,Values=vpc-0d2f42a0b63b821ce
