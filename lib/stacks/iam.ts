import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { IamUser } from '@cdktf/provider-aws/lib/iam-user';
import { Construct } from 'constructs';
import BaseStack, { BaseStackProps } from './base-stack';
import { IamPolicyDocument, IamPolicyStatement } from '../constructs';

/**
 * The stack containing the IAM Roles and policies for this app
 */
export default class IamStack extends BaseStack {
  public readonly snsIamRoleName: string;

  /**
   * Initializes the stack
   * @param scope The app this stack lives in
   * @param id The unique id of the stack
   * @param props The properties to initialize the stack
   */
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    const userName = 'textSender';
    const user = new IamUser(this, userName, {
      name: userName,
    });

    const role = new IamRole(this, `${userName}Role`, {
      assumeRolePolicy: new IamPolicyDocument({
        Statement: [
          new IamPolicyStatement({
            Effect: 'Allow',
            Action: ['sts:AssumeRole'],
            Principal: {
              AWS: [user.arn],
            },
          }),
        ],
      }).toPolicy(),
    });

    this.snsIamRoleName = role.name;
  }
}
