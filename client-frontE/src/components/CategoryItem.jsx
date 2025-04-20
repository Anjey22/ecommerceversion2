import React from 'react'
import { Link } from 'react-router-dom'

const CategoryItem = ({category}) => {
  return (
    <div className='relative overflow-hidden h-96 w-full rounded-lg group'>
        <Link to = {"/category" + category.href}>
        <div className='w-full h-full cursor-pointer'>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90 z-10'>
           <img  className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
             src={category.imageUrl}
             alt={category.name}
             loading='lazy'
           />
            <div className='absolute bottom-0 left-0 right-0 p-4 z-20 w-40'>
                <h3 className='text-white bg-red-500 text-center text-2xl font-bold mb-2 rounded-lg'>{category.name}</h3>
                {/*<p className='text-black text-sm bg-red-300 text-center'>Check {category.name}</p>*/}
            </div>

            </div>

        </div>
        </Link>
      Category
    </div>
  );
};

export default CategoryItem
