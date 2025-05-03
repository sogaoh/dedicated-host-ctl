import { EC2Client, AllocateHostsCommand } from "@aws-sdk/client-ec2";

interface AllocateHostEvent {
    az: string;
    instanceType: string;
    tags?: { Key: string; Value: string }[];
}

export const handler = async (event: AllocateHostEvent) => {
    const client = new EC2Client({ region: "ap-northeast-1" });
    const command = new AllocateHostsCommand({
        AvailabilityZone: event.az,
        InstanceType: event.instanceType,
        Quantity: 1,
        TagSpecifications: event.tags
            ? [
                {
                    ResourceType: "dedicated-host",
                    Tags: event.tags,
                },
            ]
            : undefined,
    });
    const result = await client.send(command);
    return {
        HostIds: result.HostIds,
    };
};
