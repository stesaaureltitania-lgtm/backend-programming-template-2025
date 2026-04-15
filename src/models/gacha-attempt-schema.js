module.exports = (db) =>
  db.model(
    'GachaAttempt',
    db.Schema({
      userId: { type: String, required: true },
      prizeWon: {
        type: db.Schema.Types.ObjectId,
        ref: 'GachaPrize',
        default: null,
      },
      date: { type: Date, default: Date.now },
    })
  );
