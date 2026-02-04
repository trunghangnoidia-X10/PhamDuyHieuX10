const fs = require('fs');
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

async function extractPDF() {
    const dataBuffer = fs.readFileSync('sach-pham-duy-hieu.pdf');

    try {
        const data = await pdf(dataBuffer);

        console.log('=== THÔNG TIN SÁCH ===');
        console.log('Số trang:', data.numpages);
        console.log('Tiêu đề:', data.info?.Title || 'Không có');
        console.log('Tác giả:', data.info?.Author || 'Không có');
        console.log('');
        console.log('=== NỘI DUNG (10,000 ký tự đầu) ===');
        console.log(data.text.substring(0, 10000));

        // Lưu toàn bộ text vào file
        fs.writeFileSync('book-content.txt', data.text);
        console.log('\n\n=== Đã lưu toàn bộ nội dung vào book-content.txt ===');

    } catch (error) {
        console.error('Lỗi:', error.message);
    }
}

extractPDF();
