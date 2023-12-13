export function setTimeout(callback: VoidFunction, duration: number) {
  let requestId: number
  let start: number | null = null

  const loop = (timestamp: number) => {
    if (!start) {
      start = timestamp
    }

    if (timestamp - start < duration) {
      requestId = requestAnimationFrame(loop)
    } else {
      callback()
    }
  }

  requestId = requestAnimationFrame(loop)
  return requestId
}

export function clearTimeout(requestId: number) {
  cancelAnimationFrame(requestId)
}
