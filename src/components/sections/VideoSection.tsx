const VideoSection = () => {
  return (
    <section className="pt-20 pb-24">
      <div className="max-w-layout mx-auto px-6">
        <div className="max-w-[1080px] mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              Product Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              See How It <span className="text-[#FFB800]">Works</span>
            </h2>
          </div>

          {/* Decorative elements matching your hero aesthetic */}
          <div className="absolute -left-20 top-10 w-40 h-40 bg-[#0A0F1F]/5 rounded-full blur-3xl" />
          <div className="absolute -right-20 bottom-10 w-40 h-40 bg-[#FFB800]/5 rounded-full blur-3xl" />
          
          {/* Video Container */}
          <div className="relative mt-8">
            {/* Subtle top badge similar to your GitHub button style */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="px-4 py-2 bg-[#F3F4F6] bg-opacity-80 backdrop-blur-sm rounded-full border border-slate-200">
                <p className="text-sm font-medium text-slate-700">
                  Watch How It Works
                </p>
              </div>
            </div>

            {/* Main video container */}
            <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-slate-100">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/ivlEf2dj0D4"
                  title="AssociateAttorney.AI Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;