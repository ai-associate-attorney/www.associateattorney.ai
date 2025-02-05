import { Container } from "@/components/layout/container"

interface Client {
  name: string
  logo: string
  alt: string
}

const clients: Client[] = [
  {
    name: "Client 1",
    logo: "/clients/client1.svg", // Add your client logos to public/clients/
    alt: "Client 1 logo"
  },
  // Add more clients here
]

export function TrustedBy() {
  const clients = [
    {
      name: "Company One",
      logo: "/wvl.png",
      alt: "Company One logo"
    },
    // Add at least 8-10 clients for smooth animation
  ]

  return (
    <section className="w-full flex justify-center bg-[#0B1120] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-24">
        <div className="flex flex-col items-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-white text-center max-w-2xl">
            Trusted by Leading Law Firms
          </h2>
          <p className="text-lg text-slate-300 text-center max-w-xl">
            Join forward-thinking law firms already using our AI-powered platform
          </p>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex space-x-16 min-w-full">
              {clients.map((client) => (
                <div 
                  key={client.name}
                  className="flex-none w-[300px] flex items-center justify-center p-12 
                             rounded-lg transition-all duration-200 hover:bg-slate-800/30"
                >
                  <img
                    className="w-full max-h-24 object-contain opacity-80 
                               transition-all duration-200 hover:opacity-100"
                    src={client.logo}
                    alt={client.alt}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex space-x-16 min-w-full">
              {clients.map((client) => (
                <div 
                  key={`${client.name}-dup`}
                  className="flex-none w-[300px] flex items-center justify-center p-12 
                             rounded-lg transition-all duration-200 hover:bg-slate-800/30"
                >
                  <img
                    className="w-full max-h-24 object-contain opacity-80 
                               transition-all duration-200 hover:opacity-100"
                    src={client.logo}
                    alt={client.alt}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 