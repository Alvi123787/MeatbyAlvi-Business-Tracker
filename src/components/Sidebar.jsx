import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdDashboard, MdPlaylistAdd } from 'react-icons/md'
import { GiKnifeFork } from 'react-icons/gi'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <GiKnifeFork />
        </div>
        <div className="sidebar-brand-text">
          <h1>MeatbyAlvi</h1>
          <span>Business Tracker</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
        >
          <MdDashboard />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/add-entry"
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
        >
          <MdPlaylistAdd />
          <span>Add Daily Entry</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        Fresh • Halal • Premium Quality
        <br />
        Track every day's numbers to see your real profit.
      </div>
    </aside>
  )
}

export default Sidebar
