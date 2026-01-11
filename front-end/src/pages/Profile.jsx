import { useEffect, useState } from "react"
import API from "../api/axios"
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button
} from "@mui/material"
import { motion } from "framer-motion"
import { Mail, User, Calendar } from "lucide-react"

function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me")
        setUser(res.data.user)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [])

  if (!user) {
    return (
      <Box className="flex justify-center items-center h-[80vh] bg-[#f8f6f1]">
        <Typography>Loading user data...</Typography>
      </Box>
    )
  }

  const roleColors = {
    admin: "bg-red-500 text-white",
    manager: "bg-blue-500 text-white",
    cashier: "bg-green-500 text-white",
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f6f1",
        display: "flex",
        justifyContent: "center",
        paddingTop: "96px",
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 900 }}
      >

        {/* User Card */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: "4px solid #FFD700",
                backgroundColor: "goldenrod"
              }}
            >
              <User size={50} />
            </Avatar>

            <Box>
              <Typography variant="h4" fontWeight="bold" color="goldenrod">
                {user.name}
              </Typography>

              <Box
                className={`inline-block px-6 py-1 rounded-full font-medium text-sm mt-1 ${roleColors[user.role]}`}
              >
                {user.role.toUpperCase()}
              </Box>

              <Typography sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <Mail size={18} className="text-yellow-500" />
                {user.email}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <Calendar size={18} className="inline mr-1 text-yellow-500" />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Quick Navigation */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Quick Navigation
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => window.location.href = "/settings"}
              sx={{ py: 2, fontWeight: "bold", borderRadius: 2 }}
            >
              Settings
            </Button>

            <Button
              variant="outlined"
              onClick={() => window.location.href = "/sales"}
              sx={{ py: 2, fontWeight: "bold", borderRadius: 2 }}
            >
              Sales
            </Button>
          </Box>
        </Paper>

        {/* Account Info */}
        <Paper sx={{ p: 4,mt:3,  mb: 3, borderRadius: 3 }}>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Account Information
          </Typography>
          <Divider />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
            <User size={20} />
            <Typography>Role: {user.role}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Calendar size={20} className="text-yellow-500" />
            <Typography className="text-neutral-700">
              Account Created: {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>

      </motion.div>
    </Box>
  )
}

export default Profile