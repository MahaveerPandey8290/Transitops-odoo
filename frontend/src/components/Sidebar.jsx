import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) {

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: 'Fleet',
      icon: Truck,
      path: '/fleet'
    },
    {
      name: 'Drivers',
      icon: Users,
      path: '/drivers'
    },
    {
      name: 'Trips',
      icon: Route,
      path: '/trips'
    },
    {
      name: 'Trip Dispatcher',
      icon: Send,
      path: '/trip-dispatcher'
    },
    {
      name: 'Maintenance',
      icon: Wrench,
      path: '/maintenance'
    },
    {
      name: 'Fuel & Expenses',
      icon: Fuel,
      path: '/fuel-expenses'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/analytics'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings'
    },
  ];


  const handleLogout = () => {
    navigate('/login');
  };


  const handleNavigation = (path) => {
    navigate(path);

    // close mobile drawer after navigation
    if(onClose){
      onClose();
    }
  };


  return (
    <>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
          fixed inset-0 z-40 
          bg-black/60 
          backdrop-blur-sm 
          md:hidden"
        />
      )}


      {/* Sidebar */}
      <aside
        className={`
        fixed md:sticky 
        top-0 left-0 
        z-50 
        h-screen
        bg-[#15181E]
        border-r border-[#2B3038]
        flex flex-col justify-between
        transition-all duration-300

        ${
          isOpen
          ? 'translate-x-0'
          : '-translate-x-full md:translate-x-0'
        }

        ${
          isCollapsed
          ? 'w-20'
          : 'w-[260px]'
        }
        `}
      >


        {/* Logo */}
        <div className="
        p-5 
        border-b border-[#2B3038]
        flex items-center justify-between
        relative
        ">


          <div className="flex items-center gap-3">


            <div className="
            w-8 h-8 
            rounded-lg
            bg-gradient-to-br 
            from-[#F59E0B]
            to-[#D97706]
            flex items-center justify-center
            ">
              <Route size={16} className="text-white"/>
            </div>


            {!isCollapsed && (

              <div>

                <h1 className="
                text-white
                font-bold
                text-base
                ">
                  Transit<span className="text-[#F59E0B]">
                    Ops
                  </span>
                </h1>


                <p className="
                text-[8px]
                text-gray-400
                uppercase
                ">
                  Smart Operations
                </p>

              </div>

            )}


          </div>



          <button
          onClick={onToggleCollapse}
          className="
          hidden md:flex
          absolute
          -right-3
          w-7 h-7
          rounded-full
          bg-[#171A21]
          border border-[#2B3038]
          items-center
          justify-center
          text-gray-400
          "
          >

            {
              isCollapsed
              ?
              <ChevronRight size={14}/>
              :
              <ChevronLeft size={14}/>
            }

          </button>



          <button
          onClick={onClose}
          className="
          md:hidden
          text-gray-400
          "
          >
            <X size={18}/>
          </button>


        </div>



        {/* Menu */}

        <nav className="
        flex-1
        px-3
        py-6
        space-y-2
        ">


          {
            navItems.map((item)=>{

              const Icon=item.icon;


              const active =
              location.pathname === item.path;


              return (

                <button
                key={item.name}
                onClick={()=>handleNavigation(item.path)}
                className={`
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                transition-all

                ${
                  active
                  ?
                  `
                  bg-[#F59E0B]
                  text-white
                  `
                  :
                  `
                  text-gray-400
                  hover:bg-[#171A21]
                  hover:text-white
                  `
                }

                `}
                >


                  <Icon size={20}/>


                  {!isCollapsed && (

                    <span className="
                    text-sm
                    font-semibold
                    ">
                      {item.name}
                    </span>

                  )}



                </button>

              )

            })
          }


        </nav>




        {/* Footer */}

        <div className="
        p-4
        border-t border-[#2B3038]
        ">


          <button
          onClick={handleLogout}
          className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          py-3
          rounded-xl
          border border-[#2B3038]
          text-red-400
          hover:bg-red-500/10
          "
          >

            <LogOut size={16}/>

            {!isCollapsed &&
            <span>
              Logout
            </span>
            }

          </button>


        </div>


      </aside>


    </>
  );
}