import { Button } from "@/components/ui/button";
import { LinkedinIcon, Mail } from "lucide-react";

const TeamSection = () => {
  return (
    <section className="min-h-screen py-24 flex flex-col items-center justify-center">
      <div className="max-w-layout mx-auto px-6 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8">
          Meet Our Leadership Team
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight">
          Experienced Legal Professionals & <span className="text-yellow-400">AI Experts</span>
        </h2>
        
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          Our team combines decades of legal expertise with cutting-edge AI technology
          to revolutionize legal services accessibility.
        </p>

        <div className="mt-16 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 w-full group hover:shadow-md transition-all duration-300">
            <img
              src={teamMembers[0].image}
              alt={teamMembers[0].name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-slate-100"
            />
            <h3 className="text-xl font-bold text-slate-900">{teamMembers[0].name}</h3>
            <p className="text-slate-600 mb-2">{teamMembers[0].role}</p>
            
            <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-3 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <p className="text-slate-700 text-sm mb-4">{teamMembers[0].bio}</p>
            </div>
            
            <div className="flex justify-center mt-4">
              <a
                href={teamMembers[0].linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label={`${teamMembers[0].name}'s LinkedIn profile`}
              >
                <LinkedinIcon className="w-5 h-5 text-blue-600" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-slate-200 text-slate-900 hover:bg-slate-50"
            onClick={() => window.location.href = 'https://talent.associateattorney.ai'}
          >
            Join Our Team
          </Button>
        </div>
      </div>
    </section>
  );
};

const teamMembers = [
  {
    name: "Vikas Kedia",
    role: "Chief Executive Officer",
    bio: "Vikas brings over 15 years of experience in legal tech innovation and business leadership, driving our mission to make legal services more accessible through AI.",
    image: "/image.png",
    linkedin: "https://www.linkedin.com/in/vikaskedia/",
  }
];

export default TeamSection; 