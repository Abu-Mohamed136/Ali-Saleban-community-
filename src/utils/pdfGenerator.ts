import { jsPDF } from 'jspdf';
import { Member, NoteItem, VisitedLocation, VillageLawArticle, ExpenseItem } from '../types';

export const PdfService = {
  /**
   * Generates and downloads the Complete Members List & Contribution Ledger
   */
  downloadMembersRosterPdf(members: Member[]): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryGreen = [21, 128, 61] as const; // #15803d
    const darkBlue = [30, 64, 175] as const; // #1e40af
    const earthBrown = [120, 53, 15] as const; // #78350f
    const slateDark = [15, 23, 42] as const; // #0f172a

    // Header Background banner
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, 210, 28, 'F');

    // Header Accent line
    doc.setFillColor(...earthBrown);
    doc.rect(0, 28, 210, 2, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE', 105, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('KULMIS VILLAGE EXPANSION PROJECT · OFFICIAL MEMBERSHIP & CONTRIBUTION LEDGER', 105, 19, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(220, 252, 231);
    doc.text('Lead Software Developer: Adan Deeq Abdirahman Issa (Technical Staff) · +252 61 157 1310', 105, 25, { align: 'center' });

    // Document Meta
    doc.setTextColor(...slateDark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`, 14, 37);

    const totalPaid = members.reduce((sum, m) => sum + m.contributionAmount, 0);
    const totalPledged = members.reduce((sum, m) => sum + m.pledgedAmount, 0);
    const totalMembers = members.length;
    const plotsAssigned = members.filter(m => m.villagePlotAssigned).length;

    doc.text(`Total Members: ${totalMembers}  |  Total Collected: $${totalPaid.toLocaleString()} USD  |  Total Pledged: $${totalPledged.toLocaleString()} USD`, 14, 43);

    // Table Header
    let currentY = 50;
    doc.setFillColor(...darkBlue);
    doc.rect(14, currentY, 182, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 17, currentY + 5.5);
    doc.text('Full Name', 34, currentY + 5.5);
    doc.text('Phone Number', 85, currentY + 5.5);
    doc.text('Role', 120, currentY + 5.5);
    doc.text('Paid ($)', 155, currentY + 5.5, { align: 'right' });
    doc.text('Status', 172, currentY + 5.5);
    doc.text('Plot', 188, currentY + 5.5);

    currentY += 8;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    members.forEach((m, idx) => {
      // Check if need new page
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;

        // Repeat Header
        doc.setFillColor(...darkBlue);
        doc.rect(14, currentY, 182, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('ID', 17, currentY + 5.5);
        doc.text('Full Name', 34, currentY + 5.5);
        doc.text('Phone Number', 85, currentY + 5.5);
        doc.text('Role', 120, currentY + 5.5);
        doc.text('Paid ($)', 155, currentY + 5.5, { align: 'right' });
        doc.text('Status', 172, currentY + 5.5);
        doc.text('Plot', 188, currentY + 5.5);
        currentY += 8;
        doc.setFont('helvetica', 'normal');
      }

      // Zebra striping
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, 7, 'F');
      }

      doc.setTextColor(...slateDark);
      doc.text(m.id, 17, currentY + 5);

      const truncatedName = m.fullName.length > 25 ? m.fullName.substring(0, 24) + '…' : m.fullName;
      doc.text(truncatedName, 34, currentY + 5);
      doc.text(m.phone, 85, currentY + 5);

      const truncatedRole = m.role.length > 18 ? m.role.substring(0, 17) + '…' : m.role;
      doc.text(truncatedRole, 120, currentY + 5);
      doc.text(`$${m.contributionAmount}`, 155, currentY + 5, { align: 'right' });

      // Status text color
      if (m.status === 'Paid') {
        doc.setTextColor(...primaryGreen);
      } else if (m.status === 'Partial') {
        doc.setTextColor(...earthBrown);
      } else {
        doc.setTextColor(220, 38, 38);
      }
      doc.text(m.status, 172, currentY + 5);

      doc.setTextColor(...slateDark);
      doc.text(m.plotNumber || (m.villagePlotAssigned ? 'Yes' : 'No'), 188, currentY + 5);

      currentY += 7;
    });

    // Summary box at bottom
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 6;
    }

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(...primaryGreen);
    doc.roundedRect(14, currentY, 182, 22, 2, 2, 'FD');

    doc.setTextColor(...primaryGreen);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('KULMIS VILLAGE EXPANSION FUND SUMMARY', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateDark);
    doc.setFontSize(8);
    doc.text(`Total Registered Members: ${totalMembers} | Plots Allocated: ${plotsAssigned} plots`, 18, currentY + 12);
    doc.text(`Total Funds Collected: $${totalPaid.toLocaleString()} USD | Outstanding Pledges: $${(totalPledged - totalPaid).toLocaleString()} USD`, 18, currentY + 17);

    // Footer signature / attribution
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Cali Saleebaan Kismayo Committee · Kismayo, Jubaland, Somalia', 105, 287, { align: 'center' });
    doc.text('Certified by Lead App Developer & Technical Staff: Adan Deeq Abdirahman Issa (+252 61 157 1310)', 105, 292, { align: 'center' });

    doc.save(`Cali_Saleebaan_Members_Roster_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * Generates and downloads an individual Member Contribution Official Certificate / Receipt
   */
  downloadMemberReceiptPdf(member: Member): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5', // Compact certificate format
    });

    const primaryGreen = [21, 128, 61] as const;
    const darkBlue = [30, 64, 175] as const;
    const earthBrown = [120, 53, 15] as const;

    // Header border
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(1);
    doc.rect(7, 7, 134, 196);

    doc.setFillColor(...primaryGreen);
    doc.rect(8, 8, 132, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE', 74, 16, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('KULMIS VILLAGE EXPANSION CONTRIBUTION RECEIPT', 74, 22, { align: 'center' });

    // Receipt details
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL RECEIPT & CERTIFICATE', 74, 40, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt Reference:`, 14, 52);
    doc.setFont('helvetica', 'bold');
    doc.text(`${member.id}-RC-${Date.now().toString().slice(-5)}`, 60, 52);

    doc.setFont('helvetica', 'normal');
    doc.text(`Member Full Name:`, 14, 62);
    doc.setFont('helvetica', 'bold');
    doc.text(member.fullName, 60, 62);

    doc.setFont('helvetica', 'normal');
    doc.text(`Phone Number:`, 14, 72);
    doc.text(member.phone, 60, 72);

    doc.text(`Community Role:`, 14, 82);
    doc.text(member.role, 60, 82);

    doc.text(`Clan Branch:`, 14, 92);
    doc.text(member.subClanBranch || 'Cali Saleebaan', 60, 92);

    // Contribution amount box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(...primaryGreen);
    doc.roundedRect(14, 102, 120, 22, 2, 2, 'FD');

    doc.setTextColor(...primaryGreen);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('AMOUNT PAID:', 20, 112);
    doc.setFontSize(16);
    doc.text(`$${member.contributionAmount} USD`, 60, 113);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Payment Channel: ${member.paymentMethod}  |  Pledged: $${member.pledgedAmount}`, 20, 119);

    // Plot Allocation status
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.text(`Village Plot Status:`, 14, 134);
    doc.setFont('helvetica', 'bold');
    if (member.villagePlotAssigned) {
      doc.setTextColor(...primaryGreen);
      doc.text(`ASSIGNED: ${member.plotNumber || 'Section 1 (Demarcated)'}`, 60, 134);
    } else {
      doc.setTextColor(...earthBrown);
      doc.text(`Pending balance completion`, 60, 134);
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date Registered:`, 14, 144);
    doc.text(member.dateRegistered, 60, 144);

    // Stamp box
    doc.setDrawColor(203, 213, 225);
    doc.rect(80, 155, 45, 24);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('OFFICIAL STAMP', 102, 164, { align: 'center' });
    doc.text('Cali Saleebaan Committee', 102, 169, { align: 'center' });
    doc.text('Kismayo Office', 102, 174, { align: 'center' });

    // Technical developer watermark and signature
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Adan Deeq Abdirahman Issa', 14, 166);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Technical Staff & Lead Software Engineer', 14, 171);
    doc.text('Tel: +252 61 157 1310 / +254 722 123 678', 14, 175);
    doc.text('Cali Saleebaan, Kismayo Committee', 14, 179);

    doc.setFontSize(7);
    doc.text('Kulmis Settlement Expansion · Jubaland, Somalia', 74, 196, { align: 'center' });

    doc.save(`Receipt_${member.id}_${member.fullName.replace(/\s+/g, '_')}.pdf`);
  },

  /**
   * Generates and downloads Notes / Meeting minutes document
   */
  downloadNotesPdf(note: NoteItem): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryGreen = [21, 128, 61] as const;

    // Header
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, 210, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE · KULMIS VILLAGE ARCHIVE', 105, 12, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Resolution & Technical Records · Certified by Adan Deeq Abdirahman Issa (+252 61 157 1310)', 105, 18, { align: 'center' });

    // Document Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(note.title, 16, 38);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${note.category}   |   Author: ${note.author}   |   Updated: ${note.dateUpdated}`, 16, 45);

    doc.setDrawColor(226, 232, 240);
    doc.line(16, 48, 194, 48);

    // Body
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const splitText = doc.splitTextToSize(note.content, 178);
    doc.text(splitText, 16, 56);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE · DEVELOPER: ADAN DEEQ ABDIRAHMAN ISSA', 105, 290, { align: 'center' });

    doc.save(`${note.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`);
  },

  /**
   * Generates and downloads the Official Masterplan & Expansion Priorities PDF
   */
  downloadMasterplanPdf(): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryGreen = [21, 128, 61] as const;
    const darkBlue = [30, 64, 175] as const;

    // Header
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE', 105, 12, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('KULMIS VILLAGE EXPANSION MASTERPLAN & 2026 ROADMAP', 105, 19, { align: 'center' });
    doc.text('Technical Engineering Document · Lead Developer: Adan Deeq Abdirahman Issa (+252 61 157 1310)', 105, 25, { align: 'center' });

    // Section 1
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Executive Vision & Geographic Demarcation', 16, 38);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const vision = [
      'Kulmis is a newly designated community settlement located near Kismayo, Jubaland, Somalia.',
      'The expansion initiative is led by the Cali Saleebaan Committee to provide planned residential plots,',
      'access roads, sweet water boreholes, schools, and medical facilities for local residents and returning diaspora.',
      'Total Phase 1 Budget: $150,000 USD | Target Residential Plots: 250 plots.'
    ];
    let y = 45;
    vision.forEach(line => {
      doc.text(line, 16, y);
      y += 6;
    });

    // Section 2: Infrastructure Pillars
    y += 4;
    doc.setTextColor(...darkBlue);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Core Infrastructure Pillars', 16, y);

    y += 8;
    const pillars = [
      { name: 'Pillar A: Deep Solar Water Borehole', desc: '120-meter deep drilling reaching sweet water aquifers. Includes 50,000L elevated tank and solar pumps.' },
      { name: 'Pillar B: Primary Access Road Grading', desc: '4.8 km cleared feeder road connecting Kulmis directly to Kismayo corridor.' },
      { name: 'Pillar C: Cadastral Survey & Demarcation', desc: 'Official GPS boundaries, 20m x 20m standard residential parcels certified in committee ledger.' },
      { name: 'Pillar D: School & Maternal Health Clinic', desc: 'Initial two-room community classroom and primary health post foundations.' }
    ];

    pillars.forEach(p => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(16, y, 178, 14, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(p.name, 20, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(p.desc, 20, y + 10);

      y += 18;
    });

    // Section 3: Technical Team & Certification
    y += 4;
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Technical Verification & Certification', 16, y);

    y += 8;
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('System Architect & Software Lead: Adan Deeq Abdirahman Issa (Technical Staff)', 16, y);
    doc.text('Official Contact Hotline (Somalia): +252 61 157 1310 (WhatsApp Enabled)', 16, y + 6);
    doc.text('Official Contact Hotline (Kenya): +254 722 123 678', 16, y + 12);
    doc.text('Email: adandeeq136@gmail.com', 16, y + 18);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Cali Saleebaan, Kismayo Committee · Certified Kulmis Village Masterplan Document', 105, 288, { align: 'center' });

    doc.save(`Kulmis_Village_Masterplan_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * Generates and downloads the GPS Survey & Visited Locations Cadastre PDF
   */
  downloadGpsSurveyReportPdf(locations: VisitedLocation[]): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryGreen = [21, 128, 61] as const;
    const darkBlue = [30, 64, 175] as const;

    // Header
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE', 105, 12, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('KULMIS VILLAGE & KISMAYO GPS SURVEY CADASTRE REPORT', 105, 19, { align: 'center' });
    doc.text('Certified by Lead Surveyor & Developer: Adan Deeq Abdirahman Issa · +252 61 157 1310', 105, 25, { align: 'center' });

    let currentY = 38;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Official GPS Coordinate Points (${locations.length} Sites Surveyed):`, 16, currentY);

    currentY += 8;

    // Table Header
    doc.setFillColor(...darkBlue);
    doc.rect(16, currentY, 178, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Site Name', 20, currentY + 5.5);
    doc.text('Category', 75, currentY + 5.5);
    doc.text('Latitude', 115, currentY + 5.5);
    doc.text('Longitude', 140, currentY + 5.5);
    doc.text('Date', 170, currentY + 5.5);

    currentY += 8;
    doc.setFont('helvetica', 'normal');

    locations.forEach((loc, idx) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }

      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(16, currentY, 178, 12, 'F');
      }

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(loc.name.substring(0, 32), 20, currentY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(loc.findings.substring(0, 50) + (loc.findings.length > 50 ? '…' : ''), 20, currentY + 9);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.text(loc.category, 75, currentY + 5.5);
      doc.text(`${loc.lat.toFixed(4)}° N`, 115, currentY + 5.5);
      doc.text(`${loc.lng.toFixed(4)}° E`, 140, currentY + 5.5);
      doc.text(loc.dateVisited, 170, currentY + 5.5);

      currentY += 12;
    });

    // Signature footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Cali Saleebaan, Kismayo Committee · Cadastral Engineering Report by Adan Deeq Abdirahman Issa', 105, 288, { align: 'center' });

    doc.save(`Kulmis_GPS_Survey_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * Generates and downloads the Official Constitution & Village Laws of Kulmis
   */
  downloadVillageConstitutionPdf(articles: VillageLawArticle[]): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryGreen = [21, 128, 61] as const;
    const darkBlue = [30, 64, 175] as const;
    const earthBrown = [120, 53, 15] as const;
    const slateDark = [15, 23, 42] as const;

    // Cover / Header Banner
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setFillColor(...earthBrown);
    doc.rect(0, 32, 210, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE', 105, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('XEERKA & QODOBBADA RASMIGA AH EE TUULADA KULMIS', 105, 19, { align: 'center' });
    doc.setFontSize(8);
    doc.text('KULMIS VILLAGE OFFICIAL CONSTITUTION & PUBLIC LAWS · RATIFIED BY ELDERS', 105, 25, { align: 'center' });

    doc.setTextColor(220, 252, 231);
    doc.setFontSize(7.5);
    doc.text('Prepared & Digitized by Lead Systems Developer: Adan Deeq Abdirahman Issa · +252 61 157 1310 / +254 722 123 678', 105, 30, { align: 'center' });

    let currentY = 42;

    // Preamble Box
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, currentY, 182, 26, 2, 2, 'FD');

    doc.setTextColor(...earthBrown);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('HORDHAC / PREAMBLE:', 18, currentY + 6);

    doc.setTextColor(...slateDark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const preambleText = 'Xeerkani waa heshiis bulsho iyo dastuur rasmi ah oo ay wada dejiyeen Golaha Odayaasha Cali Saleebaan, Guddiga Kismaayo, iyo Jaaliyadda Dibadda si loo nidaamiyo lahaanshaha dhulka, dhismaha guryaha, biyaha, ilaalinta deegaanka, iyo garsoorka Tuulada cusub ee KULMIS.';
    const splitPreamble = doc.splitTextToSize(preambleText, 174);
    doc.text(splitPreamble, 18, currentY + 12);

    currentY += 32;

    // Render each Article
    articles.forEach((art) => {
      // Check space needed (approx 35mm per article)
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;

        // Running header
        doc.setFillColor(...primaryGreen);
        doc.rect(0, 0, 210, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE · KULMIS VILLAGE LAWS & CONSTITUTION', 105, 6.5, { align: 'center' });
      }

      // Article header strip
      doc.setFillColor(...darkBlue);
      doc.roundedRect(14, currentY, 182, 7.5, 1.5, 1.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${art.titleSo}`, 18, currentY + 5);

      currentY += 10.5;

      // Category & Status Badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...earthBrown);
      doc.text(`Category: ${art.category}  |  Status: ${art.status}  |  Ratified: ${art.dateAdopted}`, 16, currentY);

      currentY += 4.5;

      // Somali text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      const splitBody = doc.splitTextToSize(art.fullTextSo, 178);
      doc.text(splitBody, 16, currentY);

      currentY += splitBody.length * 3.8 + 2;

      // English summary
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const splitEn = doc.splitTextToSize(`[English]: ${art.summaryEn}`, 178);
      doc.text(splitEn, 16, currentY);

      currentY += splitEn.length * 3.5 + 5;

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(14, currentY, 196, currentY);
      currentY += 4;
    });

    // Final Elder Signatures & Official Stamp section
    if (currentY > 230) {
      doc.addPage();
      currentY = 25;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, currentY, 182, 36, 2, 2, 'FD');

    doc.setTextColor(...darkBlue);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SAXIIXA GOLAHA ODAYAASHA & GUDDIGA FARSAMADA / OFFICIAL RATIFICATION', 18, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('1. Ugaas Maxamuud Cali Shire (Guddoomiyaha Odayaasha)', 20, currentY + 16);
    doc.text('2. Nabaddoon Axmed Jaamac Faarax (Oday Dhaqan)', 20, currentY + 22);
    doc.text('3. Dr. Faarax Cabdirisaaq (Jaaliyadda Dibadda - USA)', 20, currentY + 28);

    doc.text('4. Adan Deeq Abdirahman Issa (Systems Lead - +252 61 157 1310)', 105, currentY + 16);
    doc.text('5. Eng. Cabdiweli Nuur (Civil & Road Engineer)', 105, currentY + 22);
    doc.text('6. Sheekh Cabdiraxmaan Maxamed (Golaha Garsoorka)', 105, currentY + 28);

    // Official Seal watermark box
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(0.8);
    doc.rect(170, currentY + 4, 22, 22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...primaryGreen);
    doc.text('CALI SALEEBAAN', 181, currentY + 11, { align: 'center' });
    doc.text('KULMIS SEAL', 181, currentY + 15, { align: 'center' });
    doc.text('VERIFIED', 181, currentY + 19, { align: 'center' });

    currentY += 42;

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Cali Saleebaan, Kismayo Committee · Official Digital Repository · Certified by Adan Deeq Abdirahman Issa', 105, 288, { align: 'center' });

    doc.save(`Kulmis_Village_Official_Constitution_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * Generates and downloads the Official Financial Audit & Expenditure Report
   * (Total Collected vs Where Money Goes, Who Paid vs Who Has Not)
   */
  downloadFinancialAuditReportPdf(members: Member[], expenses: ExpenseItem[]): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryGreen = [21, 128, 61] as const; // #15803d
    const darkBlue = [30, 64, 175] as const; // #1e40af
    const earthBrown = [120, 53, 15] as const; // #78350f
    const slateDark = [15, 23, 42] as const; // #0f172a
    const redAlert = [185, 28, 28] as const;

    const totalCollected = members.reduce((sum, m) => sum + (m.contributionAmount || 0), 0);
    const totalPledged = members.reduce((sum, m) => sum + (m.pledgedAmount || 0), 0);
    const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const remainingBalance = totalCollected - totalSpent;
    const unpaidBalance = totalPledged > totalCollected ? totalPledged - totalCollected : 0;

    const paidMembers = members.filter(m => m.status === 'Paid');
    const partialMembers = members.filter(m => m.status === 'Partial');
    const unpaidMembers = members.filter(m => m.status === 'Pledged' || m.contributionAmount === 0);

    // Header Background banner
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, 210, 30, 'F');

    // Header Accent line
    doc.setFillColor(...earthBrown);
    doc.rect(0, 30, 210, 2, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('CALI SALEEBAAN, KISMAYO COMMITTEE', 105, 11, { align: 'center' });

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text('WARBIXINTA MAALIYADDA & MEESHA LACAGTU MARTAY · FINANCIAL AUDIT & EXPENSE REPORT', 105, 18, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setTextColor(220, 252, 231);
    doc.text('Technical Systems Lead: Adan Deeq Abdirahman Issa · Hotline: +252 61 157 1310 / +254 722 123 678', 105, 25, { align: 'center' });

    // Financial KPI Cards Banner
    let currentY = 38;
    const cardWidth = 43;
    const cardHeight = 20;

    // Card 1: Total Collected
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(14, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL COLLECTED', 17, currentY + 6);
    doc.setFontSize(12);
    doc.text(`$${totalCollected.toLocaleString()}`, 17, currentY + 14);

    // Card 2: Total Spent (Where Money Went)
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(239, 68, 68);
    doc.roundedRect(60, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(...redAlert);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL SPENT (EXPENSES)', 63, currentY + 6);
    doc.setFontSize(12);
    doc.text(`$${totalSpent.toLocaleString()}`, 63, currentY + 14);

    // Card 3: Remaining In Treasury
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.roundedRect(106, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(...darkBlue);
    doc.setFont('helvetica', 'bold');
    doc.text('NET TREASURY BALANCE', 109, currentY + 6);
    doc.setFontSize(12);
    doc.text(`$${remainingBalance.toLocaleString()}`, 109, currentY + 14);

    // Card 4: Unpaid / Pledged Balance
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(202, 138, 4);
    doc.roundedRect(152, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(133, 77, 14);
    doc.setFont('helvetica', 'bold');
    doc.text('UNPAID / OUTSTANDING', 155, currentY + 6);
    doc.setFontSize(12);
    doc.text(`$${unpaidBalance.toLocaleString()}`, 155, currentY + 14);

    currentY += 27;

    // SECTION 1: WHERE THE MONEY GOES (DISBURSEMENTS & PROJECT EXPENDITURES)
    doc.setFillColor(...slateDark);
    doc.rect(14, currentY, 182, 6.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('1. MEESHA LACAGTU MARTAY / PROJECT EXPENDITURES & DISBURSEMENTS', 18, currentY + 4.5);

    currentY += 8.5;

    // Table Header for Expenses
    doc.setFillColor(...darkBlue);
    doc.rect(14, currentY, 182, 6.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 17, currentY + 4.5);
    doc.text('Project / Description', 36, currentY + 4.5);
    doc.text('Category', 96, currentY + 4.5);
    doc.text('Paid To (Contractor)', 132, currentY + 4.5);
    doc.text('Amount ($)', 192, currentY + 4.5, { align: 'right' });

    currentY += 6.5;

    // Rows for Expenses
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    expenses.forEach((exp, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, 6, 'F');
      }
      doc.setTextColor(...slateDark);
      doc.text(exp.date, 17, currentY + 4.2);
      
      const safeTitle = exp.titleSo.length > 36 ? exp.titleSo.substring(0, 34) + '...' : exp.titleSo;
      doc.text(safeTitle, 36, currentY + 4.2);

      const safeCat = exp.category.length > 20 ? exp.category.substring(0, 18) + '...' : exp.category;
      doc.text(safeCat, 96, currentY + 4.2);

      const safePaid = exp.paidTo.length > 28 ? exp.paidTo.substring(0, 26) + '...' : exp.paidTo;
      doc.text(safePaid, 132, currentY + 4.2);

      doc.setFont('helvetica', 'bold');
      doc.text(`$${exp.amount.toLocaleString()}`, 192, currentY + 4.2, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      currentY += 6;
    });

    // Subtotal Row for Expenses
    doc.setFillColor(241, 245, 249);
    doc.rect(14, currentY, 182, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...slateDark);
    doc.text('WADARTA KHARASHAADKA LA BIXIYAY (TOTAL DISBURSED):', 70, currentY + 4.5);
    doc.setTextColor(...redAlert);
    doc.text(`$${totalSpent.toLocaleString()} USD`, 192, currentY + 4.5, { align: 'right' });

    currentY += 12;

    // SECTION 2: WHO HAS PAID & WHO HAS NOT (COLLECTION ACCOUNTABILITY)
    doc.setFillColor(...primaryGreen);
    doc.rect(14, currentY, 182, 6.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`2. KALA REEBKA LACAG-BIXINTA / WHO PAID VS WHO HAS NOT (${members.length} Total Members)`, 18, currentY + 4.5);

    currentY += 8.5;

    // Summary pills
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateDark);
    doc.text(`• Full Paid: ${paidMembers.length} members  |  • Partial: ${partialMembers.length} members  |  • Unpaid / Pledged: ${unpaidMembers.length} members`, 16, currentY + 2);

    currentY += 6;

    // Table Header for Member Statuses
    doc.setFillColor(...earthBrown);
    doc.rect(14, currentY, 182, 6.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 17, currentY + 4.5);
    doc.text('Member Name', 33, currentY + 4.5);
    doc.text('Phone', 85, currentY + 4.5);
    doc.text('Status', 120, currentY + 4.5);
    doc.text('Paid ($)', 155, currentY + 4.5, { align: 'right' });
    doc.text('Pledged ($)', 192, currentY + 4.5, { align: 'right' });

    currentY += 6.5;

    // Show members (especially highlighting who has not paid or is partial)
    members.forEach((m, idx) => {
      if (currentY > 265) {
        doc.addPage();
        currentY = 20;

        // Header repeat
        doc.setFillColor(...earthBrown);
        doc.rect(14, currentY, 182, 6.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('ID', 17, currentY + 4.5);
        doc.text('Member Name', 33, currentY + 4.5);
        doc.text('Phone', 85, currentY + 4.5);
        doc.text('Status', 120, currentY + 4.5);
        doc.text('Paid ($)', 155, currentY + 4.5, { align: 'right' });
        doc.text('Pledged ($)', 192, currentY + 4.5, { align: 'right' });
        currentY += 6.5;
      }

      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, 5.8, 'F');
      }

      doc.setTextColor(...slateDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(m.id, 17, currentY + 4);
      doc.text(m.fullName, 33, currentY + 4);
      doc.text(m.phone, 85, currentY + 4);

      if (m.status === 'Paid') {
        doc.setTextColor(22, 101, 52);
        doc.setFont('helvetica', 'bold');
        doc.text('PAID (Bixiyay)', 120, currentY + 4);
      } else if (m.status === 'Partial') {
        doc.setTextColor(180, 83, 9);
        doc.setFont('helvetica', 'bold');
        doc.text('PARTIAL (Qabyo)', 120, currentY + 4);
      } else {
        doc.setTextColor(...redAlert);
        doc.setFont('helvetica', 'bold');
        doc.text('NOT PAID (Ma Bixin)', 120, currentY + 4);
      }

      doc.setTextColor(...slateDark);
      doc.text(`$${m.contributionAmount}`, 155, currentY + 4, { align: 'right' });
      doc.text(`$${m.pledgedAmount}`, 192, currentY + 4, { align: 'right' });

      currentY += 5.8;
    });

    // Verification Seal & Signatures
    if (currentY > 235) {
      doc.addPage();
      currentY = 25;
    } else {
      currentY += 6;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, currentY, 182, 28, 2, 2, 'FD');

    doc.setTextColor(...darkBlue);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('XISAAB-XIDHKA RASMIGA AH EE GUDDIGA / CERTIFIED AUDIT VALIDATION', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('Axmed Daahir Cabdulle (Xisaabiyaha Guud / Treasurer)', 20, currentY + 14);
    doc.text('Sheekh Nuur Xaaji Maxamuud (Guddoomiyaha Fulinta)', 20, currentY + 20);

    doc.text('Adan Deeq Abdirahman Issa (Systems Lead · +252 61 157 1310)', 105, currentY + 14);
    doc.text('Ugaas Cabdiqaadir Maxamed Shire (Patron Elder)', 105, currentY + 20);

    // Seal
    doc.setDrawColor(...primaryGreen);
    doc.rect(172, currentY + 4, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(...primaryGreen);
    doc.text('KULMIS AUDIT', 182, currentY + 11, { align: 'center' });
    doc.text('PASSED', 182, currentY + 15, { align: 'center' });
    doc.text('2026', 182, currentY + 19, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Cali Saleebaan, Kismayo Committee · Official Financial Ledger · Certified by Adan Deeq Abdirahman Issa', 105, 288, { align: 'center' });

    doc.save(`Kulmis_Village_Financial_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};

