export interface TransitionBenchmarkQuarter {
  quarter: string;
  value: string;
}

export interface TransitionBenchmarks {
  benchmarkName: string;
  isActive: boolean;
  quarters: TransitionBenchmarkQuarter[];
}

export type TransitionBenchmarkQuarters = TransitionBenchmarkQuarter[];
