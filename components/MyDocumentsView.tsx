import React, { useState } from 'react';
import { spontaneousApplicationForm, FormField, FormSection } from '../data/spontaneousApplicationForm';
import { municipalities } from '../data/municipalities';
import { SparklesIcon, TrashIcon, LoadingSpinner, DocumentTextIcon, PaperclipIcon, SendIcon, SuccessIcon } from './icons';
import { generateProjectContent } from '../services/geminiService';
import { generatePdfFromFormData } from '../services/pdfService';
import { SubscriptionPlan, UserRole, PaymentMethod } from '../types';

type FormData = Record<string, any>;

interface MyDocumentsViewProps {
    user: { 
        subscriptionPlan: SubscriptionPlan; 
        pdfExportsUsed: number;
        paymentMethod: PaymentMethod | null;
    } | null;
    onPdfExported: () => void;
}

const CollapsibleSection: React.FC<{
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}> = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            <button
                type="button"
                className={`w-full flex justify-between items-center p-4 text-left ${isOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                onClick={onClick}
            >
                <h3 className="text-lg font-bold text-gray-800 font-poppins">{title}</h3>
                <svg
                    className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyDocumentsView: React.FC<MyDocumentsViewProps> = ({ user, onPdfExported }) => {
    const [formData, setFormData] = useState<FormData>({});
    const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
    const [aiImagePrompts, setAiImagePrompts] = useState<Record<string, string>>({});
    const [isExporting, setIsExporting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
    const [openSection, setOpenSection] = useState<string | null>(spontaneousApplicationForm.sections[0]?.id || null);

    const handleInputChange = (sectionId: string, fieldLabel: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [sectionId]: {
                ...(prev[sectionId] || {}),
                [fieldLabel]: value,
            }
        }));
    };

    const handleFileChange = (sectionId: string, fieldLabel: string, file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange(sectionId, fieldLabel, {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    base64: reader.result
                });
            };
            reader.readAsDataURL(file);
        } else {
             handleInputChange(sectionId, fieldLabel, null);
        }
    };
    
    const handleMultiFileChange = (sectionId: string, fieldLabel: string, files: FileList | null) => {
        if (!files) return;
        const currentFiles = formData[sectionId]?.[fieldLabel] || [];
        const newFilesPromises = Array.from(files).map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        base64: reader.result
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newFilesPromises).then(newFiles => {
            handleInputChange(sectionId, fieldLabel, [...currentFiles, ...newFiles]);
        });
    };

    const removeMultiFile = (sectionId: string, fieldLabel: string, index: number) => {
        const currentFiles = formData[sectionId]?.[fieldLabel] || [];
        handleInputChange(sectionId, fieldLabel, currentFiles.filter((_: any, i: number) => i !== index));
    };


    const handleListChange = (sectionId: string, fieldLabel: string, index: number, value: string) => {
        const list = formData[sectionId]?.[fieldLabel] || [];
        const newList = [...list];
        newList[index] = value;
        handleInputChange(sectionId, fieldLabel, newList);
    };

    const addListItem = (sectionId: string, fieldLabel: string) => {
        const list = formData[sectionId]?.[fieldLabel] || [];
        handleInputChange(sectionId, fieldLabel, [...list, '']);
    };

    const removeListItem = (sectionId: string, fieldLabel: string, index: number) => {
        const list = formData[sectionId]?.[fieldLabel] || [];
        handleInputChange(sectionId, fieldLabel, list.filter((_: any, i: number) => i !== index));
    };


    const handleGenerateAI = async (sectionId: string, fieldLabel: string) => {
        setIsGenerating(prev => ({ ...prev, [fieldLabel]: true }));
        try {
            const model = (user?.subscriptionPlan === SubscriptionPlan.ESSENTIAL || user?.subscriptionPlan === SubscriptionPlan.PRO) 
                ? 'gemini-2.5-pro' 
                : 'gemini-2.5-flash';

            const projectTitle = formData['presentation_projet']?.['Titre du projet'] || '';
            const projectSummary = formData['presentation_projet']?.['Résumé du projet'] || '';

            let contextPrompt = '';
            if (projectTitle) {
                contextPrompt += `Le projet s'intitule "${projectTitle}". `;
            }
            if (projectSummary) {
                contextPrompt += `Voici son résumé : "${projectSummary}". `;
            }
            
            const prompt = `Tu es un expert en rédaction de dossiers de subvention. Rédige un contenu concis et professionnel pour le champ suivant : "${fieldLabel}". ${contextPrompt} Ne fournis que le texte demandé, sans introduction ni conclusion.`;

            const generatedText = await generateProjectContent(prompt, model);
            handleInputChange(sectionId, fieldLabel, generatedText);

        } catch (error) {
            console.error("Erreur de génération AI:", error);
            const errorMessage = "Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.";
            handleInputChange(sectionId, fieldLabel, errorMessage);
            setSubmissionStatus({ type: 'error', message: errorMessage });
            setTimeout(() => setSubmissionStatus(null), 4000);
        } finally {
            setIsGenerating(prev => ({ ...prev, [fieldLabel]: false }));
        }
    };

    const handleGenerateImageAI = async (sectionId: string, fieldLabel: string, fieldId: string) => {
        const prompt = aiImagePrompts[fieldId];
        if (!prompt) {
            setSubmissionStatus({ type: 'error', message: "Veuillez entrer une description pour l'image." });
            setTimeout(() => setSubmissionStatus(null), 3000);
            return;
        }
        setIsGenerating(prev => ({ ...prev, [fieldId]: true }));
        try {
            const base64Data = await generateProjectContent(prompt, 'gemini-2.5-flash-image');
            if (base64Data && !base64Data.startsWith('Erreur:')) {
                handleInputChange(sectionId, fieldLabel, {
                    name: `image-ia-${Date.now()}.png`,
                    type: 'image/png',
                    base64: `data:image/png;base64,${base64Data}`
                });
            } else {
                setSubmissionStatus({ type: 'error', message: base64Data || "Une erreur est survenue lors de la génération de l'image." });
                setTimeout(() => setSubmissionStatus(null), 4000);
            }
        } catch (error) {
            console.error("Erreur de génération d'image AI:", error);
            setSubmissionStatus({ type: 'error', message: "Une erreur est survenue lors de la génération de l'image." });
            setTimeout(() => setSubmissionStatus(null), 4000);
        } finally {
            setIsGenerating(prev => ({ ...prev, [fieldId]: false }));
        }
    };

    const handlePdfExport = async (): Promise<boolean> => {
        setIsExporting(true);
        setSubmissionStatus(null);
        
        const isFreeUser = user?.subscriptionPlan === SubscriptionPlan.FREE;
        const freeExportsUsed = user?.pdfExportsUsed || 0;
        const hasExceededFreeLimit = isFreeUser && freeExportsUsed >= 3;

        if (hasExceededFreeLimit) {
            if (!user?.paymentMethod) {
                alert("Vous n'avez plus d'exports gratuits et aucun moyen de paiement n'est enregistré. Veuillez en ajouter un dans l'onglet 'Abonnement'.");
                setIsExporting(false);
                return false;
            }
            const proceed = window.confirm(`Vous avez utilisé vos 3 exports gratuits. Cet export sera facturé 1€. Continuer ?`);
            if (!proceed) {
                setIsExporting(false);
                return false;
            }
        }
        
        try {
            await generatePdfFromFormData(formData);
            setSubmissionStatus({ type: 'success', message: 'PDF généré et téléchargé avec succès !' });
            
            if (isFreeUser && !hasExceededFreeLimit) {
                onPdfExported();
            }
            
            setTimeout(() => setSubmissionStatus(null), 4000);
            return true;
        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
            setSubmissionStatus({ type: 'error', message: "Une erreur est survenue lors de la génération du PDF."});
            setTimeout(() => setSubmissionStatus(null), 6000);
            return false;
        } finally {
            setIsExporting(false);
        }
    };


    const handleAction = async (action?: string) => {
        const selectedMairie = formData['export_envoi']?.['Choisir la mairie destinataire'];
        switch(action) {
            case 'generate_pdf':
                await handlePdfExport();
                break;
            case 'generate_pdf_and_send':
                if (!selectedMairie) {
                    setSubmissionStatus({ type: 'error', message: "Veuillez d'abord sélectionner une mairie destinataire." });
                    setTimeout(() => setSubmissionStatus(null), 4000);
                    return;
                }
                
                const pdfGenerated = await handlePdfExport();
                if (!pdfGenerated) return;

                // Prepare mailto link after PDF is confirmed generated
                try {
                    const municipality = municipalities.find(m => m.commune === selectedMairie);
                    if (!municipality || !municipality.email) {
                        throw new Error(`Email non trouvé pour la mairie de ${selectedMairie}.`);
                    }
            
                    const projectName = formData['presentation_projet']?.['Titre du projet'] || 'Sans Titre';
                    const structureName = formData['infos_generales']?.['Nom de la structure'] || 'Notre structure';
                    const pdfFileName = `Dossier_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

                    const subject = encodeURIComponent(`Candidature Spontanée : ${projectName}`);
                    const body = encodeURIComponent(
`Bonjour,

Veuillez trouver en pièce jointe notre dossier de candidature pour le projet "${projectName}".

Ce dossier a été généré via la plateforme AssoCall AI.

Cordialement,
${structureName}

---
Cet e-mail a été pré-rempli par AssoCall. N'oubliez pas de joindre le fichier PDF "${pdfFileName}" qui vient d'être téléchargé sur votre ordinateur avant d'envoyer.`
                    );
            
                    window.location.href = `mailto:${municipality.email}?subject=${subject}&body=${body}`;
            
                    setSubmissionStatus({ type: 'success', message: 'PDF généré ! Votre client de messagerie devrait s\'ouvrir pour finaliser l\'envoi.' });
                    setTimeout(() => setSubmissionStatus(null), 6000);
                } catch(error: any) {
                     setSubmissionStatus({ type: 'error', message: error.message || "Une erreur est survenue." });
                     setTimeout(() => setSubmissionStatus(null), 6000);
                }
                break;
            default:
                console.warn('Action non reconnue:', action);
        }
    };

    const renderField = (field: FormField, sectionId: string) => {
        const fieldId = `${sectionId}-${field.label.replace(/\s+/g, '-')}`;
        const value = formData[sectionId]?.[field.label];

        const commonProps = {
            id: fieldId,
            name: fieldId,
            placeholder: field.placeholder,
            required: field.required,
            className: "input-field",
        };

        const renderInput = (type: string) => (
            <input
                type={type}
                {...commonProps}
                value={value || ''}
                onChange={(e) => handleInputChange(sectionId, field.label, e.target.value)}
            />
        );

        switch (field.type) {
            case 'text':
            case 'tel':
            case 'email':
            case 'url':
                return renderInput(field.type);
            case 'number':
                 return <input type="number" {...commonProps} value={value || ''} onChange={(e) => handleInputChange(sectionId, field.label, e.target.valueAsNumber)} />;
            case 'textarea':
                return (
                     <textarea
                        {...commonProps}
                        rows={5}
                        value={value || ''}
                        onChange={(e) => handleInputChange(sectionId, field.label, e.target.value)}
                    />
                );
            case 'select':
                 return (
                    <select {...commonProps} value={value || (field.multiple ? [] : '')} multiple={field.multiple} onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                        handleInputChange(sectionId, field.label, field.multiple ? selected : selected[0]);
                    }}>
                        <option value="" disabled>{field.placeholder || 'Sélectionnez...'}</option>
                        {Array.isArray(field.options) && field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                );
            case 'select_mairie':
                return (
                    <select {...commonProps} value={value || ''} onChange={(e) => handleInputChange(sectionId, field.label, e.target.value)}>
                        <option value="" disabled>{field.placeholder}</option>
                        {municipalities.map(m => <option key={m.commune} value={m.commune}>{m.commune}</option>)}
                    </select>
                );
            case 'image':
                const canUpload = field.mode?.includes('upload') ?? true;
                const canGenerate = field.mode?.includes('ia_generate') ?? false;

                return (
                    <div className="p-3 border rounded-lg bg-light-gray space-y-4">
                        {canUpload && (
                            <div>
                                <input type="file" className="hidden" id={fieldId} onChange={e => handleFileChange(sectionId, field.label, e.target.files ? e.target.files[0] : null)} accept="image/*" />
                                <label htmlFor={fieldId} className="input-field-file">
                                   <PaperclipIcon /> {value?.name || field.placeholder || 'Choisir une image'}
                                </label>
                            </div>
                        )}
                        
                        {canUpload && canGenerate && (
                            <div className="flex items-center text-center">
                                <hr className="flex-grow border-gray-300" />
                                <span className="px-2 text-sm text-gray-500 font-semibold">OU</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                        )}

                        {canGenerate && (
                            <div className="space-y-2">
                                <label htmlFor={`${fieldId}-ai-prompt`} className="block text-sm font-medium text-gray-700">Générer une image par IA</label>
                                <textarea
                                    id={`${fieldId}-ai-prompt`}
                                    placeholder="Décrivez l'image que vous souhaitez générer..."
                                    className="input-field w-full"
                                    rows={3}
                                    value={aiImagePrompts[fieldId] || ''}
                                    onChange={e => setAiImagePrompts(p => ({ ...p, [fieldId]: e.target.value }))}
                                    disabled={isGenerating[fieldId]}
                                />
                                <button
                                    type="button"
                                    className="bg-asso-green text-white p-2.5 rounded-lg hover:opacity-90 flex items-center justify-center w-full sm:w-auto disabled:bg-gray-400"
                                    onClick={() => handleGenerateImageAI(sectionId, field.label, fieldId)}
                                    disabled={isGenerating[fieldId]}
                                >
                                    {isGenerating[fieldId] ? <LoadingSpinner /> : <SparklesIcon />}
                                    <span className="ml-2">{isGenerating[fieldId] ? 'Génération en cours...' : 'Générer l\'image'}</span>
                                </button>
                            </div>
                        )}
                        
                        {value?.base64 && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Aperçu de l'image actuelle :</p>
                                <img src={value.base64} alt="Aperçu" className="mt-1 rounded-md max-h-40 object-contain border" />
                            </div>
                        )}
                    </div>
                );
            case 'file':
                return (
                    <div>
                        <input type="file" className="hidden" id={fieldId} onChange={e => handleFileChange(sectionId, field.label, e.target.files ? e.target.files[0] : null)} />
                        <label htmlFor={fieldId} className="input-field-file">
                           <PaperclipIcon /> {value?.name || field.placeholder || 'Choisir un fichier'}
                        </label>
                    </div>
                );
            case 'image_list':
            case 'file_list':
                const fileList: {name: string, base64: string}[] = value || [];
                const isImageList = field.type === 'image_list';
                return (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                            {fileList.map((file, index) => (
                                <div key={index} className="relative group border rounded p-2 bg-white">
                                    {isImageList ? (
                                        <img src={file.base64} alt={file.name} className="w-full h-20 object-cover rounded" />
                                    ) : (
                                        <div className="flex items-center gap-2 p-2">
                                            <DocumentTextIcon />
                                            <span className="text-xs truncate">{file.name}</span>
                                        </div>
                                    )}
                                    <button type="button" onClick={() => removeMultiFile(sectionId, field.label, index)} className="absolute top-1 right-1 p-1 bg-white/70 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>
                                </div>
                            ))}
                        </div>
                        <input type="file" multiple className="hidden" id={fieldId} onChange={e => handleMultiFileChange(sectionId, field.label, e.target.files)} accept={isImageList ? "image/*" : undefined} />
                        <label htmlFor={fieldId} className="input-field-file">
                           <PaperclipIcon /> Ajouter des {isImageList ? 'images' : 'fichiers'}...
                        </label>
                    </div>
                );
            case 'list':
                const listItems: string[] = value || [''];
                return (
                    <div className="space-y-2">
                        {listItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={item} onChange={(e) => handleListChange(sectionId, field.label, index, e.target.value)} className="input-field flex-grow" placeholder={`${field.placeholder || 'Élément'} ${index + 1}`} />
                                {listItems.length > 1 && <button type="button" onClick={() => removeListItem(sectionId, field.label, index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon /></button>}
                            </div>
                        ))}
                        <button type="button" onClick={() => addListItem(sectionId, field.label)} className="text-sm bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-200">+ Ajouter</button>
                    </div>
                );
             case 'date':
                return renderInput('date');
            case 'duration_slider':
                const sliderValue = value || field.default || 12;
                return (
                    <div className="flex items-center gap-4 p-2 bg-white rounded-lg border">
                        <input
                            type="range"
                            id={fieldId}
                            name={fieldId}
                            min={field.min || 1}
                            max={field.max || 36}
                            value={sliderValue}
                            onChange={(e) => handleInputChange(sectionId, field.label, e.target.valueAsNumber)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="font-bold text-lg text-asso-blue w-24 text-center bg-blue-50 p-2 rounded-md">{sliderValue} mois</span>
                    </div>
                );
             case 'table':
                const tableData: Record<string, any>[] = value || Array(field.rows_default || 1).fill({});
                const columns = field.columns || [];

                const handleTableChange = (rowIndex: number, colName: string, cellValue: any) => {
                    const newTableData = [...tableData];
                    newTableData[rowIndex] = {...newTableData[rowIndex], [colName]: cellValue};
                    handleInputChange(sectionId, field.label, newTableData);
                };
                const addRow = () => handleInputChange(sectionId, field.label, [...tableData, {}]);
                const removeRow = (rowIndex: number) => handleInputChange(sectionId, field.label, tableData.filter((_, i) => i !== rowIndex));

                return (
                    <div className="overflow-x-auto bg-white p-2 rounded-lg border">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    {columns.map(col => <th key={col} className="px-4 py-2">{col}</th>)}
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b last:border-b-0">
                                        {columns.map(col => (
                                            <td key={col} className="p-1">
                                                <input
                                                    type={col.toLowerCase().includes('montant') ? 'number' : 'text'}
                                                    value={row[col] || ''}
                                                    onChange={e => handleTableChange(rowIndex, col, e.target.value)}
                                                    className="input-field"
                                                    placeholder={col}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            {tableData.length > 1 && <button type="button" onClick={() => removeRow(rowIndex)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon /></button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addRow} className="mt-2 text-sm bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-200">+ Ajouter une ligne</button>
                    </div>
                );
            case 'checkbox':
                 return (
                    <div className="space-y-2">
                        {Array.isArray(field.options) && field.options.map((opt, index) => (
                            <label key={index} className="flex items-center gap-2 text-gray-700">
                                <input type="checkbox" className="h-4 w-4 text-asso-blue focus:ring-asso-blue border-gray-300 rounded" />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'action_button':
                const isPrimary = field.style === 'primary';
                const buttonClass = isPrimary 
                    ? 'bg-asso-blue text-white hover:opacity-90' 
                    : 'bg-white text-asso-blue border-2 border-asso-blue hover:bg-blue-50';
                
                const isCurrentlyExporting = isExporting && field.action?.startsWith('generate_pdf');
                
                const isFreeUser = user?.subscriptionPlan === SubscriptionPlan.FREE;
                const freeExportsUsed = user?.pdfExportsUsed || 0;
                const freeExportsRemaining = 3 - freeExportsUsed;

                return (
                    <div>
                        <button
                            type="button"
                            onClick={() => handleAction(field.action)}
                            disabled={isCurrentlyExporting}
                            className={`w-full font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 ${buttonClass} ${isCurrentlyExporting ? 'disabled:bg-gray-400 cursor-wait' : ''}`}
                        >
                            {isCurrentlyExporting ? <LoadingSpinner /> : (field.action === 'generate_pdf' ? <DocumentTextIcon /> : <SendIcon />)}
                            {isCurrentlyExporting ? 'Génération...' : field.label}
                        </button>
                        {isFreeUser && field.action?.startsWith('generate_pdf') && (
                             <p className="text-sm text-center text-gray-600 mt-2">
                                {freeExportsRemaining > 0 
                                    ? `Il vous reste ${freeExportsRemaining} export${freeExportsRemaining > 1 ? 's' : ''} gratuit${freeExportsRemaining > 1 ? 's' : ''}.`
                                    : "Vous avez utilisé tous vos exports gratuits. Le prochain sera facturé 1€."}
                            </p>
                        )}
                    </div>
                );
            default:
                return <p className="text-sm p-3 bg-red-100 text-red-700 rounded-md">Type de champ non supporté: {field.type}</p>;
        }
    };
    
    return (
         <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-poppins">{spontaneousApplicationForm.module}</h2>
                <p className="text-gray-600 mt-1">{spontaneousApplicationForm.description}</p>
            </header>

            <form className="space-y-6">
                {spontaneousApplicationForm.sections.map((section: FormSection) => (
                    <CollapsibleSection
                        key={section.id}
                        title={section.title}
                        isOpen={openSection === section.id}
                        onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                    >
                        {section.fields.map((field: FormField) => (
                            <div key={field.label} className={['textarea', 'list', 'table', 'file_list', 'image_list'].includes(field.type) || field.type.startsWith('action') ? 'md:col-span-2' : ''}>
                                <label htmlFor={`${section.id}-${field.label.replace(/\s+/g, '-')}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {renderField(field, section.id)}
                                 {field.ai_generate && (
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateAI(section.id, field.label)}
                                        disabled={isGenerating[field.label]}
                                        className="mt-2 text-sm bg-asso-green/10 text-asso-green font-semibold px-3 py-1.5 rounded-md hover:bg-asso-green/20 flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {isGenerating[field.label] ? <LoadingSpinner /> : <SparklesIcon />}
                                        {isGenerating[field.label] ? 'Génération...' : 'Remplir avec l\'IA'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </CollapsibleSection>
                ))}
            </form>

            {submissionStatus && (
                <div className={`fixed bottom-6 right-6 p-4 rounded-lg flex items-center gap-3 shadow-lg animate-fade-in-up z-50 ${
                    submissionStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                    submissionStatus.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                    'bg-blue-50 border border-blue-200 text-blue-800'
                }`}>
                    {submissionStatus.type === 'success' && <SuccessIcon />}
                    <span className="font-semibold">{submissionStatus.message}</span>
                </div>
            )}

             <style>{`
                .input-field, .input-field-file {
                    display: block;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.5rem;
                    background-color: #fff;
                    color: #111827;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-field:focus, .input-field-file:focus-within {
                    outline: none;
                    border-color: #0066FF;
                    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
                }
                .input-field-file {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #4B5563;
                }
                .input-field-file:hover {
                    border-color: #9CA3AF;
                }
            `}</style>
        </div>
    );
};

export default MyDocumentsView;