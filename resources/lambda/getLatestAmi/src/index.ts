import { EC2Client, DescribeImagesCommand } from "@aws-sdk/client-ec2";

interface GetLatestAmiEvent {
    owner: string;
    namePattern: string;
}

export const handler = async (event: GetLatestAmiEvent) => {
    const client = new EC2Client({ region: "ap-northeast-1" });
    const command = new DescribeImagesCommand({
        Owners: [event.owner],
        Filters: [
            {
                Name: "name",
                Values: [event.namePattern],
            },
        ],
    });
    const response = await client.send(command);
    if (!response.Images || response.Images.length === 0) {
        throw new Error("No AMI found");
    }
    // 最新作成日のAMIを選ぶ
    const sorted = response.Images.sort((a, b) =>
        (b.CreationDate || "").localeCompare(a.CreationDate || "")
    );
    return {
        ImageId: sorted[0].ImageId,
    };
};
