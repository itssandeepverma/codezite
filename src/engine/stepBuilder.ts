import { AlgorithmStep, VisualState } from './types';

type StepType = AlgorithmStep['type'];

export interface StepBuilderOptions<TVars extends Record<string, unknown> = Record<string, unknown>> {
  capture: (highlight?: number[], desc?: string, vars?: TVars) => VisualState;
}

export function createStepBuilder<TVars extends Record<string, unknown> = Record<string, unknown>>(
  steps: AlgorithmStep[],
  opts: StepBuilderOptions<TVars>
) {
  return function pushStep({
    id,
    type,
    codeLine,
    description,
    vars,
    highlight
  }: {
    id: string;
    type: StepType;
    codeLine: number;
    description: string;
    vars?: TVars;
    highlight?: number[];
  }) {
    steps.push({
      id,
      type,
      codeLine,
      description,
      vars: (vars as Record<string, unknown>) || {},
      state: opts.capture(highlight, description, vars)
    });
  };
}
