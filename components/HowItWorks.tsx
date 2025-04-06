'use client';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-6 text-white">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-6 border border-[#3a3a3a]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#8B0000] text-white rounded-full flex items-center justify-center font-bold mr-3">
              1
            </div>
            <h3 className="text-lg font-semibold text-white">Share Your Vision</h3>
          </div>
          <p className="text-gray-400">
            Upload before & after inspiration photos, describe your renovation goals, and set your preferred timeline.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-6 border border-[#3a3a3a]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#8B0000] text-white rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <h3 className="text-lg font-semibold text-white">Get Instant Estimates</h3>
          </div>
          <p className="text-gray-400">
            Our AI analyzes your photos and requirements, providing real-time price estimates and answering your questions.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-6 border border-[#3a3a3a]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#8B0000] text-white rounded-full flex items-center justify-center font-bold mr-3">
              3
            </div>
            <h3 className="text-lg font-semibold text-white">Choose Your Path</h3>
          </div>
          <p className="text-gray-400">
            Decide if you're ready to proceed, need time to think, or want to explore other options. We'll guide you accordingly.
          </p>
        </div>
      </div>
    </div>
  );
} 