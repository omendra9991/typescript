import { model, Schema, Model, Document } from 'mongoose';

export interface ITask extends Document {
    catName: string;
    description: string;
    catImages: any;
    createDate: string;
    updatedDate: string;
    createdBy: string;
    updatedBy: string;
}

const TaskSchema: Schema = new Schema({
    catName: { type: String, required: true },
    description: { type: String, required: false },
    catImages:{type:Array},
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false }
});

export const TaskModel: Model<ITask> = model<ITask>('todos', TaskSchema);