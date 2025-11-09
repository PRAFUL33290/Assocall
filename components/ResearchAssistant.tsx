import React, { useState } from 'react';
import { getGroundedAnswer } from '../services/geminiService';
import { LoadingSpinner, SearchIcon } from './icons';
import { GroundingMetadata } from '../types';

const ResearchAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [metadata, setMetadata] = useState<GroundingMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult('');
    setMetadata(null);
    setError('');

    try {
      const { text, metadata: groundingData } = await getGroundedAnswer(prompt);
      setResult(text);
      setMetadata(groundingData);
    } catch (err) {
      setError('Échec de la récupération des informations. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-asso-blue/10 rounded-full">
          <SearchIcon />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-poppins">Assistant de Recherche IA</h2>
          <p className="text-gray-600">Obtenez des informations et des sources à jour pour vos propositions de projet.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ex: 'Dernières statistiques sur le chômage des jeunes en France'"
            className="flex-grow p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue focus:border-asso-blue transition-colors text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex justify-center items-center gap-2 bg-asso-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <LoadingSpinner /> : <SearchIcon />}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {isLoading && (
         <div className="mt-6 text-center">
             <div className="flex justify-center items-center gap-2 text-gray-600">
                 <LoadingSpinner />
                 <span>Recherche de réponses sur le web...</span>
             </div>
         </div>
      )}

      {result && !isLoading && (
        <div className="mt-6 bg-light-gray p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-asso-green">Réponse :</h3>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{result}</div>

          {metadata?.groundingChunks && metadata.groundingChunks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Sources :</h4>
              <ul className="list-disc list-inside space-y-1">
                {/* Fix: Filter out sources that do not have a URI to prevent broken links. */}
                {metadata.groundingChunks.filter(c => c.web?.uri).map((chunk, index) => (
                  <li key={index}>
                    <a href={chunk.web!.uri} target="_blank" rel="noopener noreferrer" className="text-asso-blue hover:underline">
                      {chunk.web!.title || chunk.web!.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchAssistant;