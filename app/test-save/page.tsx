import { saveProject } from '@/lib/saveProject';

export default function TestSave() {
  const handleTestSave = async () => {
    try {
      const result = await saveProject({
        renovationType: 'kitchen',
        initialPrompt: 'I want to renovate my kitchen with modern appliances',
        minPrice: 25000,
        maxPrice: 35000,
        interestLevel: 'interested',
        estimatedTimeline: '2-3 months'
      });
      console.log('Project saved successfully:', result);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Check console for details.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Save Project</h1>
      <button
        onClick={handleTestSave}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Save Project
      </button>
    </div>
  );
} 