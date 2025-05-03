import { handler } from '@/src';
import { EC2Client, DescribeImagesCommand } from '@aws-sdk/client-ec2';
import { mockClient } from 'aws-sdk-client-mock';

const ec2Mock = mockClient(EC2Client);

describe('getLatestAmi', () => {
    it('最新のAMI IDを返す', async () => {
        const mockImages = {
            Images: [
                { CreationDate: '2025-01-01T00:00:00.000Z', ImageId: 'ami-1111' },
                { CreationDate: '2025-01-02T00:00:00.000Z', ImageId: 'ami-2222' }
            ]
        };

        ec2Mock.on(DescribeImagesCommand).resolves(mockImages);

        // イベントオブジェクトを追加
        const event = {
            owner: "amazon",
            namePattern: "amzn2-ami-hvm-2.0.*-gp3"
        };

        const result = await handler(event);
        expect(result).toEqual({
            ImageId: 'ami-2222' // 戻り値の形式をオブジェクトに合わせる
        });
    });
});
