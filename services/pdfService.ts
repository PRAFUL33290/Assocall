import { spontaneousApplicationForm, FormSchema } from '../data/spontaneousApplicationForm';

type FormData = Record<string, any>;

export const generatePdfFromFormData = async (formData: FormData): Promise<void> => {
    // @ts-ignore - jsPDF is loaded from a script tag in index.html
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const schema: FormSchema = spontaneousApplicationForm;
    let y = 20; // Initial y position
    const margin = 15;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;

    // --- Helper Functions ---
    const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    const writeTitle = (text: string) => {
        checkPageBreak(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text(text, pageWidth / 2, y, { align: 'center' });
        y += 10;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    };

    const writeSectionTitle = (text: string) => {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 255); // Asso-blue
        doc.text(text, margin, y);
        y += 8;
    };

    const writeLabelValue = async (label: string, value: any) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return;

        checkPageBreak(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        const labelLines = doc.splitTextToSize(label + ':', 40);
        doc.text(labelLines, margin, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        
        const valueX = margin + 45;
        const valueWidth = usableWidth - 45;

        // Handle different value types
        if (typeof value === 'string' || typeof value === 'number') {
            const lines = doc.splitTextToSize(String(value), valueWidth);
            checkPageBreak(lines.length * 5);
            doc.text(lines, valueX, y);
            y += lines.length * 5;
        } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            const text = value.join(', ');
            const lines = doc.splitTextToSize(text, valueWidth);
            checkPageBreak(lines.length * 5);
            doc.text(lines, valueX, y);
            y += lines.length * 5;
        } else if (value.base64 && value.type?.startsWith('image/')) {
            // It's an image file object
            y += 2;
            try {
                const img = new Image();
                img.src = value.base64;
                await new Promise((resolve, reject) => { 
                    img.onload = resolve; 
                    img.onerror = reject; 
                });
                
                const ratio = img.width / img.height;
                let imgWidth = 60;
                let imgHeight = imgWidth / ratio;
                if (imgHeight > 80) {
                    imgHeight = 80;
                    imgWidth = imgHeight * ratio;
                }

                checkPageBreak(imgHeight + 5);
                doc.addImage(value.base64, value.type.split('/')[1].toUpperCase(), valueX, y, imgWidth, imgHeight);
                y += imgHeight + 5;
            } catch (e) {
                console.error("Failed to add image to PDF", e);
                const errorText = '[Erreur de chargement de l\'image]';
                doc.text(errorText, valueX, y);
                y += 5;
            }
        }
        y += 3; // Spacing after the entry
    };

    const writeList = (label: string, items: string[]) => {
        if (!items || items.filter(i => i && i.trim()).length === 0) return;
        checkPageBreak(8 + items.length * 5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        doc.text(label + ':', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        items.forEach(item => {
            if (item) {
                const lines = doc.splitTextToSize(`• ${item}`, usableWidth - 5);
                checkPageBreak(lines.length * 5);
                doc.text(lines, margin + 5, y);
                y += lines.length * 5;
            }
        });
        y += 4;
    };
    
    const writeTable = (label: string, columns: string[], data: Record<string, any>[]) => {
        if (!data || data.length === 0 || data.every(row => Object.values(row).every(cell => !cell))) return;

        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        doc.text(label, margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        
        data.forEach((row, index) => {
            if (Object.values(row).some(v => v)) {
                checkPageBreak(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`Ligne ${index + 1}:`, margin + 5, y);
                y += 5;
                doc.setFont('helvetica', 'normal');
                columns.forEach(col => {
                    if (row[col]) {
                        checkPageBreak(5);
                        const text = `${col}: ${row[col]}`;
                        const lines = doc.splitTextToSize(text, usableWidth - 10);
                        doc.text(lines, margin + 10, y);
                        y += lines.length * 5;
                    }
                });
                y += 2;
            }
        });
        y += 4;
    };

    // --- PDF Generation ---
    const projectName = formData['presentation_projet']?.['Titre du projet'] || 'Dossier de Candidature';
    writeTitle(projectName);
    
    for (const section of schema.sections) {
        if (section.id === 'export_envoi') continue; // Skip the action section

        const sectionData = formData[section.id];
        if (!sectionData || Object.keys(sectionData).length === 0) continue;

        writeSectionTitle(section.title);

        for (const field of schema.sections.find(s => s.id === section.id)!.fields) {
            const value = sectionData[field.label];
            if (!value) continue;

            if (field.type === 'list') {
                writeList(field.label, value);
            } else if (field.type === 'table') {
                writeTable(field.label, field.columns || [], value);
            } else if (field.type.startsWith('action')) {
                // do nothing
            } else {
                await writeLabelValue(field.label, value);
            }
        }
        y += 5; // space between sections
    }

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        const footerText = `Généré par AssoCall AI | Page ${i} sur ${pageCount}`;
        doc.text(footerText, margin, pageHeight - 10);
    }

    doc.save(`Dossier_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};
