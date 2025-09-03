import React from 'react'
import Navbar from './Navbar'
import hero from "../assets/hero.png"
import generator from "../assets/generator.png"
import Footer from './Footer'
import { motion } from 'framer-motion';

const HeroSection = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return (
    <div>
        <Navbar/>

       
        
        <div className="z-10 flex flex-col items-center justify-center m-auto mt-40 text-inter text-[100px] font-bold">
            <h1>Hire{" "}
            <p className='inline-block font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Smarter</p></h1>
            <h1>not Harder</h1>

            <h1 className='text-sm font-light mt-4'>Empower Your Hiring Process with AI – Analyze Resumes & Generate Interview Questions Instantly!</h1>
            
            <button className="mt-4 px-6 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600">
                Get Started
            </button>
            <hr className='w-[450px] m-auto mt-4'/>
        </div>

        
        
        {/* Image 1 */}
        <div className='mx-5 z-40 flex flex-row gap-10 mt-40'>
        
            <img src={hero} className='w-[850px] h-[270px]'/>
            <div className='mt-4 text-inter text-left mr-10'>
                <h1 className='font-bold text-md'>Effortlessly Screen Candidates with AI-Powered Resume Analysis </h1>
                <h1 className='mt-4 font-light text-sm w-[300px]'> Our AI Resume Analyzer instantly reviews and scores resumes, extracting key skills, experience and score them to generate a comprehensive candidate summary. 
                Simplify hiring decisions with visualized data and actionable insights in seconds.</h1>
            </div>
        </div>
        <hr className='w-[300px] m-auto'/>

        {/* Image 2 */}
        <div className='mx-10 mt-20 flex flex-row gap-10'>
            
            <div className='mt-10 text-inter text-left ml-10'>
                <h1 className='font-bold text-md'>Streamline Interview Prep with AI-Driven Question Generation </h1>
                <h1 className='mt-4 font-light text-left text-sm w-[400px]'> Our AI Question Generator creates tailored interview questions based on a candidate’s resume and job description, ensuring targeted, 
                    role-specific assessments that help you identify top talent quickly and effectively.</h1>
            </div>
            <img src={generator} className='w-[850px] h-[300px]'/>
        </div>

        <br/><br/><br/>
        <br/><br/><br/>
        <br/><br/><br/>

        <Footer/>
      
    </div>
  
  )
}

export default HeroSection
