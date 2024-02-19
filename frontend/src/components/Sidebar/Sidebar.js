import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { sidebarItems } from '../../helpers';


const Sidebar = () => {
    const { role } = JSON.parse(localStorage.getItem("user"))
    
    return (
        <nav id="sidebar" className="bg-light">
            <div className="p-3">
                {/* Profile Picture */}
                <div className="text-center mb-4">
                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" // Replace 'profile.jpg' with the URL of your profile picture
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '100px', height: '100px' }}
                    />
                    <p>{role}</p>
                </div>

                <ul className="list-unstyled components mb-5">
                    {sidebarItems.map((menu) => {
                        return (
                            menu.role.includes(role) ? (
                                <li id={menu.id} key={menu.id}>
                                    <Link
                                        to={menu.to}
                                        className="sidebar-link fw-bold"
                                    >
                                        {menu.text}
                                    </Link>
                                </li>
                            ) : null
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
