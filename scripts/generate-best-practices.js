/**
 * Generate Best Practices Static Content
 *
 * This script parses .docx files and generates clean HTML content
 * for the Best Practices pages, removing unwanted metadata.
 *
 * Usage: node scripts/generate-best-practices.js
 */

const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = '/Users/sameerjoshi/Documents/YumWeb/YumPOS/V2/best-practices';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'pages', 'help', 'content');

// Patterns to remove from content
const UNWANTED_PATTERNS = [
  /Studio11 Audit Website Documentation/gi,
  /Page Information/gi,
  /Original Link:\s*https?:\/\/[^\s\n]+/gi,
  /Post ID:\s*\d+/gi,
  /Menu Order:\s*\d+/gi,
  /Parent Page:\s*\d+/gi,
  /Definitions\s*[–-]/gi,
  /<p>ID:\s*\d+<\/p>/gi,  // Remove standalone ID paragraphs
];

// Document metadata
const DOCUMENTS = [
  {
    id: 'client-interaction-sop',
    file: 'client-interaction-sop.docx',
    title: 'Client Interaction SOP',
    category: 'Customer Service',
    description: 'Standard operating procedures for client interactions',
  },
  {
    id: 'customer-care-protocol',
    file: 'customer-care-protocol.docx',
    title: 'Customer Care Protocol',
    category: 'Customer Service',
    description: 'Guidelines for customer care and support',
  },
  {
    id: 'daily-checklists',
    file: 'daily-checklists.docx',
    title: 'Daily Checklists',
    category: 'Operations',
    description: 'Daily operational checklists for staff',
  },
  {
    id: 'discounting-guidelines',
    file: 'discounting-guidelines.docx',
    title: 'Discounting Guidelines',
    category: 'Sales',
    description: 'Rules and procedures for applying discounts',
  },
  {
    id: 'email-etiquettes',
    file: 'email-etiquettes.docx',
    title: 'Email Etiquettes',
    category: 'Communication',
    description: 'Best practices for email communication',
  },
  {
    id: 'house-rules',
    file: 'house-rules.docx',
    title: 'House Rules',
    category: 'Operations',
    description: 'General salon rules and policies',
  },
  {
    id: 'sanitization-and-sterilization',
    file: 'sanitization-and-sterilization.docx',
    title: 'Sanitization & Sterilization',
    category: 'Hygiene',
    description: 'Hygiene and safety protocols',
  },
  {
    id: 'tele-calling-guidelines',
    file: 'tele-calling-guidelines.docx',
    title: 'Tele-calling Guidelines',
    category: 'Communication',
    description: 'Guidelines for phone outreach calls',
  },
  {
    id: 'telephone-etiquettes',
    file: 'telephone-etiquettes.docx',
    title: 'Telephone Etiquettes',
    category: 'Communication',
    description: 'Best practices for phone communication',
  },
];

function cleanContent(html) {
  let cleaned = html;

  // Remove unwanted patterns
  for (const pattern of UNWANTED_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');

  // Remove multiple consecutive breaks
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br/><br/>');

  // Remove leading/trailing whitespace in paragraphs
  cleaned = cleaned.replace(/<p>\s+/gi, '<p>');
  cleaned = cleaned.replace(/\s+<\/p>/gi, '</p>');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

  return cleaned.trim();
}

function extractTitle(html) {
  // Try to extract first heading as title
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();

  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Match) return h2Match[1].replace(/<[^>]+>/g, '').trim();

  return null;
}

async function parseDocument(docInfo) {
  const filePath = path.join(DOCS_DIR, docInfo.file);

  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  try {
    // Extract HTML from docx
    const result = await mammoth.convertToHtml({ path: filePath }, {
      styleMap: [
        "p[style-name='Heading 1'] => h2.doc-heading-1",
        "p[style-name='Heading 2'] => h3.doc-heading-2",
        "p[style-name='Heading 3'] => h4.doc-heading-3",
        "p[style-name='Title'] => h1.doc-title",
        "b => strong",
        "i => em",
        "u => u",
      ]
    });

    let html = result.value;

    // Clean the content
    html = cleanContent(html);

    // Extract title from content or use metadata
    const extractedTitle = extractTitle(html);

    return {
      id: docInfo.id,
      title: docInfo.title,
      category: docInfo.category,
      description: docInfo.description,
      extractedTitle: extractedTitle,
      content: html,
      warnings: result.messages,
    };
  } catch (error) {
    console.error(`Error parsing ${docInfo.file}:`, error);
    return null;
  }
}

async function generateContentFiles() {
  console.log('Generating Best Practices static content...\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allDocuments = [];

  for (const docInfo of DOCUMENTS) {
    console.log(`Processing: ${docInfo.file}`);
    const parsed = await parseDocument(docInfo);

    if (parsed) {
      // Save individual content file
      const contentFile = path.join(OUTPUT_DIR, `${docInfo.id}.json`);
      fs.writeFileSync(contentFile, JSON.stringify({
        id: parsed.id,
        title: parsed.title,
        category: parsed.category,
        description: parsed.description,
        content: parsed.content,
      }, null, 2));

      console.log(`  ✓ Generated: ${docInfo.id}.json`);

      allDocuments.push({
        id: parsed.id,
        title: parsed.title,
        category: parsed.category,
        description: parsed.description,
      });
    }
  }

  // Generate index file with all documents
  const indexFile = path.join(OUTPUT_DIR, 'index.json');

  // Group by category
  const categories = {};
  for (const doc of allDocuments) {
    if (!categories[doc.category]) {
      categories[doc.category] = [];
    }
    categories[doc.category].push(doc.id);
  }

  fs.writeFileSync(indexFile, JSON.stringify({
    documents: allDocuments,
    categories: categories,
    generatedAt: new Date().toISOString(),
  }, null, 2));

  console.log(`\n✓ Generated index.json with ${allDocuments.length} documents`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
}

// Run the generator
generateContentFiles().catch(console.error);
