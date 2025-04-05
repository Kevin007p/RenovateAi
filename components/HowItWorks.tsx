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
            <h3 className="text-lg font-semibold text-white">Upload & Describe</h3>
          </div>
          <p className="text-gray-400">
            Upload images of your current space and desired outcome, then describe your renovation vision.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-6 border border-[#3a3a3a]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#8B0000] text-white rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <h3 className="text-lg font-semibold text-white">Chat with AI</h3>
          </div>
          <p className="text-gray-400">
            Our AI analyzes your project and provides a detailed estimate through an interactive chat.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-6 border border-[#3a3a3a]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#8B0000] text-white rounded-full flex items-center justify-center font-bold mr-3">
              3
            </div>
            <h3 className="text-lg font-semibold text-white">Get Connected</h3>
          </div>
          <p className="text-gray-400">
            If you're interested, we'll connect you with qualified contractors to bring your vision to life.
          </p>
        </div>
      </div>
    </div>
  );
} 