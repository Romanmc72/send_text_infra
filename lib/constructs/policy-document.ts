import { IamPolicyStatement } from './policy-statement';

export interface IamPolicyDocumentProps {
  Statement: IamPolicyStatement[];
}

/**
 * The interface defining what exists on an AWS Policy I know there are other
 * fields but I really do not care about those yet.
 */
export interface IamPolicyDocumentInterface
  extends IamPolicyDocumentProps {
    /**
     * Renders the policy as a JSON string
     * @returns The IAM Policy as a JSON String
     */
    toPolicy: () => string;
    /**
     * Add a statement to a policy after the policy document has been generated.
     * This must be done before this.toPolicy() is called otherwise it will not
     * appear in the policy document attached to the IamPolicy
     * @param statement The statement to add to the policy
     */
    addStatement: (statement: IamPolicyStatement) => void
  }

/**
 * No freaking clue why this is not a part of the "batteries included" cdktf
 * AWS Provider, but they expect you to type the JSON out by hand. Get real.
 * Doing that with this class instead.
 */
export default class IamPolicyDocument implements IamPolicyDocumentInterface {
  public readonly Version = '2012-10-17';

  public readonly Statement: IamPolicyStatement[] = [];

  /**
   * Initializes the policy document
   * @param props The properties to initialize the IamPolicyDocument
   */
  constructor(props: IamPolicyDocumentProps) {
    this.Statement = props.Statement;
  }

  public addStatement(statement: IamPolicyStatement): void {
    this.Statement.push(statement);
  }

  public toPolicy(): string {
    return JSON.stringify({
      Version: this.Version,
      Statement: this.Statement.map(
        (statement) => statement.getStatement(),
      ),
    });
  }
}
