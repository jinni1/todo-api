import mongoose from 'mongoose';

//Schema 정의
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      /*validate: {
        validator: function (title) {
          return title.split(' ').length > 1;
        },
        message : 'Must contain at least 2 words',
      },*/
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model('Task', TaskSchema); 

export default Task;