import { getColorFromProps } from "./utils"

export const Badge = {
  defaultProps: {
    variant: "solid",
    size: "md",
    colorScheme: "brand",
  },
  sizes: {
    sm: {
      fontSize: "14px",
      lineHeight: "16px",
      px: "8px",
      py: "4px",
    },
    md: {
      fontSize: "16px",
      lineHeight: "24px",
      px: "12px",
      py: "6px",
    },
  },
  variants: {
    solid: (props: any) => ({
      color: "white",
      backgroundColor: getColorFromProps(props, 500) || "black",
    }),
    outline: (props: any) => {
      return {
        boxShadow: `inset 0 0 0px 1px ${
          getColorFromProps(props, 500) || "black"
        }`,
      }
    },
  },
  baseStyle: {
    borderRadius: "full",
  },
}
