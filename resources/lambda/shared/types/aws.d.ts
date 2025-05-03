export interface HostAllocationParams {
    az: string;
    instanceType: string;
    tags?: { Key: string; Value: string }[];
}

export interface AmiSearchParams {
    owner: string;
    namePattern: string;
}

export interface InstanceLaunchParams {
    hostId: string;
    amiId: string;
    instanceType: string;
    keyName?: string;
    securityGroupIds?: string[];
    subnetId?: string;
}
