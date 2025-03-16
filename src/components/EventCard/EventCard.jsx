import { useState } from 'react'


function Card(props) {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='bg- p-2 w-[500px] h-[750px] max-h-screen text-start rounded-3xl mt-5'> 

        {/* banner image */}
        <div className='w-full h-[300px] bg-black rounded-tl-3xl rounded-tr-3xl'>
            <img
                src={props.image}
                alt="image"
                className='w-full h-full rounded-tl-3xl rounded-tr-3xl'
            />
        </div>

        {/* event details */}

        <div className='w-full h-[50%] text-black rounded-bl-3xl rounded-br-3xl'>

            {/* description about event*/}
            <div>
                <p className='leading-6'>
                    <p>
                        <b>{props.boldText}</b><br />

                        <p> {props.description1}</p><br />
                        <p>{props.description2}</p><br />
                        <p><b>{props.description3}</b></p><br />
                        <p>{props.description4}</p><br />
                        {/* 🚀💻 Written Code: Celebrating Women Who Redefine IT! <br />
                        This International Women’s Day, join us to celebrate the women shaping the future of tech!<br /><br /> */}
                    {/* </p>
                    🎙️ <b>Speakers</b><br />
                    🌟 <b>Nikita Sawarkar</b> – Co-Founder, Ofis India | Corporate Communications Specialist<br />
                    🌟 <b>Nidhi Bawashe</b> – Project Manager, delaPlex Ltd. | Podcast Founder | Charter Member, TiE Delhi-NCR<br />
                    🌟 <b>Rashi Tiwari</b> – Senior Team Manager (Technical), IKS Health<br /><br/>
                    💡 What’s in Store?<br />
                    🔹 Leadership, innovation & breaking barriers in tech<br />
                    🔹 Insights from industry leaders & career growth tips<br />
                    🔹 Networking & exciting surprises! 🎁<br /> */}
                </p>
            </p>
            </div>

            <div className='mt-4'>
                <p>
                📍 <b>Venue:</b> {props.Venue}<br />
                📅 <b>Date:</b> {props.Date}<br />
                ⏰ <b>Time:</b> {props.Time}<br />
                🔗 <b>Registration Link:</b> {props.Register}<br />
                </p>
            </div>

            {/* 
            
            













Tag your friends & join us in celebrating the women redefining IT! 💻✨
            
            */}

        </div>
      
     </div>
    </>
  )
}

export default Card