import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaCalendarAlt,
  FaShoppingBag,
  FaMoneyBillWave,
  FaTruck,
  FaBoxOpen,
  FaBullhorn,
  FaReceipt,
  FaStickyNote
} from 'react-icons/fa'
import { entriesApi } from '../api/client'

const todayStr = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const emptyForm = {
  date: todayStr(),
  orders: '',
  revenue: '',
  grossProfit: '',
  deliveryCostPerOrder: '',
  packagingCostPerOrder: '',
  adsExpense: '',
  otherExpenses: '',
  notes: ''
}

const num = (v) => (v === '' || v === null || v === undefined ? 0 : Number(v))

const EntryForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isEditMode = Boolean(editId)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    const loadEntry = async () => {
      try {
        const res = await entriesApi.getById(editId)
        const e = res.data
        setForm({
          date: e.date ? e.date.slice(0, 10) : todayStr(),
          orders: e.orders ?? '',
          revenue: e.revenue ?? '',
          grossProfit: e.grossProfit ?? '',
          deliveryCostPerOrder: e.deliveryCostPerOrder ?? '',
          packagingCostPerOrder: e.packagingCostPerOrder ?? '',
          adsExpense: e.adsExpense ?? '',
          otherExpenses: e.otherExpenses ?? '',
          notes: e.notes ?? ''
        })
      } catch (err) {
        console.error(err)
        toast.error('Could not load this entry')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    loadEntry()
  }, [editId, isEditMode, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.date) newErrors.date = 'Date is required'
    if (form.orders === '' || Number(form.orders) < 0) newErrors.orders = 'Enter a valid number of orders'
    if (form.revenue === '' || Number(form.revenue) < 0) newErrors.revenue = 'Enter valid revenue'
    if (form.grossProfit === '') newErrors.grossProfit = "Enter today's gross profit"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Live-computed preview (mirrors backend/spreadsheet formulas exactly) ──
  const preview = useMemo(() => {
    const orders = num(form.orders)
    const totalDeliveryCost = orders * num(form.deliveryCostPerOrder)
    const totalPackagingCost = orders * num(form.packagingCostPerOrder)
    const totalExpenses = totalDeliveryCost + totalPackagingCost + num(form.adsExpense) + num(form.otherExpenses)
    const netProfitLoss = num(form.grossProfit) - totalExpenses
    return { totalDeliveryCost, totalPackagingCost, totalExpenses, netProfitLoss }
  }, [form])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const payload = {
      date: form.date,
      orders: num(form.orders),
      revenue: num(form.revenue),
      grossProfit: num(form.grossProfit),
      deliveryCostPerOrder: num(form.deliveryCostPerOrder),
      packagingCostPerOrder: num(form.packagingCostPerOrder),
      adsExpense: num(form.adsExpense),
      otherExpenses: num(form.otherExpenses),
      notes: form.notes
    }

    try {
      if (isEditMode) {
        await entriesApi.update(editId, payload)
        toast.success('Entry updated')
      } else {
        await entriesApi.create(payload)
        toast.success('Entry added')
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      const message = err.response?.data?.message || 'Could not save entry'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="empty-state">Loading entry…</div>
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{isEditMode ? 'Edit Daily Entry' : 'Add Daily Entry'}</h2>
          <p>Fill in today's numbers — totals and profit/loss are calculated automatically.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <p className="form-section-title">Today's Activity</p>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              <FaCalendarAlt /> Date <span className="form-required">*</span>
            </label>
            <input
              id="date"
              type="date"
              name="date"
              className={`form-input ${errors.date ? 'form-input--error' : ''}`}
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="orders">
              <FaShoppingBag /> Orders <span className="form-required">*</span>
            </label>
            <input
              id="orders"
              type="number"
              min="0"
              name="orders"
              className={`form-input ${errors.orders ? 'form-input--error' : ''}`}
              placeholder="e.g. 2"
              value={form.orders}
              onChange={handleChange}
            />
            {errors.orders && <span className="form-error">{errors.orders}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="revenue">
              <FaMoneyBillWave /> Revenue (Rs.) <span className="form-required">*</span>
            </label>
            <input
              id="revenue"
              type="number"
              min="0"
              name="revenue"
              className={`form-input ${errors.revenue ? 'form-input--error' : ''}`}
              placeholder="e.g. 15200"
              value={form.revenue}
              onChange={handleChange}
            />
            {errors.revenue && <span className="form-error">{errors.revenue}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="grossProfit">
              <FaMoneyBillWave /> Today's Orders Profit (Gross) <span className="form-required">*</span>
            </label>
            <input
              id="grossProfit"
              type="number"
              name="grossProfit"
              className={`form-input ${errors.grossProfit ? 'form-input--error' : ''}`}
              placeholder="e.g. 2600"
              value={form.grossProfit}
              onChange={handleChange}
            />
            {errors.grossProfit && <span className="form-error">{errors.grossProfit}</span>}
            <span className="form-hint">Revenue minus cost of goods sold, before delivery/packaging/ads.</span>
          </div>
        </div>

        <p className="form-section-title">Delivery &amp; Packaging</p>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="deliveryCostPerOrder">
              <FaTruck /> Delivery Cost / Order
            </label>
            <input
              id="deliveryCostPerOrder"
              type="number"
              min="0"
              name="deliveryCostPerOrder"
              className="form-input"
              placeholder="e.g. 100"
              value={form.deliveryCostPerOrder}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="packagingCostPerOrder">
              <FaBoxOpen /> Packaging Cost / Order
            </label>
            <input
              id="packagingCostPerOrder"
              type="number"
              min="0"
              name="packagingCostPerOrder"
              className="form-input"
              placeholder="e.g. 30"
              value={form.packagingCostPerOrder}
              onChange={handleChange}
            />
          </div>
        </div>

        <p className="form-section-title">Other Expenses</p>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="adsExpense">
              <FaBullhorn /> Ads Expense
            </label>
            <input
              id="adsExpense"
              type="number"
              min="0"
              name="adsExpense"
              className="form-input"
              placeholder="e.g. 800"
              value={form.adsExpense}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="otherExpenses">
              <FaReceipt /> Other Expenses
            </label>
            <input
              id="otherExpenses"
              type="number"
              min="0"
              name="otherExpenses"
              className="form-input"
              placeholder="e.g. 80"
              value={form.otherExpenses}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group--full">
            <label className="form-label" htmlFor="notes">
              <FaStickyNote /> Notes
            </label>
            <input
              id="notes"
              type="text"
              name="notes"
              className="form-input"
              placeholder="Optional notes about today"
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="live-preview">
          <h4>Live Preview (auto-calculated)</h4>
          <div className="live-preview-grid">
            <div className="live-preview-item">
              <span>Total Delivery Cost</span>
              <span>Rs. {preview.totalDeliveryCost.toLocaleString()}</span>
            </div>
            <div className="live-preview-item">
              <span>Total Packaging Cost</span>
              <span>Rs. {preview.totalPackagingCost.toLocaleString()}</span>
            </div>
            <div className="live-preview-item">
              <span>Total Expenses</span>
              <span>Rs. {preview.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="live-preview-item">
              <span>Net Profit / Loss</span>
              <span style={{ color: preview.netProfitLoss >= 0 ? '#1B4332' : '#6B0F0F' }}>
                {preview.netProfitLoss >= 0 ? '+' : ''}
                Rs. {preview.netProfitLoss.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEditMode ? 'Update Entry' : 'Save Entry'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

export default EntryForm
