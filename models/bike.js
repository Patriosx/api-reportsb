const mongoose = require("mongoose");
const User = require("./user");
const BikeSchema = mongoose.Schema(
  {
    brand: { type: String },
    model: { type: String },
    license: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String },
    img: [{ type: String }],
    owner: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

BikeSchema.statics.addStolenBike = addStolenBike;
BikeSchema.statics.removeStolenBike = removeStolenBike;
//Methods

module.exports = mongoose.model("bike", BikeSchema, "bikes");

function addStolenBike(bikeInfo) {
  if (!bikeInfo.color) throw new Error("color require");
  if (!bikeInfo.type) throw new Error("type require");
  if (!bikeInfo.license) throw new Error("license require");

  return User.findById(bikeInfo.owner).then((user) => {
    if (!user) throw new Error("user not found");
    const newBike = new this(bikeInfo);
    //Sessions & transacions
    let session = null;
    return mongoose
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();
        //create a stolen bike
        newBike.save({
          session,
        });
        user.stolenBikes.push(newBike);
        user.save({
          session,
        });
        session.commitTransaction();
      })
      .then(() => session.endSession())
      .catch((err) => session.abortTransaction());
  });
}
function removeStolenBike(bikeId) {
  return this.findById(bikeId)
    .populate("owner")
    .then(async (bike) => {
      if (!bike) throw new Error("bike not found");
      //   console.log(bike);
      //   console.log(bike.owner.stolenBikes);
      //   owner.stolenBikes.pull(bike);
      //   console.log("bike", bike);

      /* */ let session = null;
      return mongoose
        .startSession()
        .then((_session) => {
          session = _session;
          session.startTransaction();
          //create a stolen bike
          bike.remove({
            session,
          });
          bike.owner.stolenBikes.pull(bikeId);
          bike.owner.save({
            session,
          });
          session.commitTransaction();
        })
        .catch((err) => session.abortTransaction());
      /**/
    });
}
