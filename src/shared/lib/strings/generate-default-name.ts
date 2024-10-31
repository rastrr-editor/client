/**
 * Function generates a string based on param defaultName.
 * If value of defaultName is existing in existingNames array
 * function recursively produces defaultName value with numeric postfix
 * @param existingNames Array of existing names
 * @param defaultName Default name template
 * @returns Generated string based on defaultName with possible numeric postfix
 */
export default function generateDefaultName(
  existingNames: string[],
  defaultName: string,
): string {
  function iterate(name: string, postfix: number = 0): string {
    const newName = postfix === 0 ? name : `${name} ${postfix}`;

    return existingNames.includes(newName)
      ? iterate(name, postfix + 1)
      : newName;
  }

  return iterate(defaultName);
}
