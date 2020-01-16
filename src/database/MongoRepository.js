const Repository = require("./Repository.js");

const transformProps = require("transform-props")
const castToString = arg => String(arg)

module.exports = class MongoRepository extends Repository {
  constructor(mongoose, model) {
    super()

    if (!mongoose || !model) throw new Error('Mongoose model cannot be null.')
    this.mongoose = mongoose

    this.model = typeof model === 'string' ? mongoose.model(model) : model
  }

  get size() {
    return this.model.countDocuments();
  }

  parse(entity) {
    return entity ? transformProps(entity.toObject({ versionKey: false }), castToString, '_id') : null
  }

  add(entity) {
    return this.model.create(entity).then(this.parse);
  }

  get(id, projection) {
    return this.model
      .findById(id, projection)
      .then(e => e && this.parse(e) || this.add({ _id: id, ...(this.getParse()) }));
  }

  remove(id) {
    return this.model.findOneAndDelete({ _id: id }).then(this.parse);
  }

  findOne(id, projection) {
    return this.model.findById(id, projection).then(this.parse);
  }

  findAll(projection, types) {
    return this.model.find({}, projection, types).then(e => e.map(this.parse));
  }

  update(id, entity, options = { upsert: true }) {
    return this.model.updateOne({ _id: id }, entity, options);
  }

  length(filter) {
    return this.model.countDocuments(filter);
  }
}