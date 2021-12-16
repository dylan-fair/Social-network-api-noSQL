const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ _id: -1})
            .then(data => res.json(data))
            .catch(err => {
                console.log(err)
                res.status(400).json(err);
            })
    },
    getThoughtById({ params }, res) {
        Thought.findOne({_id: params.thoughtId})
            .select('-__v')
            .then(data => {
                if(!data) {
                    res.status(404).json({ message: 'No thought with this id!'})
                    return;
                }
                res.json(data)
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err)
            })
    },
    addThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(data => {
            if(!data) {
                res.status(404).json({ message: 'No user found with this id'})
                return;
            }
            res.json(data);
        })
        .catch(err => res.json(err));
    },
    removeThough({ params }, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
            .then(data => {
               if(!data) {
                   res.status(404).json({ message: 'No thought at this id'})
                   return
               } 
               return User.findByIdAndUpdate(
                    { _id: params.username },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true } 
               )
            })
            .then(data => {
                if(!data) {
                    res.status(404).json({ message: 'No user with this id'})
                    return;
                }
                res.json(data)
            })
            .catch(err => res.json(err))
    },
    addReaction({ params, body }, res ) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(data => {
                if(!data) {
                    res.status(404).json({ message: 'No user at this Id'})
                    return;
                }
                res.json(data)
            })
            .catch(err => res.json(err))
    },
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(data => res.json(data))
            .catch(err => res.json(err))
    }
}

module.exports = thoughtController;