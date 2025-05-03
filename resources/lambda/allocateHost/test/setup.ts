import { mockClient } from 'aws-sdk-client-mock';
import { EC2Client } from '@aws-sdk/client-ec2';

const ec2Mock = mockClient(EC2Client);

beforeEach(() => {
    ec2Mock.reset();
});

afterEach(() => {
    jest.clearAllMocks();
});
