const mongoose = require("mongoose");
const { Schema } = mongoose;

const IsssueSchema = new Schema({
    
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    },
},
{ timestamps:true }
);

const Issue = mongoose.model("Issue", IsssueSchema);
module.exports = Issue;