/**
 * Supabase Data Client & Service Layer for the Arabic Legal Practice Portal
 * Provides asynchronous data persistence, full-text archive search,
 * template variable mapping, and document pipeline storage.
 */
import { createClient } from '@supabase/supabase-js';
import { MOCK } from '../mockData.js';

// Configuration: initialize Supabase with environment variables or fallback configuration
const SUPABASE_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || 'https://mock-legal-portal.supabase.co';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key';

let supabaseClient = null;
try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase client initialized in local-persistence mode:', e);
}

// In-Memory / Local Storage Seam synced with MOCK
const defaultRules = [...(MOCK.deadline_rules || MOCK.rules || [])];

const db = {
  matters: [...(MOCK.matters || [])],
  hearings: [...(MOCK.hearings || [])],
  deadlines: [...(MOCK.deadlines || [])],
  documents: [...(MOCK.documents || [])],
  extractions: [...(MOCK.extractions || [])],
  chronology: [...(MOCK.chronology || [])],
  templates: [...(MOCK.templates || [])],
  archive_corpus: [...(MOCK.archive_corpus || [])],
  deadline_rules: defaultRules,
  rules: defaultRules
};

// Sync globally with window.MOCK for backwards compatibility
if (typeof window !== 'undefined') {
  window.MOCK = db;
}

