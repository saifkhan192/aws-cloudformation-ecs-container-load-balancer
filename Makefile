createService:
	aws cloudformation create-stack \
	--stack-name core-service4 \
	--template-body file://./cloudformation/service.template-01.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=Subnet1ID,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=Subnet2ID,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=VPCID,ParameterValue=vpc-0d2f42a0b63b821ce

updateService:
	aws cloudformation update-stack \
	--stack-name core-service4 \
	--template-body file://./cloudformation/service.template-01.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=Subnet1ID,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=Subnet2ID,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=VPCID,ParameterValue=vpc-0d2f42a0b63b821ce


createPipeline:
	aws cloudformation create-stack \
	--stack-name core-pipeline1 \
	--template-body file://./cloudformation/pipeline.template-02.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=RepoToken,ParameterValue=${REPO_TOKEN}

updatePipeline:
	aws cloudformation update-stack \
	--stack-name core-pipeline1 \
	--template-body file://./cloudformation/pipeline.template-02.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=RepoToken,ParameterValue=${REPO_TOKEN}

listTasks:
	# aws ecs list-tasks
	# aws ecs describe-services --cluster core-service-cluster --services core-service-ecs-sevice-app
	# aws ecs list-tasks --cluster core-service-cluster
	aws ecs describe-tasks --cluster core-service-cluster --tasks 7d4ff433621b4ea1908ad246437ad7ca


sshApp:
	aws ecs execute-command --cluster core-service-cluster \
    --task c69cd070b6734d80807ff0f0a490d12b \
    --container demo-app \
    --interactive \
    --command "/bin/sh"

sshWorker:
	aws ecs execute-command --cluster core-service-cluster \
    --task 9af3f0ad4f3545a39838db88a8aad792 \
    --container demo-worker \
    --interactive \
    --command "/bin/sh"

viewTask:
	aws ecs describe-task-definition --task-definition deployment-example-task:7

createQueue:
	aws cloudformation create-stack \
	--stack-name queue-example \
	--template-body file://./cloudformation/queue-template-03.yaml \
	--capabilities CAPABILITY_NAMED_IAM

updateQueue:
	aws cloudformation update-stack \
	--stack-name queue-example \
	--template-body file://./cloudformation/queue-template-03.yaml \
	--capabilities CAPABILITY_NAMED_IAM


createEvents:
	aws cloudformation create-stack \
	--stack-name core-events \
	--template-body file://./cloudformation/events-template-04.yaml \
	--capabilities CAPABILITY_NAMED_IAM

updateEvents:
	aws cloudformation update-stack \
	--stack-name core-events \
	--template-body file://./cloudformation/events-template-04.yaml \
	--capabilities CAPABILITY_NAMED_IAM

createDb:
	aws cloudformation create-stack \
	--stack-name core-db \
	--template-body file://./cloudformation/pg-database-template-06.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
	  ParameterKey=PrivateSubnet01,ParameterValue=subnet-0d44e5591ef0265cc \
	  ParameterKey=PrivateSubnet02,ParameterValue=subnet-0e84c66e76411d923 \
	  ParameterKey=PrivateSubnet03,ParameterValue=subnet-08b50ef9db08aafbb \
	  ParameterKey=DatabaseName,ParameterValue=coredb


updateDb:
	aws cloudformation update-stack \
	--stack-name core-db \
	--template-body file://./cloudformation/pg-database-template-06.yaml \
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
