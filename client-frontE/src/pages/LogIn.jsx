import {React, useState} from 'react';
import { Mail, Lock, Loader, LogIn, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { userStore } from '../Stores/userStore';

const Login = () => {

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
 
   const {login, loading} =userStore();
   const handleSubmit =(e) => {
     e.preventDefault();
     login(email, password)
     console.log(email, password);
   }
 
   return (
     <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
 
       <motion.div className='sm:mx-auto sm:w-full sm:max-w-md'
                   initial={{opacity:0, y:-20}}
                   animate={{opacity:1, y:0 }}
                   transition={{duration:0.8}}
                   >
             <h2 className='mt-6 text-center text-3xl font-extrabold text-pink-800'>Login to your account</h2>
       </motion.div>
 
       <motion.div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
                   initial={{opacity:0, y:20}}
                   animate={{opacity:1, y:0 }}
                   transition={{duration:0.8, delayz: 0.2}}
                   >
            <div className="bg-gray-200 py-8 px-4 shadow sm:rounded-lg sm:px-7>">
             <form onSubmit={handleSubmit} className="space-y-6">
 
 
             <div>
              <label htmlFor='email' className='block text-sm font-medium text-black'>
                Email address
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  id='email'
                  type='email'
                  required
                  value={email}
                   placeholder='abc@gmail.com'
                  className=' block w-full px-3 py-2 pl-10 bg-white border border-gray-600 
                  rounded-md shadow-sm
                   placeholder-white focus:outline-none focus:ring-gray-500 
                   focus:border-gray-500 sm:text-sm'
                   onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
 
 
             <div>
               <label htmlFor="password" className='block text-sm font-medium text-black'>Password</label>
               <div className='mt-1 relative rounded-md shadow-sm'>
                 <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                 <Lock className='h-5 w-5 text-gray-400' aria-hidden='true'/>
               </div>
 
               <input id='password'
                type='password' 
                required 
                value={password}
                 placeholder='Enter your password'
 
                 className=' block w-full px-3 py-2 pl-10 bg-white border border-gray-600 
                 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                  focus:border-emerald-500 sm:text-sm text-black'
                       onChange={(e) => setPassword(e.target.value)}
               />
             </div>
             </div>
 
               <button
                type='submit'
                 className='w-full flex justify-center py-2 px-4 border border-transparent
                 rounded-md shadow-sm text-sm front-medium text-white bg-pink-600
                  hover:bg-pink-700 focus:outline-none focuc:ring-2 focus:ring-offset-2
                  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
                  disabled={loading}
               >
                 {loading? (
                   <>
                   <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/> Loading...
                   </>
                 ): (
                   <>
                   <LogIn className='mr-2 h-5 w-5 ' aria-hidden='true'/>
                   Login
                   </>
                 )}
               </button>
             </form>
 
             <p className='mt-8 text-center text-sm text-gray-700'>
            Create your account.{" "}
            <Link to='/signup' className='font-medium text-blue-500 hover:text-blue-600'>
              Signup here <ArrowRight className='inline h-4 w-4' />
            </Link>
          </p>
 
            </div>
       </motion.div>
     </div>
   )
}

export default Login;
