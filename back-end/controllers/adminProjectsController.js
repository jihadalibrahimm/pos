import Project from "../models/Project.js"
import mongoose from "mongoose"

export const createProject = async (req, res) => {
  try {
    // 🔍 DEBUG مهم جداً
    console.log("CREATE PROJECT BODY:", req.body)

    const {
      name,
      description,
      goalAmount,
      status,
      endDate
    } = req.body

    // ✅ Validation يدوي (قبل mongoose)
    if (!name || goalAmount === undefined) {
      return res.status(400).json({
        message: "name and goalAmount are required",
        received: req.body
      })
    }

    const project = await Project.create({
      name,
      description,
      goalAmount: Number(goalAmount),
      status,
      endDate
    })

    res.status(201).json(project)

  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err)
    res.status(500).json({
      message: err.message || "Server error"
    })
  }
}

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getProjectById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" })
    }
    res.json({ message: "Project deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
