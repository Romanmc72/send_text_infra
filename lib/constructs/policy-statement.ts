/**
 * The array of possible principals that can assume another role
 */
export type IamPrincipal = {
  /**
   * For AWS Services
   *
   * @example 'ec2.amazonaws.com'
   */
  Service?: string[];
  /**
   * For AWS Accounts and Principal ARN's
   *
   * @example '00123456789'
   */
  AWS?: string[];
  /**
   * For Canonical User of the AWS Account
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/finding-canonical-user-id.html
   * @example '79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be'
   */
  CanonicalUser?: string[];
}

export type IamCondition = {
  Bool: { [key: string]: 'true' | 'false' }
}

export interface IamPolicyStatementInterface {
  /**
   * Whether this policy allows or denies specific actions
   */
  Effect: 'Allow' | 'Deny';
  /**
   * The array of actions that this policy allows or denies
   *
   * @example 's3:ListBucket'
   */
  Action: string[];
  /**
   * The resources to which the policy statement applies
   */
  Resource?: string[];
  /**
   * The principal that is allowed or denied the specific actions
   */
  Principal?: IamPrincipal | string;
  /**
   * The necessary conditions to be met by the principal for the statement to enact
   */
  Condition?: IamCondition;
}

/**
 * No freaking clue why this is not a part of the "batteries included" cdktf
 * AWS Provider, but they expect you to type the JSON out by hand. Get real.
 * Doing that with this class instead.
 */
export class IamPolicyStatement implements IamPolicyStatementInterface {
  public readonly Effect: 'Allow' | 'Deny';

  public readonly Action: string[];

  public readonly Resource?: string[] | undefined;

  public readonly Principal?: IamPrincipal | string | undefined;

  public readonly Condition?: IamCondition | undefined;

  /**
   * Initializes the Iam Policy Document
   * @param props properties to initialize the Iam Policy Document
   */
  constructor(props: IamPolicyStatementInterface) {
    this.Effect = props.Effect;
    this.Action = props.Action;
    if (props.Resource) {
      this.Resource = props.Resource;
    }
    if (props.Principal) {
      this.Principal = props.Principal;
    }
    if (!(props.Resource) && !(props.Principal)) {
      throw new Error(
        'Specify either a resource or a principal for the '
        + 'policy statement, neither was found',
      );
    }
    if (props.Condition) {
      this.Condition = props.Condition;
    }
  }

  public getStatement(): IamPolicyStatementInterface {
    const baseStatement: IamPolicyStatementInterface = {
      Effect: this.Effect,
      Action: this.Action,
    };
    if (this.Principal) {
      baseStatement.Principal = this.Principal;
    }
    if (this.Resource) {
      baseStatement.Resource = this.Resource;
    }
    if (this.Condition) {
      baseStatement.Condition = this.Condition;
    }
    return baseStatement;
  }
}
