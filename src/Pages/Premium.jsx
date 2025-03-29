import React from 'react'
import Modal from '../Pages/Modal'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Premium() {

  const [showModal, setShowModal] = useState(false);
  
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [errorMessages, setErrorMessages] = useState('');
  const navigate = useNavigate(); // Hook to handle navigation
  const notify = () => toast("Registration Successful!");



  const onSubmit = async (data) => {

    const formData = new FormData();
    
    formData.append('amount', data.amount);
    formData.append('terms', data.terms);


    try {
        const response= await axios.post('http://localhost:3007/newsletter',{
            amount: data.amount,
            terms: data.terms ? 1 : 0,
        });
        if (response.status === 201) {
          reset(); // Clear form inputs
          notify()
          setErrorMessages(''); // Clear any previous error messages
          
          // Redirect after a short delay
          setTimeout(() => {
              navigate('/');
          }, 2000);
        }else {
          // Handle unexpected statuses
          setErrorMessages("Unexpected response from server. Please try again.");
      }
        }catch(err)  {
          if (err.response) {
            const { status, data } = err.response;
            
            // Handle specific server response errors
            if (status === 400) {
                setErrorMessages(data.message || "Validation failed. Please check your input.");
            } else if (status === 500) {
                setErrorMessages(data.message || "Server error. Please try again later.");
            } else {
                setErrorMessages(data.message || "An error occurred. Please try again.");
            }
        } else {
            // General error (e.g., network issues)
            setErrorMessages("Unable to connect to the server. Please check your internet connection.");
        }
        console.error(err); // Log the error for debugging
        };
      };    

    


  return (
    <main className='h-full pt-5 pb-11 rounded-[10px] bg-white'>
        
        <div className=' border md:w-1/2 rounded-[10px] m-3 md:m-auto p-5 border-slate-500'>
            <h1 className='text-3xl font-bold py-3 text-center'>Annual Premium Subscription</h1>
            <hr className='w-[50%] h-1 m-auto bg-black' />

            <p className='text-center py-3 '>Subscribe to our premium plan to access exclusive features.</p>
            <ul className='text-center'>
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Get 20% discounts on Products shoppings every month.</li>
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Free Demartology check-ups and advice annually.</li>
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Email deliveries and Push notifications on personalized beauty tips.</li>
             
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>50% discount for our  VIP tickets on our product launch events.</li>
            </ul>



            <div onClick={openModal} className='flex justify-center gap-4 mt-5'>
                <button className='bg-[#F0BA30] p-3 px-5 rounded-full font-bold'>Subscribe @ $1000</button>
            </div>
             {/* {showModal && <Modal onClose={closeModal} />} */}
             <Modal  show={showModal} onClose={closeModal}>
                {/* Newsletter Signup */}
        <section className="p-10  w-[80%] h-[80vh]  m-auto">
            <h2 className="text-xl text-center py-4 font-semibold text-[#000]">Annual Premium Subscription</h2>
            <hr className='w-[50%] h-1 m-auto bg-black' />

          
            {errorMessages && (
              <div id="authmessage" className='text-red-600 py-2   text-center'>
                {errorMessages}
              </div>
            )}

            <form 
            noValidate
             onSubmit={handleSubmit(onSubmit)} 
              className=" flex flex-col ">


              <label className='py-3 font-bold' htmlFor="amount">Amount:</label>
              <input 
                type="number" 
                autoFocus
                placeholder="Enter your amount..."
                {...register("amount", {
                    required: "amount is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Invalid amount"
                    }
                  })}
                className="border rounded-full px-4 py-3" 
                required
                disabled
                value="1000"
              />
                {errors.amount && (
                    <span className="text-red-600 text-sm">{errors.amount.message}</span>
                    )}
          <div className='flex flex-row my-7'>         
                 <input type="checkbox" name="terms" id="subscribe"
              {...register("terms", { required: "You must agree to Terms" })}
               className="mx-3"/>


              <label htmlFor="subscribe" className="text-sm text-gray-500">I Acknowledge to Go Premium</label>
              </div>

             
              {errors.terms && (
                    <span className="text-red-600 text-sm">{errors.terms.message}</span>
                    )}

                
                 
              <button type="submit" className="px-3 my-3 py-3  rounded-full  bg-[#F0BA30] font-bold text-black"> Proceed to Checkout</button>
                

              
            </form>
            <p className="text-xs text-gray-500 text-center  mt-5">*You can unsubscribe anytime</p>
          </section>

          {/* Success Message */}
          {/* {showSuccess && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">
              You have submitted successfully!
            </div>
          )} */}

             </Modal>
            <p className='text-center italic my-4'>*Unsubscribe Anytime*</p>
        </div>

<ToastContainer
        position="top-center"
        autoClose={3000} // Automatically close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  )
}

export default Premium