import { handler } from '@/src';
import { EC2Client, RunInstancesCommand } from '@aws-sdk/client-ec2';
import { mockClient } from 'aws-sdk-client-mock';

const ec2Mock = mockClient(EC2Client);

describe('runInstance', () => {
    it('指定したホスト上にインスタンスを起動する', async () => {
        ec2Mock.on(RunInstancesCommand).resolves({
            Instances: [{
                InstanceId: 'i-1234567890abcdef0',
                PrivateIpAddress: '192.168.1.1'
            }]
        });

        const result = await handler({
            instanceType: 't4g.small',
            hostId: 'h-1234567890abcdef0',
            amiId: 'ami-12345678'
        });

        // InstanceIds配列に値が含まれていることだけ確認
        expect(result).toEqual(
            expect.objectContaining({
                InstanceIds: expect.arrayContaining(['i-1234567890abcdef0'])
            })
        );
    });
});
