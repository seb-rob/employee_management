import React, { useState } from "react";
import SidebarComponent from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";


const HomePage = () => {
    return (
        <div className="row">
            <div className="col-md-2">
                <SidebarComponent  />
            </div>
            <div className="col-md-10">
                <Outlet />
            </div>
        </div>
    )
}

export default HomePage;