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
    case: { type: mongoose.Types.ObjectId, ref: "case", default: null },
  },
  { timestamps: true }
);

BikeSchema.statics.addStolenBike = addStolenBike;
BikeSchema.statics.removeStolenBike = removeStolenBike;
BikeSchema.statics.addCaseToBike = addCaseToBike;
BikeSchema.statics.searchBike = searchBike;
BikeSchema.statics.getBikes = getBikes;
BikeSchema.statics.departmentResposible = departmentResposible;

//Methods
module.exports = mongoose.model("bike", BikeSchema, "bikes");

async function addStolenBike(bikeInfo) {
  if (!bikeInfo.color) throw new Error("color required");
  if (!bikeInfo.type) throw new Error("type required");
  if (!bikeInfo.license) throw new Error("license required");

  const user = await User.findById(bikeInfo.owner);
  if (!user) throw new Error("user not found");
  const newBike = new this(bikeInfo);
  //Sessions & transacions
  let session = null;
  try {
    const _session = await mongoose.startSession();
    session = _session;
    session.startTransaction();
    //create a stolen bike
    newBike.save({
      session,
    });
    //insert the new bike in the user
    user.stolenBikes.push(newBike);
    user.save({
      session,
    });
    session.commitTransaction();
    const bike = newBike;
    session.endSession();
    return bike;
  } catch (err) {
    return session.abortTransaction();
  }
}

function removeStolenBike(bikeId) {
  return this.findById(bikeId)
    .populate("owner")
    .then((bike) => {
      if (!bike) throw new Error("bike not found");

      let session = null;
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
        .catch(() => session.abortTransaction());
    });
}
//add caseID to bike
function addCaseToBike(bikeId, caseId) {
  return this.findById(bikeId).then((bike) => {
    if (!bike) throw new Error("bike not found");
    bike.case = caseId;
    bike.save();
  });
}
//search bikes by different characteristics
function searchBike(searchTerm) {
  const reg = { $regex: searchTerm, $options: "i" }; // $options: "i" case sensitive
  return this.find({
    $or: [
      { brand: reg },
      { model: reg },
      { license: reg },
      { color: reg },
      { type: reg },
      { desc: reg },
    ],
  });
}
//search bikes by different characteristics and populate cases to reach the department
function departmentResposible(searchTerm) {
  const reg = { $regex: searchTerm, $options: "i" }; // $options: "i" case sensitive
  return this.find({
    $or: [
      { brand: reg },
      { model: reg },
      { license: reg },
      { color: reg },
      { type: reg },
      { desc: reg },
    ],
  }).populate("case");
}
function getBikes() {
  return this.find();
}
