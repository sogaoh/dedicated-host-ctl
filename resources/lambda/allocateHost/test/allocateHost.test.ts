import { handler } from '@/src';
import { EC2Client, AllocateHostsCommand } from '@aws-sdk/client-ec2';
import { mockClient } from 'aws-sdk-client-mock';

const ec2Mock = mockClient(EC2Client);

describe('allocateHost', () => {
    it('正常にホストを割り当てる', async () => {
        ec2Mock.on(AllocateHostsCommand).resolves({
            HostIds: ['h-testhost123']
        });

        const result = await handler({
            instanceType: 't4g.small',
            az: 'ap-northeast-1a'
        });

        expect(result).toEqual({ HostIds: ['h-testhost123'] });
    });
});
