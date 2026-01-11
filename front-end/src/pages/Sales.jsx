import { useEffect, useState } from "react"
import API from "../api/axios"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Stack,
} from "@mui/material"

function Sales() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [tax, setTax] = useState(5)
  const [discount, setDiscount] = useState(0)

  // تحميل المنتجات
  const loadProducts = async () => {
    try {
      const { data } = await API.get("/products")
      setProducts(data || [])
    } catch (err) {
      console.error(err)
      setProducts([])
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

const addToCart = (product) => {
  setCart(prev => {
    const exist = prev.find(p => p._id === product._id)

    if (exist) {
      if (exist.quantity >= product.stock) {
        alert("No more stock available")
        return prev
      }

      return prev.map(p =>
        p._id === product._id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    }

    if (product.stock < 1) {
      alert("Out of stock")
      return prev
    }

    return [...prev, { ...product, quantity: 1 }]
  })
}

  const subTotal = cart.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  )

  const finalTotal =
    subTotal - discount + (subTotal * tax) / 100

  // Checkout
  const checkout = async () => {
    try {
      const items = cart.map(item => ({
        productId: item._id,
        qty: item.quantity,
      }))

      await API.post("/invoices", {
        items,
        tax,
        discount,
        paymentMethod: "cash",
      })

      setCart([])
      setDiscount(0)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Checkout failed")
    }
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sales
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2.2fr 1fr" },
          gap: 3,
        }}
      >
        {/* PRODUCTS */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Products
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {products.length ? (
                products.map(p => (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.sellingPrice} $</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => addToCart(p)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No products
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* CART */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6">Cart</Typography>
          <Divider sx={{ my: 2 }} />

          {cart.length ? (
            <Stack spacing={1}>
              {cart.map(item => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography fontWeight="bold">
                    {item.sellingPrice * item.quantity} $
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">
              Cart is empty
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <TextField
            fullWidth
            label="Tax %"
            type="number"
            size="small"
            value={tax}
            onChange={e => setTax(+e.target.value)}
            sx={{ mb: 1 }}
          />

          <TextField
            fullWidth
            label="Discount"
            type="number"
            size="small"
            value={discount}
            onChange={e => setDiscount(+e.target.value)}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" fontWeight="bold">
              {finalTotal.toFixed(2)} $
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={!cart.length}
            onClick={checkout}
          >
            Checkout
          </Button>
        </Paper>
      </Box>
    </Box>
  )
}

export default Sales