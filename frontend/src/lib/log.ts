const isBrowser: boolean =
  typeof window !== 'undefined' &&
  window.document != null &&
  window.document.createElement != null

const log = (...args: any) => {
  if (isBrowser) {
    console.log(...args)
  } else {
    console.error(...args)
  }
}

const error = (...args: any) => {
  console.error(...args)
}

const logger = { log, error }

export default logger
export { log, error }
