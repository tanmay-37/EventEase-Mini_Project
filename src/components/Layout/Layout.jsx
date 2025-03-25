import React from 'react';
import EventsHeader from '../EventsHeader/EventsHeader';  // event section
import { Outlet } from 'react-router-dom';  // For nested routing

const Layout = () => {
  return (
    <div>
      <Outlet />           {/* Renders the child route component */}
      <EventsHeader />     {/* This will always be displayed below Outlet */}
    </div>
  );
};

export default Layout;
