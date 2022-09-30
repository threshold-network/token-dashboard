export const camelCaseToNormal: (
  text: string,
  uppercase?: boolean
) => string = (text, uppercase = false) => {
  const textWithSpaces = text.replace(/([A-Z])/g, " $1")
  const finalText = uppercase
    ? textWithSpaces.toUpperCase()
    : textWithSpaces.toLowerCase()
  return finalText
}
