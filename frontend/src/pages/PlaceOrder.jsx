import React, { useContext, useState } from 'react'
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/frontend_assets/assets';
import { ShopContext } from '../context/ShopContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {

const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);

  const [method, setMethod] = useState('cod')
  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data=>({...data, [name]:value }))
  }
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const {data} = await axios.post(backendUrl+"/api/order/verifyRazorpay", response, {headers:{token}})
          if(data.success){
            navigate('/orders');
            setCartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  const onSubmitHandler = async (event) => {
   event.preventDefault();
   navigate("/orders");
   try {
    let orderItems = [];
    for(const items in cartItems){
      for(const item in cartItems[items]){
        if(cartItems[items][item] > 0){
          const itemInfo = structuredClone(products.find(product => product._id === items));
          if(itemInfo){
            itemInfo.size = item;
            itemInfo.quantity = cartItems[items][item];
            orderItems.push(itemInfo);
          }

        }
      }
    }
    let orderData = {
      address: formdata,
      items: orderItems,
      amount: getCartAmount() + (getCartAmount() > 0 && getCartAmount() < 500 ? delivery_fee : 0)
    }
    switch(method){
      // api calls for cod
      case "cod":
      const response = await axios.post(backendUrl + "/api/order/place", orderData, {headers: {token}});
      if(response.data.success){
        setCartItems({});
        navigate("/orders")
      }else{
        toast.error(response.data.message)
      }
      break;

      case "razorpay":
      const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, {headers: {token}});
      if (responseRazorpay.data.success) {
        initPay(responseRazorpay.data.order);
      } else {
        toast.error(responseRazorpay.data.message);
      }
        break;
      default :
      break;
    }
   } catch (error) {
    console.log(error);
    toast.error(error.message);
   }
  }
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t '>
      {/* --------------Left Side-------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"}/>
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name='firstName' value={formdata.firstName} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='First Name' required/>
          <input onChange={onChangeHandler} name='lastName' value={formdata.lastName} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' required/>
        </div>
        <input onChange={onChangeHandler} name='email' value={formdata.email} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Email' required/>
        <input onChange={onChangeHandler} name='street' value={formdata.street} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name='city' value={formdata.city} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='City' required/>
          <input onChange={onChangeHandler} name='state' value={formdata.state} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='State'required/>
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name='zipcode' value={formdata.zipcode} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Zipcode' required/>
          <input onChange={onChangeHandler} name='country' value={formdata.country} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Country' required/>
        </div>
        <input onChange={onChangeHandler} name='phone' value={formdata.phone} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Phone' required/>

      </div>
      {/* -------------Right side------------ */}
      <div className="mt-8 ">
        <div className="mt-8 min-w-80">
          <CartTotal/>
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"}/>
          {/* -------------- Payment Method Selection -------------- */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div onClick={()=>{setMethod('stripe')}} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : '' }`}></p>
              <img className='h-5 mx-4 ' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>{setMethod('razorpay')}} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : '' }`}></p>
              <img className='h-5 mx-4 ' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={()=>{setMethod('cod')}} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : '' }`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
            
          </div>
          <div className="w-full text-end mt-8">
            <button type='submit' className="bg-black text-white  px-16 py-3 text-sm">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder

