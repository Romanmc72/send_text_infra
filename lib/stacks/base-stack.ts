import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { TerraformStack, S3Backend } from 'cdktf';
import { Construct } from 'constructs';
import { Stage, getTfstateBucketName } from '../constants';
import StateStack from './state';

/**
 * The basic properties required to initialize the stack
 */
export interface BaseStackProps {
  /**
   * the stack that creates the remote state bucket
   */
  stateStack: StateStack;
  /**
   * the particular stage to deploy to
   */
  stage: Stage;
}

/**
 * This class is meant to be extended by any others wishing to use the s3
 * remote state backend
 */
export default class BaseStack extends TerraformStack {
  /**
   * The AWS provider this stack uses
   */
  public readonly provider: AwsProvider;

  /**
   * initializes the stack
   * @param scope the cdktf app
   * @param id the unique stack id
   * @param props the properties to create the stack
   */
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id);
    this.provider = new AwsProvider(this, 'aws', {
    });
    new S3Backend(this, {
      bucket: getTfstateBucketName(props.stage.accountId),
      key: `${id}/terraform.tfstate`,
      region: 'us-east-1',
    });
    this.addDependency(props.stateStack);
  }
}
