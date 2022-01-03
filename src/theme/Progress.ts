import { getColor, mode } from "@chakra-ui/theme-tools"

// adapted from:  https://codesandbox.io/s/chakra-ui-theme-extension-w5u2n?file=/src/theme/Progress/index.js
const multiSegmentFilledTrack = (props: any) => {
  const { theme, values, max } = props

  const breakpoints = []
  let totalPct = 0
  const trackColor = getColor(theme, mode("gray.100", "gray.600")(props))

  // @ts-ignore
  values.forEach(({ color: fillColor, value }) => {
    // @ts-ignore
    const pct = +Number.parseFloat((value / max) * 100).toFixed(1)

    breakpoints.push(`${fillColor} ${totalPct}%`)

    totalPct += pct
    if (totalPct > max) {
      totalPct = max
    }

    breakpoints.push(`${fillColor} ${totalPct}%`)
  })

  if (totalPct < max) {
    breakpoints.push(`${trackColor} ${totalPct}%`)
    breakpoints.push(`${trackColor} 100%`)
  }

  const gradient = `
    linear-gradient(
    to right,
    ${breakpoints.join(", ")}
  )`

  // Need to override the width specified by style
  return {
    minWidth: "100%",
    bgImage: gradient,
    borderRadius: "full",
  }
}

export const Progress = {
  defaultProps: {
    colorScheme: "whiteAlpha",
  },
  variants: {
    multiSegment: (props: any) => ({
      track: {
        borderRadius: "full",
      },
      filledTrack: multiSegmentFilledTrack(props),
    }),
  },
}
