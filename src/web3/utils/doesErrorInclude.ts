const doesErrorInclude = (error: any, match: string) => {
  return (
    error?.data?.message?.includes(match) || error?.message?.includes(match)
  )
}

export default doesErrorInclude
