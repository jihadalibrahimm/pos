import Invoice from "../models/Invoice.js";

export const dailyReport = async (req, res) => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const invoices = await Invoice.find({
    createdAt: { $gte: start, $lte: end }
  })

  const totalSales = invoices.reduce(
    (acc, inv) => acc + inv.finalTotal,
    0
  )

  res.json({
    totalSales,
    count: invoices.length,
  })
}


export const rangeReport = async(req,res) => {
    const {start, end} = req.body
    const invoices = await Invoice.find({
        createdAt: {$gte:new Date(start), $lte:new Date(end)}
    })

    const total = invoices.reduce((acc, i) => acc + i.finalTotal,0)
    res.json({
        invoices,
        total,
    })
}

export const topProducts = async(req,res) => {
    const data = await Invoice.aggregate([
        {$unwind:"$items"},
        {$group: {_id:"$items.name", sold:{$sum:"$items.qty"}}},
        {$sort:{sold:-1}},
        {$limit:10},
    ])
    res.json(data)
}