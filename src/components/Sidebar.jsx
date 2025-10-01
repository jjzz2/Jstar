import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiTrash2 } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/">
          <FiHome style={{ marginRight: 8 }} /> 首页
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/trash">
          <FiTrash2 style={{ marginRight: 8 }} /> 回收站
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;


