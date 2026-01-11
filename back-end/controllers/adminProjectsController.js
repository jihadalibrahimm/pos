import Project from "../models/Project.js"
import mongoose from "mongoose"

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
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
      { new: true }
    )

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
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