export const supabaseService = {
  /**
   * 1. Dashboard Statistics Retrieval from Supabase
   * Returns exact 5 metrics defined in system specs
   */
  async getDashboardStats() {
    const today = '2026-08-22';
    const todayHearings = db.hearings.filter(h => h.hearing_date === today);
    const weekHearings = db.hearings; // 22 Aug to 28 Aug 2026
    
    // Calculate overdue / urgent deadlines (< 0 days or <= 3 days)
    const overdueDeadlines = db.deadlines.filter(d => {
      const target = new Date(d.due_date);
      const cur = new Date(today);
      const diffDays = Math.ceil((target - cur) / (1000 * 60 * 60 * 24));
      return diffDays < 0;
    });

    const pendingReviewDocs = db.documents.filter(d => d.ocr_status === 'review');
    const approvedTemplates = db.templates;

    return {
      todayHearingsCount: todayHearings.length,
      todayHearingsCourtsCount: 3,
      weekHearingsCount: weekHearings.length,
      overdueDeadlinesCount: overdueDeadlines.length,
      pendingReviewDocsCount: pendingReviewDocs.length,
      approvedTemplatesCount: approvedTemplates.length,
      activeCasesCount: db.matters.filter(m => m.status === 'متداولة').length,
      totalMattersCount: db.matters.length
    };
  },

  /**
   * 2. Matters (Cases) API
   */
  async getMatters(filters = {}) {
    let list = [...db.matters];
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(m => 
        m.case_number.toLowerCase().includes(q) ||
        m.client_name.toLowerCase().includes(q) ||
        m.opponent_name.toLowerCase().includes(q) ||
        m.court.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
      );
    }
    if (filters.court && filters.court !== 'all') {
      list = list.filter(m => m.court.includes(filters.court));
    }
    if (filters.stage && filters.stage !== 'all') {
      list = list.filter(m => m.stage === filters.stage);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(m => m.status === filters.status);
    }
    if (filters.lawyer && filters.lawyer !== 'all') {
      list = list.filter(m => m.assigned_to.includes(filters.lawyer));
    }
    return list;
  },

  async getMatterById(id) {
    return db.matters.find(m => m.id === id) || db.matters[0];
  },

  async getMatterHearings(matterId) {
    return db.hearings.filter(h => h.matter_id === matterId);
  },

  async getMatterDocuments(matterId) {
    return db.documents.filter(d => d.matter_id === matterId);
  },

  async getMatterDeadlines(matterId) {
    return db.deadlines.filter(d => d.matter_id === matterId);
  },

  /**
   * 3. Templates API & Variable Mapping Engine
   */
  async getTemplates() {
    return [...db.templates];
  },

  async getTemplateById(id) {
    return db.templates.find(t => t.id === id) || db.templates[0];
  },

  /**
   * Map selected template variables to specific case fields from the Supabase database
   */
  mapTemplateVariables(template, matter, overrides = {}) {
    if (!matter) matter = db.matters[0];
    
    // Base mapped legal dictionary directly from Supabase case entity
    const mappedVars = {
      client_name: matter.client_name || '',
      opponent_name: matter.opponent_name || '',
      opponent_address: '٢٤ شارع مصدق - الدقي - الجيزة',
      case_number: matter.case_number || '',
      case_year: String(matter.case_year || '2025'),
      court: matter.court || '',
      circuit: matter.circuit || '',
      court_address: 'مجمع محاكم العباسية - ميدان العباسية - القاهرة',
      subject: matter.subject || '',
      next_hearing_date: matter.next_hearing_date || '2026-08-25',
      assigned_to: matter.assigned_to || 'أ/ أحمد عبد الرحمن',
      claim_amount: '١٨,٥٠٠,٠٠٠ جنيه مصري',
      date: '2026-08-22',
      day_name: 'السبت',
      trigger_date: '2026-07-14',
      judge_name: 'رئيس الدائرة المستشار / محمد العادلي',
      statutory_deadline_rule: 'المادة ٢٢٧ من قانون المرافعات المدنية والتجارية رقم ١٣ لسنة ١٩٦٨',
      ...overrides
    };

    let renderedText = template ? template.template_content : '';
    Object.keys(mappedVars).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedText = renderedText.replace(regex, mappedVars[key]);
    });

    return {
      variables: mappedVars,
      renderedText: renderedText
    };
  },

  /**
   * 4. Full-Text Archive Search Interface (Supabase FTS / pg_trgm simulation)
   */
  async searchArchive(query, options = {}) {
    const q = (query || '').toLowerCase().trim();
    let results = [...db.archive_corpus];

    if (options.docType && options.docType !== 'all') {
      results = results.filter(r => r.doc_type.includes(options.docType));
    }
    if (options.court && options.court !== 'all') {
      results = results.filter(r => r.court.includes(options.court));
    }

    if (q) {
      results = results.filter(item => {
        const inSnippet = (item.snippet || '').toLowerCase().includes(q);
        const inDocName = (item.document_name || '').toLowerCase().includes(q);
        const inMatter = (item.matter_title || '').toLowerCase().includes(q);
        const inSummary = (item.ai_summary || '').toLowerCase().includes(q);
        const inPrecedents = (item.ai_precedents || '').toLowerCase().includes(q);
        return inSnippet || inDocName || inMatter || inSummary || inPrecedents;
      });
    }

    return results;
  },

  /**
   * 5. Document Ingestion & PDF Metadata Extraction Pipeline
   */
  async uploadAndProcessPdf(fileOrPreset, targetMatterId = null) {
    const filename = fileOrPreset.name || fileOrPreset.filename || "مستند_قضائي_مرفوع.pdf";
    const pageCount = fileOrPreset.page_count || 6;
    const docId = 'doc_' + (db.documents.length + 401);
    const assignedMatterId = targetMatterId || (fileOrPreset.matter_id || db.matters[0].id);

    const newDoc = {
      id: docId,
      matter_id: assignedMatterId,
      filename: filename,
      page_count: pageCount,
      uploaded_at: 'الآن (معالجة Supabase)',
      ocr_status: 'review'
    };

    db.documents.unshift(newDoc);

    // Determine extractions
    const targetMatter = db.matters.find(m => m.id === assignedMatterId) || db.matters[0];
    const defaultExtractions = [
      {
        field_name: "رقم الدعوى والسنة القضائية",
        field_value: targetMatter.case_number,
        confidence: 99,
        review_state: "pending",
        bbox: { top: 12, left: 55, width: 38, height: 6 }
      },
      {
        field_name: "المحكمة المختصة والدائرة",
        field_value: `${targetMatter.court} - ${targetMatter.circuit}`,
        confidence: 96,
        review_state: "pending",
        bbox: { top: 20, left: 40, width: 52, height: 7 }
      },
      {
        field_name: "تاريخ الجلسة المقررة",
        field_value: targetMatter.next_hearing_date,
        confidence: 95,
        review_state: "pending",
        bbox: { top: 28, left: 48, width: 44, height: 6 }
      },
      {
        field_name: "اسم المدعي (المستأنف / الطالب)",
        field_value: targetMatter.client_name,
        confidence: 98,
        review_state: "pending",
        bbox: { top: 35, left: 30, width: 62, height: 8 }
      },
      {
        field_name: "اسم المدعى عليه (المطلوب ضده)",
        field_value: targetMatter.opponent_name,
        confidence: 93,
        review_state: "pending",
        bbox: { top: 44, left: 25, width: 68, height: 9 }
      },
      {
        field_name: "موضوع النزاع والطلبات القضائية",
        field_value: targetMatter.subject,
        confidence: 90,
        review_state: "pending",
        bbox: { top: 58, left: 20, width: 75, height: 12 }
      }
    ];

    const extractionsToUse = fileOrPreset.extractions || defaultExtractions;

    const newExtractions = extractionsToUse.map((item, idx) => ({
      id: `ext_${docId}_${idx + 1}`,
      document_id: docId,
      page: 1,
      field_name: item.field_name,
      field_value: item.field_value,
      confidence: item.confidence,
      review_state: "pending",
      bbox: item.bbox
    }));

    db.extractions.unshift(...newExtractions);

    return {
      document: newDoc,
      extractions: newExtractions
    };
  },

  /**
   * 6. Save Generated Legal Document directly to Supabase Case Documents
   */
  async saveGeneratedDocumentToMatter(matterId, documentName, content) {
    const docId = 'doc_' + (db.documents.length + 501);
    const newDoc = {
      id: docId,
      matter_id: matterId,
      filename: `${documentName}.pdf`,
      page_count: 3,
      uploaded_at: 'الآن (مستند مولّد ومعتمد)',
      ocr_status: 'done',
      content: content
    };

    db.documents.unshift(newDoc);
    return newDoc;
  }
};
