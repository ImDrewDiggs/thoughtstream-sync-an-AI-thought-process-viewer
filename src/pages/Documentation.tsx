
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="glass-panel p-8 animate-appear">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              ThoughtStream Sync Documentation
            </h1>
            <Link to="/">
              <Button variant="outline">Back to App</Button>
            </Link>
          </div>
          
          <Separator className="my-6" />
          
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Getting Started</h2>
              <p className="text-gray-600">
                ThoughtStream Sync is an application that helps you visualize the thought process of AI models in real-time. 
                Follow these steps to get started:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Select an AI model from the list or upload your own custom model configuration.</li>
                <li>Connect your OpenAI API key to enable real-time thought visualization.</li>
                <li>Enter a prompt and generate the AI's thought process.</li>
                <li>Visualize and explore the AI's thinking with our interactive timeline.</li>
              </ol>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Connecting Your OpenAI API</h2>
              <p className="text-gray-600">
                To visualize real AI thought processes, you need to connect your OpenAI API key:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>
                  <strong>Get an API Key:</strong> If you don't already have an OpenAI API key, visit{" "}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                    platform.openai.com/api-keys
                  </a>
                  {" "}to create one.
                </li>
                <li>
                  <strong>Connect API:</strong> Click the "Connect API" button in the Model Selector panel.
                </li>
                <li>
                  <strong>Enter API Key:</strong> Enter your OpenAI API key in the dialog box. Your key will be stored securely in your browser's local storage and is never sent to our servers.
                </li>
                <li>
                  <strong>Update API Key:</strong> To update or change your API key, click "Update API Key" in the Model Selector panel.
                </li>
              </ol>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700 text-sm">
                  <strong>Note:</strong> API usage will be billed to your OpenAI account based on their current pricing. We recommend monitoring your usage on the OpenAI platform.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Selecting Models</h2>
              <p className="text-gray-600">
                ThoughtStream Sync offers several predefined AI models and allows custom model configurations:
              </p>
              <h3 className="text-lg font-medium text-gray-700">Predefined Models</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><strong>GPT-4 Mini:</strong> A smaller, faster version of GPT-4 that's great for quick thought explorations.</li>
                <li><strong>GPT-4:</strong> OpenAI's most advanced model with deeper thinking capabilities.</li>
                <li><strong>Claude-3:</strong> Anthropic's AI model (simulated using OpenAI).</li>
                <li><strong>Llama-3:</strong> Meta's open-source AI model (simulated using OpenAI).</li>
                <li><strong>Gemini Pro:</strong> Google's AI model (simulated using OpenAI).</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-700">Custom Models</h3>
              <p className="text-gray-600">
                To upload a custom model configuration:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Go to the "Upload Custom Model" panel.</li>
                <li>Fill in the model name, type, and description.</li>
                <li>Click "Add Model" to add it to your available models.</li>
              </ol>
              <p className="text-gray-600">
                Custom models use OpenAI's API under the hood but can help you organize different prompting strategies or use cases.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Generating Thought Processes</h2>
              <p className="text-gray-600">
                After connecting your API and selecting a model:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Enter a prompt in the text field. More complex, challenging prompts often reveal more interesting thought processes.</li>
                <li>Click the "Generate Thought Process" button to start the visualization.</li>
                <li>The application will stream the AI's thoughts in real-time, visualizing them as connected nodes.</li>
                <li>Once complete, you can explore the entire thought sequence using the timeline controls.</li>
              </ol>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Pro Tip:</strong> Try prompts that require step-by-step reasoning, like math problems, logical puzzles, or complex decision-making scenarios to see the most detailed thought processes.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Using the Visualization Timeline</h2>
              <p className="text-gray-600">
                The timeline allows you to explore the AI's thought process:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><strong>Play/Pause:</strong> Animate through the thought process automatically.</li>
                <li><strong>Slider:</strong> Manually scrub through different stages of thinking.</li>
                <li><strong>Reset:</strong> Return to the beginning of the thought sequence.</li>
                <li><strong>Nodes:</strong> Each node represents a distinct thought or processing step, color-coded by type:
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li><span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span> Input nodes represent the initial prompt processing.</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span> Processing nodes show computational steps.</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-2"></span> Decision nodes indicate choice points or evaluations.</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-purple-400 mr-2"></span> Output nodes represent conclusions or final responses.</li>
                  </ul>
                </li>
                <li><strong>Connections:</strong> Animated lines show the flow of thought from one node to another.</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Technical Details</h2>
              <p className="text-gray-600">
                ThoughtStream Sync visualizes AI thinking by:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Connecting to OpenAI's API with streaming enabled.</li>
                <li>Processing the token-by-token response and organizing it into logical thought nodes.</li>
                <li>Analyzing content patterns to determine node types (processing, decision, output).</li>
                <li>Creating a visual graph of the thought sequence with timestamps.</li>
                <li>Providing playback controls to explore the temporal sequence of thoughts.</li>
              </ol>
              <p className="text-gray-600">
                The application runs entirely in your browser and data is not stored on our servers. All API calls are made directly from your browser to OpenAI using your API key.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Troubleshooting</h2>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">API Connection Issues</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li><strong>Invalid API Key:</strong> Ensure your OpenAI API key is correct and has not expired.</li>
                  <li><strong>API Rate Limits:</strong> If you encounter errors about rate limits, you may need to wait before making additional requests or upgrade your OpenAI plan.</li>
                  <li><strong>Billing Issues:</strong> Ensure your OpenAI account has valid payment information if you're using a paid tier.</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">Visualization Problems</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li><strong>No Thoughts Appearing:</strong> Check that your API key is valid and that your prompt is substantial enough to generate multiple thinking steps.</li>
                  <li><strong>Playback Issues:</strong> If timeline playback is not working correctly, try refreshing the page and generating a new thought process.</li>
                  <li><strong>Browser Compatibility:</strong> Ensure you're using a modern, updated browser. The application works best on Chrome, Firefox, Safari, or Edge.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        <p>ThoughtStream Sync — Visualize AI thinking in real-time</p>
      </footer>
    </div>
  );
};

export default Documentation;
