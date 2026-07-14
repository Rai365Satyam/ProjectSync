import express from 'express';
import joi from 'joi';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Project } from '../models/index.js';
import { signup, login } from '../controllers/index.js';

const api = express.Router();

// ==========================================
// 1. JWT AUTHENTICATION MIDDLEWARE
// ==========================================
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: true, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains user ID and email from the token
        next();
    } catch (error) {
        return res.status(403).json({ error: true, message: "Invalid or expired token." });
    }
};

// ==========================================
// 2. PUBLIC AUTH ROUTES (Signup & Login)
// ==========================================
api.post('/signup', signup);
api.post('/login', login);

// ==========================================
// 3. PROTECTED PROJECT ROUTES (Requires Token)
// ==========================================

// Get all projects belonging to the logged-in user
api.get('/projects', authMiddleware, async (req, res) => {
    try {
        const data = await Project.find({ owner: req.user.id }, { task: 0, __v: 0, updatedAt: 0 });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Get a single project (strictly confirming ownership)
api.get('/project/:id', authMiddleware, async (req, res) => {
    if (!req.params.id) return res.status(422).send({ data: { error: true, message: 'Id is require' } });
    try {
        const data = await Project.find({ 
            _id: mongoose.Types.ObjectId(req.params.id), 
            owner: req.user.id 
        }).sort({ order: 1 });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Create a project linked to the authenticated user with assigned users array slot
api.post('/project', authMiddleware, async (req, res) => {
    const projectValidation = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
        assignedUsers: joi.array().items(joi.string()).optional() // Accepts array of strings/emails
    });

    const { error, value } = projectValidation.validate({ 
        title: req.body.title, 
        description: req.body.description,
        assignedUsers: req.body.assignedUsers
    });
    if (error) return res.status(422).send(error);

    try {
        const data = await new Project({ ...value, owner: req.user.id }).save();
        res.send({ data: { title: data.title, description: data.description, assignedUsers: data.assignedUsers, updatedAt: data.updatedAt, _id: data._id } });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'title must be unique' } });
        } else {
            return res.status(500).send({ data: { error: true, message: 'server error' } });
        }
    }
});

// Update project information including assigned users list configurations
api.put('/project/:id', authMiddleware, async (req, res) => {
    const projectValidation = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
        assignedUsers: joi.array().items(joi.string()).optional()
    });

    const { error, value } = projectValidation.validate({ 
        title: req.body.title, 
        description: req.body.description,
        assignedUsers: req.body.assignedUsers
    });
    if (error) return res.status(422).send(error);

    try {
        const data = await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id), owner: req.user.id }, 
            { ...value }, 
            { upsert: false }
        );
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete project
api.delete('/project/:id', authMiddleware, async (req, res) => {
    try {
        const data = await Project.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id), owner: req.user.id });
        res.send(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ==========================================
// 4. PROTECTED TASK ROUTES (Requires Token)
// ==========================================

api.post('/project/:id/task', authMiddleware, async (req, res) => {
    if (!req.params.id) return res.status(500).send(`server error`);

    const taskValidation = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().allow('').optional(), 
    });

    const { error, value } = taskValidation.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error);

    try {
        const projectObj = await Project.findOne({ _id: mongoose.Types.ObjectId(req.params.id), owner: req.user.id });
        if (!projectObj) return res.status(404).send({ error: true, message: "Project not found or unauthorized." });

        const task = projectObj.task;
        let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];

        const data = await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id), owner: req.user.id }, 
            { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } }
        );
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

api.get('/project/:id/task/:taskId', authMiddleware, async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    try {
        let data = await Project.find(
            { _id: mongoose.Types.ObjectId(req.params.id), owner: req.user.id },
            {
                task: {
                    $filter: {
                        input: "$task",
                        as: "task",
                        cond: {
                            $in: ["$$task._id", [mongoose.Types.ObjectId(req.params.taskId)]]
                        }
                    }
                }
            });
        if (!data || data.length < 1 || data[0].task.length < 1) return res.status(404).send({ error: true, message: 'record not found' });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

api.put('/project/:id/task/:taskId', authMiddleware, async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    // CHANGED: Added .allow('').optional() to fix validation issue during updates
    const taskValidation = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().allow('').optional(),
    });

    const { error, value } = taskValidation.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error);

    try {
        const data = await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            owner: req.user.id,
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.taskId) } }
        }, { $set: { "task.$.title": value.title, "task.$.description": value.description } });
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

api.delete('/project/:id/task/:taskId', authMiddleware, async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    try {
        const data = await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id), owner: req.user.id }, 
            { $pull: { task: { _id: mongoose.Types.ObjectId(req.params.taskId) } } }
        );
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

// Update Task Positions on Board Drag-and-Drop
api.put('/project/:id/todo', authMiddleware, async (req, res) => {
    let todo = [];

    for (const key in req.body) {
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name;
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index });
        }
    }

    for (const item of todo) {
        await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            owner: req.user.id,
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(item.name) } }
        }, { $set: { "task.$.order": item.order, "task.$.stage": item.stage } });
    }

    res.send(todo);
});

export default api;