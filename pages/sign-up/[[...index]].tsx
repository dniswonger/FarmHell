import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'
import farmhell_landing from '@/assets/images/farmhell_landing.jpg'

export default function Page() {
    return (
        <div className='flex flex-col items-center justify-center h-full bg-[#F2EEC0]' >
        <h1 className='text-8xl text-sky-400 font-bokor'>FARMHELL</h1>
        <h3 className='text-lg text-sky-400'>A devilishly simple way to manage your farm!</h3>
        <div className='flex justify-center items-center m-10 w-[200px] h-[200px] sm:m-20 sm:w-[400px] sm:h-[400px]'>
            <Image src={farmhell_landing} alt="Farmhell" layout='responsive' />
        </div>
        <SignUp />
    </div>
    )
}