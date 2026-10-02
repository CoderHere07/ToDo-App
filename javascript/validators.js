export const PATTERNS = {
  title: /^[\w\s.,!?'-]{3,60}$/,
  priority: /^(low|medium|high)$/,
  dueDate: /^$|^\d{4}-\d{2}-\d{2}$/, 
};

export function validate({ title, priority, dueDate }) {
  const errors = [];
  if (!PATTERNS.title.test(title.trim())) errors.push("Title must be 3-60 characters & only letters, numbers, spaces, and basic punctuation(. ,!?'-) are allowed");
  if (!PATTERNS.priority.test(priority)) errors.push("Priority select must be low, medium, or high");
  if (!PATTERNS.dueDate.test(dueDate)) errors.push("Date format YYYY-MM-DD or empty");
  if (errors.length) throw new Error(errors.join(" | "));
}