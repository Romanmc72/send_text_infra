export const TFSTATE_BUCKET_PREFIX = 'send-text-infra-state-bucket';

/**
 * Returns the name of the terraform state bucket given the aws account id
 * @param awsAccountId The AWS Account Id inside of which this bucket lives
 * @returns the name of the state bucket for this account
 */
export function getTfstateBucketName(awsAccountId: string): string {
  return `${TFSTATE_BUCKET_PREFIX}-${awsAccountId}`;
}

/**
 * given the bucket name, retrieve the arn without using token references
 * @param bucketName the name of the bucket
 * @returns the arn of the bucket
 */
export function getBucketArn(bucketName: string): string {
  return `arn:aws:s3:::${bucketName}`;
}
