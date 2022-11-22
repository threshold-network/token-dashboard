const hashString = async ({
  algorithm = "SHA-256",
  string,
}: {
  algorithm?: string
  string: string
}) =>
  Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest(algorithm, new TextEncoder().encode(string))
      ),
      (x) => ("0" + x.toString(16)).slice(-2)
    )
    .join("")

export default hashString
