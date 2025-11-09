import React from 'react';
import { municipalities } from '../data/municipalities';
import { OfficeBuildingIcon } from './icons';

const MunicipalitiesView: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 font-poppins">Mairies Partenaires</h1>
                <p className="text-gray-600 mt-1">
                    Consultez les informations des mairies où vous pouvez soumettre vos projets.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {municipalities.map(m => (
                    <div key={m.commune} className="bg-light-gray p-5 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-asso-blue/10 rounded-full">
                                <OfficeBuildingIcon />
                            </div>
                            <h2 className="text-xl font-bold font-poppins text-gray-800">{m.commune}</h2>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Adresse :</strong> {m.adresse || 'N/A'}</p>
                            <p><strong>Tél. :</strong> {m.telephone || 'N/A'}</p>
                            <p><strong>Email :</strong> <a href={`mailto:${m.email}`} className="text-asso-blue hover:underline break-all">{m.email || 'N/A'}</a></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MunicipalitiesView;