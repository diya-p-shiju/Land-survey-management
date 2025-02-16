// auth_controller.ts
import { Request, RequestHandler, Response } from 'express';
import user_model from '../models/user_model';

const login: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await user_model.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Send back user info (except password)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone,
            
        };

        return res.json({ user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        return;
    }
};

export { login };