import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx';
const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, token, setToken, navigate, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login');
        localStorage.removeItem("token");
        setToken('');
        setCartItems({});

    }
    return (
        <div className='flex items-center justify-between py-5 px-12 font-medium bg-white shadow-md fixed top-0 left-0 right-0 z-50'>
            <Link to='/'> <img src={assets.logo} className='w-36' alt="" /></Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>Home</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>Collection</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>About</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />

                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>Contact</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>
            </ul>
            <div className="flex items-center gap-6">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt='' />
                <div className="group relative">
                    <img onClick={() => token ? null : navigate("/login")} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    {token &&                     <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700 rounded-md">
                            <p className="cursor-pointer hover:text-black ">My Profile</p>
                            <p onClick={()=> navigate('/orders')} className="cursor-pointer hover:text-black ">Orders</p>
                            <p onClick={logout} className="cursor-pointer hover:text-black ">Logout</p>
                        </div>
                    </div>}
                 
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white font-medium aspect-square rounded-full text-[8px]">{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>
            {/* sidebar menu for small screen */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-500 ${visible ? 'w-full' : 'w-0'}`}>
                <div className="flex flex-col text-gray-700 ">
                    <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/' >Home</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection' >Collection</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about' >About</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact' >Contact</NavLink>
                </div>
            </div>


        </div>
    )
}

export default Navbar