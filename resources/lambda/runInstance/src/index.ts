import { EC2Client, RunInstancesCommand } from "@aws-sdk/client-ec2";
import type { _InstanceType } from "@aws-sdk/client-ec2"; // 正しい型インポート

interface RunInstanceEvent {
    hostId: string;
    amiId: string;
    instanceType: _InstanceType; // 型定義を修正
    keyName?: string;
    securityGroupIds?: string[];
    subnetId?: string;
}

export const handler = async (event: RunInstanceEvent) => {
    const client = new EC2Client({ region: "ap-northeast-1" });
    const command = new RunInstancesCommand({
        ImageId: event.amiId,
        InstanceType: event.instanceType,
        Placement: { HostId: event.hostId },
        MinCount: 1,
        MaxCount: 1,
        KeyName: event.keyName,
        SecurityGroupIds: event.securityGroupIds,
        SubnetId: event.subnetId,
    });
    const result = await client.send(command);
    return {
        InstanceIds: result.Instances?.map(i => i.InstanceId),
    };
};
