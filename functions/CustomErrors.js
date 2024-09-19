class InvalidURLError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidURLError';
    }
  }
  
  class EmptyTextError extends Error {
    constructor(message) {
      super(message);
      this.name = 'EmptyTextError';
    }
  }
  
  class InvalidColorError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidColorError';
    }
  }
  
  module.exports = { InvalidURLError, EmptyTextError, InvalidColorError };
  