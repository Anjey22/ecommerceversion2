import { BarChart, PlusCircle, ShoppingBasket } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

import CreateProductForm from '../components/CreateProductForm'
import ProductList from '../components/ProductList'
import AnalyticsChart from '../components/AnalyticsChart'
import { ProductStore } from '../Stores/productStore'
import { useEffect } from 'react'

const tabs = [
    {id:"create", label:"Create Product", icon:PlusCircle},
    {id:"products", label:"Products", icon:ShoppingBasket},
    {id:"analytics", label:"Analytics", icon:BarChart}
]

const Admin = () => {
    const [activeTab, setActiveTab] = useState("create");
    const { fetchAllProducts } = ProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);


  return (
    <div className='min-h-screen bg--900 text-white relative overflow'>
        <div className='relative z-10 container mx-auto px-4 py-16'>
            <motion.h1 className="text-5xl font-bold mb-8 text-emerald-900 text-center"
           initial={{opacity:0, y:-20}}
           animate={{opacity:1, y:0 }}
           transition={{duration:0.8}}
           >
                Admin Panel
            </motion.h1>

            <div className='flex justify-center mb-8'> 
                { tabs.map((tab) => (
                    <button className={`flex items-center px-4 py-2 mx-2 rouded-md transition-colors duaration-200 
                        ${activeTab ===tab.id
                            ?"bg-blue-600 text-white"
                            : "bg-pink-600 text-white-300 hover:bg-pink-700"}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon className='mr-2 h-5 w-5'/>
                        {tab.label}
                    </button>
                ))
                }
            </div>

            {activeTab === "create" && <CreateProductForm/>}
            {activeTab === "products" && <ProductList/>}
            {activeTab === "analytics" && <AnalyticsChart/>}
            
        </div>
      
    </div>
  )
}

export default Admin
