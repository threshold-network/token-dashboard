export const getColorFromProps = (
  props: any,
  weight: number,
  defaultColorScheme = "brand"
) => {
  return props?.colorScheme !== defaultColorScheme
    ? props?.theme?.colors[props?.colorScheme][weight]
    : null
}
