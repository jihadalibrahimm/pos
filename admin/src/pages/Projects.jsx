import { useEffect, useState } from "react"
import API from "../api/axios"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { toast } from "react-toastify"

function Projects() {
  const [projects, setProjects] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    goalAmount: "",
    collectAmount: "",
    status: "active",
  })

  /* ------------------ Load ------------------ */
  const loadProjects = async () => {
    try {
      const { data } = await API.get("/admin/projects", {
        withCredentials: true,
      })
      setProjects(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to load projects")
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  /* ------------------ Actions ------------------ */
  const openCreate = () => {
    setEditing(null)
    setForm({
      name: "",
      description: "",
      goalAmount: "",
      collectAmount: "",
      status: "active",
    })
    setOpen(true)
  }

  const openEdit = project => {
    setEditing(project)
    setForm({
      name: project.name,
      description: project.description || "",
      goalAmount: project.goalAmount || "",
      collectAmount: project.collectAmount || "",
      status: project.status,
    })
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setEditing(null)
  }

  const submit = async () => {
    if (!form.name.trim()) {
      toast.warning("Project name is required")
      return
    }

    if (!form.goalAmount) {
      toast.warning("Goal amount is required")
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      goalAmount: Number(form.goalAmount),
      collectAmount: Number(form.collectAmount || 0),
      status: form.status,
    }

    try {
      if (editing) {
        await API.put(
          `/admin/projects/${editing._id}`,
          payload,
          { withCredentials: true }
        )
        toast.success("Project updated")
      } else {
        await API.post(
          "/admin/projects",
          payload,
          { withCredentials: true }
        )
        toast.success("Project created")
      }

      closeDialog()
      loadProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed")
    }
  }

  const remove = async id => {
    if (!confirm("Delete this project?")) return
    try {
      await API.delete(`/admin/projects/${id}`, {
        withCredentials: true,
      })
      toast.success("Project deleted")
      loadProjects()
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ------------------ UI ------------------ */
  return (
    <Box sx={{ pt: "90px", px: 4, pb: 4, minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Projects
        </Typography>

        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          New Project
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Goal</TableCell>
              <TableCell>Collected</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.length ? (
              projects.map(p => (
                <TableRow key={p._id} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description || "-"}</TableCell>
                  <TableCell>{p.goalAmount}</TableCell>
                  <TableCell>{p.collectAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      color={p.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(p)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => remove(p._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editing ? "Edit Project" : "Create Project"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Project Name"
              fullWidth
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <TextField
              label="Goal Amount"
              type="number"
              fullWidth
              required
              value={form.goalAmount}
              onChange={e =>
                setForm({ ...form, goalAmount: e.target.value })
              }
            />

            <TextField
              label="Collected Amount"
              type="number"
              fullWidth
              value={form.collectAmount}
              onChange={e =>
                setForm({ ...form, collectAmount: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={e =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Projects
