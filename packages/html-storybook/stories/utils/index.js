export const argsToString = (args) => {
  let props = '';
  for (const key of Object.keys(args)) {
    props += `${key}="${args[key]}" `;
  }
  return props;
}
