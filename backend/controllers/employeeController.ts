import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/employee_model";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/** 
 * @desc Register Employee
 * @route POST /api/employees/register
 */
export const registerEmployee = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, department, designation } = req.body;

        // Check if employee exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create employee
        const employee = new Employee({
            name,
            email,
            password: hashedPassword,
            phone,
            department,
            designation,
        });

        await employee.save();
        res.status(201).json({ message: "Employee registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Login Employee
 * @route POST /api/employees/login
 */
export const loginEmployee = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find employee by email
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: employee._id, email: employee.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", token, employee });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Get all Employees
 * @route GET /api/employees
 */
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.find().select("-password");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Get Employee by ID
 * @route GET /api/employees/:id
 */
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id).select("-password");
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Update Employee
 * @route PUT /api/employees/:id
 */
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { name, phone, department, designation, isActive } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, phone, department, designation, isActive },
            { new: true }
        ).select("-password");

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Delete Employee
 * @route DELETE /api/employees/:id
 */
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
