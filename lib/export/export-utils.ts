// ============================================
// lib/export/export-utils.ts - EXPORT UTILITIES
// ============================================
import { ChecklistData } from '@/lib/database/checklist';
import { locations, months } from '@/lib/utils';

interface ExportData {
    location: string;
    day: number;
    month: string;
    year: number;
    score: number;
    photo_url: string | null;
    uploaded_by: string | null;
    approved_by: string | null;
    created_at: string;
}

/**
 * Format checklist data for export
 */
export function formatDataForExport(
    data: ChecklistData[],
    month: number,
    year: number
): ExportData[] {
    return data.map(item => ({
        location: item.location,
        day: item.day,
        month: months[month],
        year: item.year,
        score: item.score,
        photo_url: item.photo_url || 'No Photo',
        uploaded_by: item.uploaded_by || '-',
        approved_by: item.approved_by || 'Pending',
        created_at: new Date(item.created_at).toLocaleString('id-ID')
    }));
}

/**
 * Export to Excel using XLSX
 */
export async function exportToExcel(
    data: ChecklistData[],
    month: number,
    year: number
): Promise<void> {
    try {
        // Dynamic import to reduce bundle size
        const XLSX = await import('xlsx');

        // Format data
        const exportData = formatDataForExport(data, month, year);

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData, {
            header: [
                'location',
                'day',
                'month',
                'year',
                'score',
                'photo_url',
                'uploaded_by',
                'approved_by',
                'created_at'
            ]
        });

        // Set column widths
        worksheet['!cols'] = [
            { wch: 25 }, // location
            { wch: 8 },  // day
            { wch: 12 }, // month
            { wch: 8 },  // year
            { wch: 10 }, // score
            { wch: 50 }, // photo_url
            { wch: 15 }, // uploaded_by
            { wch: 15 }, // approved_by
            { wch: 20 }  // created_at
        ];

        // Custom headers
        const headers = {
            location: 'Lokasi Toilet',
            day: 'Hari',
            month: 'Bulan',
            year: 'Tahun',
            score: 'Nilai',
            photo_url: 'Link Foto',
            uploaded_by: 'Diupload Oleh',
            approved_by: 'Disetujui Oleh',
            created_at: 'Waktu Upload'
        };

        // Replace headers
        XLSX.utils.sheet_add_aoa(worksheet, [Object.values(headers)], { origin: 'A1' });

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Checklist Data');

        // Add summary sheet
        const summaryData = generateSummary(data, month, year);
        const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

        // Generate filename
        const filename = `Toilet_Checklist_${months[month]}_${year}.xlsx`;

        // Download file
        XLSX.writeFile(workbook, filename);

        console.log('✅ Excel file exported successfully!');
    } catch (error) {
        console.error('❌ Export to Excel failed:', error);
        throw new Error('Gagal export Excel. Silakan coba lagi.');
    }
}

/**
 * Export to PDF using jsPDF
 */
