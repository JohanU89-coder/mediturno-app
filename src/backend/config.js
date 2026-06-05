const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no esta configurada');
}

module.exports = {
  JWT_SECRET
};
