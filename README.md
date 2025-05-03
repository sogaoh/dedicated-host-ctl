# Dedicated Host Ctl

```
├── main.asl.yaml                     # メインワークフロー（全体の定義・連結）
├── steps/
│   ├── allocate_host.asl.yaml        # 専有ホスト割り当て
│   ├── get_latest_ami.asl.yaml       # 最新AMI取得
│   ├── run_instance.asl.yaml         # EC2インスタンス起動
│   ├── stop_instance.asl.yaml        # インスタンス停止
│   ├── create_ami.asl.yaml           # AMI作成
│   ├── terminate_instance.asl.yaml   # インスタンス終了
│   ├── release_host.asl.yaml         # 専有ホスト解放
│   └── notify.asl.yaml               # （オプション）通知処理など
├── resources/  (yet)
│   ├── lambda/                       # Lambda関数ソース（TypeScript例）
│   │   ├── allocateHost
│   │   ├── getLatestAmi
│   │   ├── runInstance
│   │   ├── shared
│   │   └── ...
│   ├── policies/
│   │   ├── step_functions_policy.json 
│   │   └── dedicated_host_operate_lambda_policy.json
│   └── tf/
│       └── ec2-on-dedicated-host      # EC2インスタンスプロファイル作成用
├── test/
│   └── step_unit_test.asl.yaml   # ステップ単位のテストワークフロー例
├── README.md
└── .gitignore
```


## PreRequirements

- AWS authenticated.


### development 
 
- VSCode
    - AWS ToolKit
- Docker
    - use amazon/aws-stepfunctions-local


### deployment

- terraform
    - latest (v1.11.4)
        - Create EC2onDedicatedHostRole
- aws cli v2
    - latest (v2.26.5)
        - Create StepFunctionsExecutionRole
        - Create DedicatedHostLambdaRole
- Node.js
    - LTS (v22)
- bun
    - latest (v1.2.10)
- lambroll
    - latest (v1.2.2)
        - Deploy lambda functions


## Deployment Procedure

### Necessary Roles 

#### EC2onDedicatedHostRole

```zsh
cd /path/to/resources/tf
```

```zsh
terraform init
terraform plan
```

```zsh
terraform apply
```


#### StepFunctionsExecutionRole

```zsh
cd /path/to/resources/policies
```

```zsh
aws --profile <your_profile> iam create-role \
  --role-name StepFunctionsExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "states.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

```zsh
aws --profile <your_profile> iam put-role-policy \
  --role-name StepFunctionsExecutionRole \
  --policy-name StepFunctionsPolicy \
  --policy-document file://step_functions_policy.json
```


#### DedicatedHostLambdaRole

```zsh
cd /path/to/resources/policies
```

```zsh
aws --profile <your_profile> iam create-policy \
  --policy-name DedicatedHostLambdaPolicy \
  --policy-document file://dedicated_host_operate_lambda_policy.json
```

```zsh
aws --profile <your_profile> iam create-role \
  --role-name DedicatedHostLambdaRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

```zsh
aws --profile <your_profile> iam attach-role-policy \
  --role-name DedicatedHostLambdaRole \
  --policy-arn arn:aws:iam::<your_account_id>:policy/DedicatedHostLambdaPolicy
```

### Necessary Functions

#### allocateHost

```zsh
cd /path/to/resources/lambda/allocateHost
```

```zsh
make deploy
```


#### getLatestAmi

```zsh
cd /path/to/resources/lambda/getLatestAmi
```

```zsh
make deploy
```


#### runInstance

```zsh
cd /path/to/resources/lambda/runInstance
```

```zsh
make deploy
```


### Dedicated Host Control

#### Start

```zsh
aws --profile <your_profile> stepfunctions start-execution \
  --state-machine-arn "arn:aws:states:<your_region>:<your_account_id>:stateMachine:DedicatedHostCtl" \
  --input '{
    "action": "start",
    "InstanceType": "t3.small",
    "SubnetAZ": "ap-northeast-1a",
    "AMIPrefix": "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64",
    "SecurityGroups": ["sg-XXXXXXXX"],
    "Subnet": "subnet-XXXXXXXX",
    "InstanceProfile": "EC2onDedicatedHostRole"
  }'
```


#### Terminate

```zsh
aws --profile <your_profile> stepfunctions start-execution \
  --state-machine-arn "arn:aws:states:<your_region>:<your_account_id>:stateMachine:DedicatedHostCtl" \
  --input '{
    "action": "stop",
    "InstanceId": "i-IIIIIIIIIIIIIIIII",
    "HostId": "h-HHHHHHHHHHHHHHHHH"
  }'
```



## Note 

### Start aws-stepfunctions-local
```zsh
docker run -p 8083:8083 amazon/aws-stepfunctions-local & 
```

### Run tests/step_unit_test

```zsh
cd /path/to/dedicated-host-ctl
```

```zsh
nvm use
```

```zsh
npm install -g yamljs
```

```zsh
# yaml を json に変換
yaml2json tests/step_unit_test.asl.yaml > tests/step_unit_test.asl.json
```

```zsh
aws stepfunctions create-state-machine \
  --endpoint-url http://localhost:8083 \
  --definition file://tests/step_unit_test.asl.json \
  --name TestStateMachine \
  --role-arn arn:aws:iam::123456789012:role/DummyRole \
  --profile <your_profile> \
  --region <your_region> 
```


### Run Lambda functions test

```zsh
cd /path/to/resources/lambda/**
```

```zsh
bun install
```

```zsh
bun test
```


### Update state-machine

```zsh
cd /path/to/root
```

```zsh
yq -o=json main.asl.yaml > main.asl.json
```

```zsh
aws stepfunctions update-state-machine \           
  --state-machine-arn "arn:aws:states:ap-northeast-1:<your_account_id>:stateMachine:DedicatedHostCtl" \
  --definition file://main.asl.json \
  --profile <your_profile>
```


## Others

- https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html
