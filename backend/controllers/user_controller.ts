import user_model from '../models/user_model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    isAdmin: boolean;
}

const createUsers = async (req: Request, res: Response) => {
    try {
        // if (!req.body) {
        //     return res.status(400).json({ message: 'Request body is missing or empty' });
        // }

        const { name, email, password, phone, isAdmin } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Hash password before saving
        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user_model({ name, email, password, phone, isAdmin });
        await newUser.save();

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await user_model.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const user: IUser | null = await user_model.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, isAdmin } = req.body;
        const updatedUser = await user_model.findByIdAndUpdate(
            req.params.id,
            { name, email, password, phone, isAdmin },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await user_model.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { createUsers, getUsers, getUser, updateUser, deleteUser };