export async function exportToPDF(
    data: ChecklistData[],
    month: number,
    year: number
): Promise<void> {
    try {
        // Dynamic imports
        const jsPDF = (await import('jspdf')).default;
        const autoTable = (await import('jspdf-autotable')).default;

        // Format data
        const exportData = formatDataForExport(data, month, year);

        // Create PDF
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Laporan Kebersihan Toilet', 148, 15, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Periode: ${months[month]} ${year}`, 148, 22, { align: 'center' });

        // Summary stats
        const stats = calculateStats(data);
        doc.setFontSize(10);
        doc.text(`Total Records: ${data.length}`, 14, 30);
        doc.text(`Average Score: ${stats.avgScore}`, 14, 36);
        doc.text(`Excellent (95+): ${stats.excellent}`, 80, 30);
        doc.text(`Good (85-94): ${stats.good}`, 80, 36);
        doc.text(`Fair (75-84): ${stats.fair}`, 140, 30);
        doc.text(`Poor (<75): ${stats.poor}`, 140, 36);

        // Table
        autoTable(doc, {
            startY: 42,
            head: [[
                'Lokasi',
                'Hari',
                'Bulan',
                'Nilai',
                'Status Foto',
                'Status Approval',
                'Waktu Upload'
            ]],
            body: exportData.map(item => [
                item.location,
                item.day,
                item.month,
                item.score,
                item.photo_url !== 'No Photo' ? '✓ Ada' : '✗ Tidak Ada',
                item.approved_by !== 'Pending' ? '✓ Approved' : '⏳ Pending',
                item.created_at
            ]),
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [59, 130, 246],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 45 }, // Lokasi
                1: { cellWidth: 15, halign: 'center' }, // Hari
                2: { cellWidth: 25 }, // Bulan
                3: { cellWidth: 20, halign: 'center' }, // Nilai
                4: { cellWidth: 30, halign: 'center' }, // Status Foto
                5: { cellWidth: 35, halign: 'center' }, // Status Approval
                6: { cellWidth: 45 } // Waktu Upload
            },
            didParseCell: function (data: any) {
                // Color code scores
                if (data.column.index === 3 && data.section === 'body') {
                    const score = parseInt(data.cell.text[0]);
                    if (score >= 95) {
                        data.cell.styles.fillColor = [219, 234, 254]; // blue-100
                        data.cell.styles.textColor = [30, 64, 175]; // blue-900
                    } else if (score >= 85) {
                        data.cell.styles.fillColor = [220, 252, 231]; // green-100
                        data.cell.styles.textColor = [20, 83, 45]; // green-900
                    } else if (score >= 75) {
                        data.cell.styles.fillColor = [254, 249, 195]; // yellow-100
                        data.cell.styles.textColor = [113, 63, 18]; // yellow-900
                    } else {
                        data.cell.styles.fillColor = [254, 226, 226]; // red-100
                        data.cell.styles.textColor = [127, 29, 29]; // red-900
                    }
                }
            }
        });

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Halaman ${i} dari ${pageCount}`,
                148,
                205,
                { align: 'center' }
            );
            doc.text(
                `Generated: ${new Date().toLocaleString('id-ID')}`,
                14,
                205
            );
        }

        // Generate filename
        const filename = `Toilet_Checklist_${months[month]}_${year}.pdf`;

        // Download file
        doc.save(filename);

        console.log('✅ PDF file exported successfully!');
    } catch (error) {
        console.error('❌ Export to PDF failed:', error);
        throw new Error('Gagal export PDF. Silakan coba lagi.');
    }
}

/**
 * Generate summary statistics
 */
function generateSummary(data: ChecklistData[], month: number, year: number) {
    const summary: any[] = [];

    // Overall stats
    const stats = calculateStats(data);
    summary.push({
        'Kategori': 'Total Records',
        'Nilai': data.length
    });
    summary.push({
        'Kategori': 'Average Score',
        'Nilai': stats.avgScore
    });
    summary.push({
        'Kategori': 'Excellent (95-100)',
        'Nilai': stats.excellent
    });
    summary.push({
        'Kategori': 'Good (85-94)',
        'Nilai': stats.good
    });
    summary.push({
        'Kategori': 'Fair (75-84)',
        'Nilai': stats.fair
    });
    summary.push({
        'Kategori': 'Poor (<75)',
        'Nilai': stats.poor
    });

    // Add spacing
    summary.push({ 'Kategori': '', 'Nilai': '' });
    summary.push({
        'Kategori': 'Score by Location',
        'Nilai': ''
    });

    // Stats by location
    locations.forEach(location => {
        const locationData = data.filter(d => d.location === location);
        if (locationData.length > 0) {
            const avgScore = Math.round(
                locationData.reduce((sum, d) => sum + d.score, 0) / locationData.length
            );
            summary.push({
                'Kategori': location,
                'Nilai': avgScore
            });
        }
    });

    return summary;
}

/**
 * Calculate statistics
 */
function calculateStats(data: ChecklistData[]) {
    const scores = data.map(d => d.score);
    const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
        avgScore,
        excellent: scores.filter(s => s >= 95).length,
        good: scores.filter(s => s >= 85 && s < 95).length,
        fair: scores.filter(s => s >= 75 && s < 85).length,
        poor: scores.filter(s => s < 75).length
    };
}