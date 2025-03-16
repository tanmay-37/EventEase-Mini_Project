import { useState } from 'react'
// import { Outlet } from 'react-router-dom'
// import './App.css'
// import './index.css'
// import Card from './components/Event_cards/Card'
import Card from './components/Event_cards/Card';
import TBIEvent from './components/Event_cards/TBI_event.jpeg';
import WrittenCodeEvent from './components/Event_cards/written_code_event.jpeg';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    {/* event cards */}
     <div className='bg-[#F5EFFF] p-6 w-screen h-auto text-start'>
         
        <h2 className='text-black text-5xl font-bold'>Upcoming Events</h2>

        <div className='flex flex-wrap justify-start items-center gap-4'>

          <Card  
          image = {WrittenCodeEvent} 
          alt = "writtenCodeEvent banner image"
          Date = "Saturday, March 8 , 2025"
          Time = "2 : 00 PM - 5 : 00 PM" 
          Venue = "DT 301"
          Register = "Scan the QR code to register now!"
          boldText = "Altronix Presents:"
          description1 = "Written Code: Celebrating Women Who Redefine IT!"
          
          description2 = "This International Women’s Day, join us to celebrate the women shaping the future of tech!"
          description3 = "🎙️ Speakers :"
          description4 =  "🌟 Nikita Sawarkar – Co-Founder, Ofis India | Corporate Communications Specialist 🌟 Nidhi Bawashe – Project Manager, delaPlex Ltd. | Podcast Founder | Charter Member, TiE Delhi-NCR 🌟 Rashi Tiwari – Senior Team Manager (Technical), IKS Health"/>

          <Card 
          image={TBIEvent}
          alt = "TBIEvent banner image"
          Date = "Monday, March 10, 2025"
          Time = "3:00 PM - 4:00 PM" 
          Venue = "MBA Auditorium"
          Register = "https://forms.gle/TZocqf367vcpUTBL7"
          boldText = "Meet the Innovators: Akshay Holey & Divya Lohakare Holey"
          description1 = "Founders of Shaya Enterprises – Central India's first Kashmiri Kesar grower!"

          description2 = "Join us for an exciting session on Entrepreneurship & Innovation and learn from these trailblazers about their journey in revolutionizing the agricultural industry!"

          description3 = "An inspiring opportunity you won't want to miss! 🌱"
          description4 = "This session aims to inspire and guide aspiring entrepreneurs to think big and take action toward their business goals."
          />

          <Card />

        </div>
     </div>
    </>
  )
}

export default App
