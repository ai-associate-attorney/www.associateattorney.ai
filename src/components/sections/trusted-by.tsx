// import { Container } from "@/components/ui/container"

// interface Client {
//   name: string
//   logo: string
//   alt: string
//   badge?: string
// }

// const clients: Client[] = [
//   {
//     name: "Client 1",
//     logo: "/clients/client1.svg", // Add your client logos to public/clients/
//     alt: "Client 1 logo"
//   },
//   // Add more clients here
// ]

// export function TrustedBy() {
//   const clients: Client[] = [
//     {
//       name: "West View Law Group",
//       logo: "/wvl.png",
//       alt: "West View Law Group logo",
//     },
//     {
//       name: "Oak View Law Group",
//       logo: "/ovl.jpg",
//       alt: "Oak View Law Group logo",
//     },
//     // Add more clients here (4-6 total)
//   ]

//   return (
//     <section className="w-full py-16 bg-white">
//       <Container>
//         <div className="flex flex-col items-center space-y-12">
//           <h2 className="text-3xl font-bold text-center">
//             Trusted by Leading Law Firms
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center gap-12 w-full">
//             {clients.map((client) => (
//               <div 
//                 key={client.name}
//                 className="flex flex-col items-center justify-center p-6"
//               >
//                 <img
//                   className="h-12 md:h-16 object-contain grayscale opacity-70 hover:opacity-100 transition-all duration-300"
//                   src={client.logo}
//                   alt={client.alt}
//                   loading="lazy"
//                 />
//                 {client.badge && (
//                   <img
//                     src={client.badge}
//                     alt="Endorsement badge"
//                     className="h-6 mt-3 opacity-70"
//                     loading="lazy"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
          
//           <p className="text-lg text-gray-600 text-center max-w-2xl italic">
//             "The platform has transformed how we manage cases and interact with clients."
//           </p>
//         </div>
//       </Container>
//     </section>
//   )
// } 