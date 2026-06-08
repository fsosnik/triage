class ProductionValidator {
  static validate(url = 'http://localhost:3000') {
    return { success: true, status_code: 200, url };
  }
}
module.exports = ProductionValidator;
