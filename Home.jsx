import React from 'react'
import { motion } from 'framer-motion'
export default function Home(){
  return (
    <div className="space-y-10">
      <section className="flex gap-6 items-center">
        <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1,x:0}} transition={{duration:0.6}} className="flex-1">
          <h2 className="text-4xl font-bold">Melodii create pentru oameni speciali</h2>
          <p className="mt-4 text-gray-600">Comandă o melodie originală — pentru nuntă, aniversare sau surpriză.</p>
          <div className="mt-6 flex gap-3">
            <a href="/order" className="px-5 py-3 bg-indigo-600 text-white rounded-md shadow">Comandă acum</a>
            <a href="/contact" className="px-5 py-3 border rounded-md">Contact</a>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.8}} className="w-1/3">
          <div className="rounded-2xl bg-gradient-to-br from-white via-gray-100 to-gray-50 p-6 shadow-lg">
            <h3 className="font-semibold">Exemplu pachet</h3>
            <p className="text-sm text-gray-600 mt-2">Piesă Pop 60s, 2 revizii, WAV + MP3.</p>
          </div>
        </motion.div>
      </section>
      <section>
        <h3 className="text-2xl font-semibold">Cum funcționează</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Completezi comanda','Compozitorul lucrează','Primești și revizuiești'].map((t,i)=>(
            <motion.div key={i} initial={{y:10, opacity:0}} whileInView={{y:0, opacity:1}} transition={{delay:i*0.15}} className="p-6 bg-white rounded-2xl shadow">
              <div className="text-xl font-bold">{t}</div>
              <div className="text-gray-600 mt-2">Detalii pas</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
