// TODO: Add dashed lines from node to items.
export const Tree = {
  parts: ["node", "item"],
  baseStyle: (props: any) => {
    return {
      node: {
        listStyle: "none",
      },
      item: {
        m: 4,
        ul: {
          pl: 4,
        },
      },
    }
  },
}
