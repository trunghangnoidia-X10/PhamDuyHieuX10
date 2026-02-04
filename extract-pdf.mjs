import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';

async function extractPDF() {
    const dataBuffer = new Uint8Array(fs.readFileSync('sach-pham-duy-hieu.pdf'));

    try {
        const pdf = await getDocument({ data: dataBuffer }).promise;

        console.log('=== THÔNG TIN SÁCH ===');
        console.log('Số trang:', pdf.numPages);

        let fullText = '';

        // Extract text from each page
        for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `\n=== TRANG ${i} ===\n` + pageText;
        }

        console.log(fullText.substring(0, 15000));

        // Lưu vào file
        fs.writeFileSync('book-content.txt', fullText);
        console.log('\n\n=== Đã lưu nội dung vào book-content.txt ===');

    } catch (error) {
        console.error('Lỗi:', error.message);
    }
}

extractPDF();
