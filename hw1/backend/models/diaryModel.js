import mongoose from "mongoose";

// Create a schema
const diarySchema = new mongoose.Schema(
  {
    date: {
      type: Object,
      required: true,
      default: [0, 0, 0],
    },
    tag: {
      type: Number,
      required: true,
      default: 0,
    },
    mood: {
      type: Number,
      required: true,
      default: 0,
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
  },
  // The second argument is an options object.
  // In this case, we want to rename _id to id and remove __v
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    // This option is to make sure that when a new document is created,
    // the timestamps will be added automatically.
    // You can comment this out to see the difference.
    timestamps: true,
  },
);

// Create a model
const DiaryModel = mongoose.model("Diary", diarySchema);

export default DiaryModel;
