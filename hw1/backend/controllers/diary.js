import DiaryModel from "../models/diaryModel.js";

// Get all diaries
export const getDiaries = async (req, res) => {
  try {
    // Find all diaries
    const diaries = await DiaryModel.find({});

    // Return diaries
    return res.status(200).json(diaries);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};

export const getDiaryById = async (req, res) => {
  const { id } = req.params;

  try {
    const diary = await DiaryModel.findById(id);

    return res.status(200).json(diary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a diary
export const createDiary = async (req, res) => {
  const { date, tag, mood, text } = req.body;

  // Create a new diary
  try {
    const newDiary = await DiaryModel.create({ date, tag, mood, text });
    return res.status(201).json(newDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a diary
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { date, tag, mood, text } = req.body;

  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }

    // Update the diary
    if (date !== undefined) existedDiary.date = date;
    if (tag !== undefined) existedDiary.tag = tag;
    if (mood !== undefined) existedDiary.mood = mood;
    if (text !== undefined) existedDiary.text = text;

    // Save the updated diary
    await existedDiary.save();

    // Rename _id to id
    existedDiary.id = existedDiary._id;
    delete existedDiary._id;

    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a diary
export const deleteDiary = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    // Delete the todo
    await DiaryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Diary deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
