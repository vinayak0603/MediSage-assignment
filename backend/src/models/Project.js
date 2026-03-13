const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// We need an "id" field (virtual in Mongoose)
projectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
