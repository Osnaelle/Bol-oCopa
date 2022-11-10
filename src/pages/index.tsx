
import Image from 'next/image'
import appPreviewImg from '../assets/aplicacao-trilha-ignite.png'
import logo from '../assets/logo.svg'
import avatares from '../assets/avatares.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number;
  guessesCount: number;
  usersCount: number;
}



export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle]= useState("")

  async function createPool(event: FormEvent){
    event.preventDefault()
   
    try{
      const response=  await api.post('/pools',{
       title:poolTitle, 

    })

    const{code }= response.data

    await navigator.clipboard.writeText(code)

    alert("Bolão criado com sucesso, o codigo foi copiado para a área de tranferência")

    setPoolTitle("")
  }catch (err){
    console.log(err)
    alert("Falha ao criar o bolão, tente novamente")
  }
}
  return(
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main> 
        <Image src={logo} alt="NLW Copa"></Image>

        <h1 className='mt-14 text-white text-4xl font-bold leading-tight'>
          Crie o seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={avatares} alt="exemplo avatares"></Image>
           <strong className='text-gray-100 text-xl'>
               <span className='text-ignite-500'>+{props.usersCount}</span> pessoas já estão usando
           </strong>
          </div>

          <form onSubmit={createPool} className='mt-8 flex gap-1'>
            <input className='flex-1 px-6 py-4 rounder bg-gray-800 border border-gray-600 text-sm text-gray-100' 
            type="text" 
            required placeholder="Qual nome do seu bolão?" 
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
            />
           
            <button className='bg-yellow-500 py-6 px-4 rounder text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' 
             type='submit'>Criar meu bolão</button>
          </form>

          <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
             Após criar seu bolão, você receberá um código único que poderá convidar amigos!</p>


          <div className='mt-6 pt-10 border-t border-gray-600  flex items-center justify-between text-gray-100 '>
            <div className='flex items-center gap-6'>
               <Image src={iconCheck} alt=""></Image>
               <div className='flex flex-col'>
                 <span className='font-bold text-2xl'>+{props.poolCount}</span>
                 <span>Bolões criados </span>
               </div>
            </div>

            <div className='w-px h-14 bg-gray-600'>

            </div>

            <div className= 'flex items-center gap-6'>
               <Image src={iconCheck} alt=""></Image>
               <div className='flex flex-col'>
                 <span className='font-bold text-2xl'>+{props.guessesCount}</span>
              
                 <span>Palpites enviado </span>
               </div>
            </div>
          </div>
      </main>


       <Image src={appPreviewImg} alt="Dois celulares exibindo uma previa do mobile"
       quality={100}/>
      
    </div>
   
  )

}
export const getServerSideProps = async()=>{



   const [poolCountResponse,guessCountResponse, userCountResponse] = await Promise.all([
         api.get("pools/count"),
         api.get("guesses/count"),
         api.get("users/count"),
   ])
  

  return {
    props:{
      poolCount:poolCountResponse.data.count ,
      guessesCount:guessCountResponse.data.count ,
      usersCount:userCountResponse.data.count ,
      
      
    }
  }
}