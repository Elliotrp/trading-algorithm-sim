export interface StrategyConfigLabel {
   label: string;
   suffix?: string;
   description: string;
}

export type StrategyConfigLabels<T> = {
   [K in keyof T]: StrategyConfigLabel;
};
