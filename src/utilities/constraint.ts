type AtLeastOne<T, Keys extends keyof T = keyof T> =
  Keys extends keyof T
  ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
  : never;

export type Constraint = AtLeastOne<{
  min?: number;
  max?: number;
}> | {
  exact: number;
};

export const checkConstraint = (constraint: Constraint, value: number): boolean => {
  if ('exact' in constraint) {
    return value === constraint.exact;
  }
  if ('min' in constraint && value < constraint.min!) {
    return false;
  }
  if ('max' in constraint && value > constraint.max!) {
    return false;
  }
  return true;
};
