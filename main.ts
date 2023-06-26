import { App } from 'cdktf';
import {
  BaseStackProps,
  IamStack,
  StateStack,
  TextAlertStack,
  STAGES,
} from './lib';

const APP = new App();

STAGES.forEach((stage) => {
  const stateStack = new StateStack(
    APP,
    `terraform-state-${stage.stageName}`,
  );
  const commonProps: BaseStackProps = { stateStack, stage };
  const iamStack = new IamStack(APP, `iam-${stage.stageName}`, commonProps);
  new TextAlertStack(
    APP,
    `send-text-infra-${stage.stageName}`,
    { ...commonProps, iamRoleName: iamStack.snsIamRoleName },
  );
});

APP.synth();
