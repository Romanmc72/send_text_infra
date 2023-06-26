/**
 * The names for each stage
 */
export enum StageNames {
  PROD = 'prod',
}

/**
 * The properties required for defining a stage to deploy to
 */
export interface Stage {
  /**
   * The Aws Account for this stage
   */
  accountId: string;
  /**
   * Whether or not this is production
   */
  isProd: boolean;
  /**
   * The name of the stage
   */
  stageName: StageNames;
}

/**
 * The production stage
 */
export const PROD: Stage = {
  accountId: '005071865344',
  isProd: true,
  stageName: StageNames.PROD,
};

/**
 * The array of all stages to deploy
 */
export const STAGES: Stage[] = [
  PROD,
];
