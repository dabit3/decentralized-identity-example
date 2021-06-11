import '../styles/globals.css'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav>
        <div
          className="pt-4 pb-2 px-10 border-b"
        >
          <Image src="/icon.svg" height={50} width={50} />
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
