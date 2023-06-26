import { IamPolicy } from '@cdktf/provider-aws/lib/iam-policy';
import { IamPolicyAttachment } from '@cdktf/provider-aws/lib/iam-policy-attachment';
import { PinpointApp } from '@cdktf/provider-aws/lib/pinpoint-app';
import { PinpointSmsChannel } from '@cdktf/provider-aws/lib/pinpoint-sms-channel';
import { SnsTopic } from '@cdktf/provider-aws/lib/sns-topic';
import { SnsTopicSubscription } from '@cdktf/provider-aws/lib/sns-topic-subscription';
import { Construct } from 'constructs';
import BaseStack, { BaseStackProps } from './base-stack';
import { IamPolicyDocument, IamPolicyStatement } from '../constructs';

/**
 * The properties to initialize the Text Alert Stack
 */
export interface TextAlertStackProps extends BaseStackProps {
  /**
   * The Iam Role Arn that will publish to the sns topic
   */
  iamRoleName: string;
}

/**
 * Creates the sns topic and subscription(s) for sending sms alerts
 */
export default class TextAlertStack extends BaseStack {
  /**
   * initializes the stack
   * @param scope the cdktf app
   * @param id the stack id
   * @param props the stack properties
   */
  constructor(scope: Construct, id: string, props: TextAlertStackProps) {
    super(scope, id, props);

    const appName = 'water-the-plants';
    const topic = new SnsTopic(this, 'sendText', {
      name: appName,
    });

    const policyName = 'allowSendText';
    const policy = new IamPolicy(this, policyName, {
      name: policyName,
      description: 'Grants the ability to publish to the SNS SMS Topic',
      policy: new IamPolicyDocument({
        Statement: [
          new IamPolicyStatement({
            Effect: 'Allow',
            Action: ['sns:Publish'],
            Resource: [topic.arn],
          }),
        ],
      }).toPolicy(),
    });

    new IamPolicyAttachment(this, 'attach-policy', {
      name: 'SendMessages',
      policyArn: policy.arn,
      roles: [props.iamRoleName],
    });

    const pinpointApp = new PinpointApp(this, 'pinpoint', {
      name: appName,
    });
    new PinpointSmsChannel(this, 'new-phone-num', {
      applicationId: pinpointApp.applicationId,
    });

    const phoneNumbers: string[] = [
      '+16306996639',
    ];

    phoneNumbers.forEach((phoneNumber) => {
      new SnsTopicSubscription(this, `subscribeText${phoneNumber}`, {
        endpoint: phoneNumber,
        topicArn: topic.arn,
        protocol: 'sms',
      });
    });
  }
}
