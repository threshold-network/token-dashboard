type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

export const hashString = async ({
  algorithm = "SHA-256",
  value,
}: {
  algorithm?: HashAlgorithm
  value: string
}) =>
  Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest(algorithm, new TextEncoder().encode(value))
      ),
      (x) => ("0" + x.toString(16)).slice(-2)
    )
    .join("")
