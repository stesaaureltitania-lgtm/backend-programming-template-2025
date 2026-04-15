module.exports = (db) =>
  db.model(
    'GachaPrize',
    db.Schema({
      id: { type: Number, required: true, unique: true },
      name: { type: String, required: true },
      quota: { type: Number, required: true },
      remaining: { type: Number, required: true },
    })
  );
