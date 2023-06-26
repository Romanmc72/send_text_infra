import { DataAwsCallerIdentity } from '@cdktf/provider-aws/lib/data-aws-caller-identity';
import { KmsKey } from '@cdktf/provider-aws/lib/kms-key';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { S3Bucket } from '@cdktf/provider-aws/lib/s3-bucket';
import { S3BucketPolicy } from '@cdktf/provider-aws/lib/s3-bucket-policy';
import { S3BucketServerSideEncryptionConfigurationA } from '@cdktf/provider-aws/lib/s3-bucket-server-side-encryption-configuration';
import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { getBucketArn, getTfstateBucketName } from '../constants';
import { IamPolicyDocument, IamPolicyStatement } from '../constructs';

/**
 * holds the remote state backend bucket
 */
export default class StateStack extends TerraformStack {
  /**
   * initializes the stack
   * @param scope the cdktf app
   * @param id the stack id
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new AwsProvider(this, 'aws', { profile: 'default' });
    const identity = new DataAwsCallerIdentity(this, 'identity', {});

    const encryptionKey = new KmsKey(this, 'encrypt', {
      description: 'Terraform State Bucket Contents',
      enableKeyRotation: true,
    });

    const bucketName = getTfstateBucketName(identity.accountId);

    const bucket = new S3Bucket(this, 'terraform-state', {
      bucket: bucketName,
      versioning: { enabled: true },
    });

    new S3BucketPolicy(this, 'secure-transport', {
      bucket: bucket.bucket,
      policy: new IamPolicyDocument({
        Statement: [
          new IamPolicyStatement({
            Effect: 'Deny',
            Action: ['*'],
            Principal: '*',
            Resource: [
              getBucketArn(bucketName),
              `${getBucketArn(bucketName)}/*`,
            ],
            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
          }),
        ],
      }).toPolicy(),
    });

    new S3BucketServerSideEncryptionConfigurationA(this, 'encrypt-bucket', {
      bucket: bucket.bucket,
      rule: [{
        applyServerSideEncryptionByDefault: {
          kmsMasterKeyId: encryptionKey.keyId,
          sseAlgorithm: 'aws:kms',
        },
        bucketKeyEnabled: true,
      }],
    });
  }
}
