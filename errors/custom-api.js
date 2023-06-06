class CustomAPIError extends Error {
  constructor(message) {
    console.log('custom')
    super(message)
  }
}

module.exports = CustomAPIError
