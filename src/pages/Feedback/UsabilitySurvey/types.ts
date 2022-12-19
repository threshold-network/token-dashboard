export interface Row {
  id: RowID
  text: string
  value?: RowValue
}

export enum RowValue {
  StrongDisagree = "STRONGLY_DISAGREE",
  Disagree = "DISAGREE",
  Neutral = "NEUTRAL",
  Agree = "AGREE",
  StronglyAgree = "STRONGLY_AGREE",
}

export enum RowID {
  FrequentUsage = "FREQUENT_USAGE",
  UnnecessarilyComplex = "UNNECESSARILY_COMPLEX",
  EasyToUse = "EASY_TO_USE",
  NeedTechnicalSupportPerson = "NEED_TECHNICAL_SUPPORT_PERSON",
  WellIntegratedFunctions = "WELL_INTEGRATED_FUNCTIONS",
  TooMuchInconsistency = "TOO_MUCH_INCONSISTENCY",
  QuickToLearn = "QUICK_TO_LEARN",
  InconvenientToUse = "INCONVENIENT_TO_USE",
  Confident = "CONFIDENT",
  HighLearningCurve = "HIGH_LEARNING_CURVE",
}
