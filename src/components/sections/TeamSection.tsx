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

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-8">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-slate-600 mb-4">{member.role}</p>
              <div className="flex justify-center gap-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5 text-blue-600" />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Mail className="w-5 h-5 text-slate-600" />
                </a>
              </div>
            </div>
          ))}
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
    image: "/image.png",
    linkedin: "https://www.linkedin.com/in/vikaskedia/",
    email: "vikas@associateattorney.ai"
  },
  {
    name: "Jessica Mahoney",
    role: "Legal Innovation and Integration Officer",
    image: "/jessica.jpg",
    linkedin: "https://www.linkedin.com/in/jessica-mahoney-7769a0349",
    email: "jessica@westviewlegal.com"
  }
];

export default TeamSection; 