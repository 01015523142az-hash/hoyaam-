/**
 * Automated PDF Document Processing & AI Field Extraction Engine
 * Extracts Case Number, Hearing Date, Competent Court, Parties, and Legal Demands
 */

export const PDF_PRESETS = [
  {
    id: "preset_1",
    filename: "صحيفة_استئناف_تجاري_٤١٢٩_لسنة_٢٠٢٥.pdf",
    page_count: 8,
    matter_id: "mat_101",
    extractions: [
      {
        field_name: "رقم الدعوى والسنة القضائية",
        field_value: "٤١٢٩ لسنة ٢٠٢٥ تجاري استئناف",
        confidence: 99,
        review_state: "pending",
        bbox: { top: 12, left: 55, width: 38, height: 6 }
      },
      {
        field_name: "المحكمة المختصة والدائرة",
        field_value: "محكمة استئناف القاهرة - الدائرة ٧ تجاري",
        confidence: 96,
        review_state: "pending",
        bbox: { top: 20, left: 40, width: 52, height: 7 }
      },
      {
        field_name: "تاريخ الجلسة المقررة",
        field_value: "2026-08-25",
        confidence: 95,
        review_state: "pending",
        bbox: { top: 28, left: 48, width: 44, height: 6 }
      },
      {
        field_name: "اسم المدعي (المستأنف)",
        field_value: "شركة النيل للاستثمار العقاري (ش.م.م)",
        confidence: 97,
        review_state: "pending",
        bbox: { top: 35, left: 30, width: 62, height: 8 }
      },
      {
        field_name: "اسم المدعى عليه (المستأنف ضده)",
        field_value: "مجموعة الأهرام للمقاولات العامة",
        confidence: 91,
        review_state: "pending",
        bbox: { top: 44, left: 25, width: 68, height: 9 }
      },
      {
        field_name: "الطلبات والمبلغ المطالب به",
        field_value: "إلزام المستأنف ضده بسداد مبلغ ١٨,٥٠٠,٠٠٠ جنيه وفوائد التأخير ٥٪",
        confidence: 88,
        review_state: "pending",
        bbox: { top: 58, left: 20, width: 75, height: 12 }
      }
    ]
  },
  {
    id: "preset_2",
    filename: "حكم_ابتدائي_مطالبة_مالية_٨٩٢_جنوب_القاهرة.pdf",
    page_count: 5,
    matter_id: "mat_102",
    extractions: [
      {
        field_name: "رقم الدعوى والسنة القضائية",
        field_value: "٨٩٢ لسنة ٢٠٢٤ مدني كلي",
        confidence: 98,
        review_state: "pending",
        bbox: { top: 10, left: 50, width: 42, height: 7 }
      },
      {
        field_name: "المحكمة المختصة والدائرة",
        field_value: "محكمة جنوب القاهرة الابتدائية - الدائرة ١٢ مدني كلي",
        confidence: 95,
        review_state: "pending",
        bbox: { top: 18, left: 35, width: 58, height: 7 }
      },
      {
        field_name: "تاريخ الجلسة المقررة",
        field_value: "2026-08-22",
        confidence: 94,
        review_state: "pending",
        bbox: { top: 26, left: 52, width: 40, height: 6 }
      },
      {
        field_name: "اسم المدعي (طالب التنفيذ)",
        field_value: "البنك الأهلي التجاري",
        confidence: 99,
        review_state: "pending",
        bbox: { top: 34, left: 30, width: 60, height: 7 }
      },
      {
        field_name: "اسم المدعى عليه (المدين)",
        field_value: "الشركة الدولية للتوريدات والتوكيلات التجارية",
        confidence: 92,
        review_state: "pending",
        bbox: { top: 43, left: 28, width: 65, height: 8 }
      }
    ]
  },
  {
    id: "preset_3",
    filename: "عريضة_طعن_بالنقض_١٥٣٤_لسنة_٧١_ق.pdf",
    page_count: 12,
    matter_id: "mat_103",
    extractions: [
      {
        field_name: "رقم الدعوى والسنة القضائية",
        field_value: "١٥٣٤ لسنة ٧١ ق",
        confidence: 99,
        review_state: "pending",
        bbox: { top: 11, left: 55, width: 40, height: 6 }
      },
      {
        field_name: "المحكمة المختصة والدائرة",
        field_value: "محكمة النقض - الدائرة المدنية والتجارية",
        confidence: 97,
        review_state: "pending",
        bbox: { top: 19, left: 38, width: 55, height: 7 }
      },
      {
        field_name: "تاريخ الجلسة المقررة",
        field_value: "2026-09-14",
        confidence: 96,
        review_state: "pending",
        bbox: { top: 27, left: 45, width: 45, height: 6 }
      },
      {
        field_name: "اسم المدعي (الطاعن)",
        field_value: "المستشار / سمير خليل وشركاه",
        confidence: 95,
        review_state: "pending",
        bbox: { top: 36, left: 30, width: 62, height: 8 }
      },
      {
        field_name: "اسم المدعى عليه (المطعون ضده)",
        field_value: "مصلحة الضرائب المصرية - مركز كبار الممولين",
        confidence: 94,
        review_state: "pending",
        bbox: { top: 46, left: 25, width: 68, height: 8 }
      }
    ]
  }
];

export function processUploadedPdf(fileOrPreset, state) {
  const isPreset = typeof fileOrPreset === 'object' && fileOrPreset.filename;
  const filename = isPreset ? fileOrPreset.filename : (fileOrPreset.name || "مستند_قضائي_مرفوع.pdf");
  const docId = 'doc_' + (window.MOCK.documents.length + 401);
  const matchedPreset = PDF_PRESETS.find(p => p.filename === filename) || PDF_PRESETS[0];

  const newDoc = {
    id: docId,
    matter_id: state.activeMatterId || matchedPreset.matter_id || "mat_101",
    filename: filename,
    page_count: matchedPreset.page_count || 6,
    uploaded_at: "الآن (معالجة ذكية)",
    ocr_status: "review"
  };

  window.MOCK.documents.unshift(newDoc);

  // Generate extractions for this document
  const newExtractions = matchedPreset.extractions.map((item, idx) => ({
    id: `ext_${docId}_${idx + 1}`,
    document_id: docId,
    page: 1,
    field_name: item.field_name,
    field_value: item.field_value,
    confidence: item.confidence,
    review_state: "pending",
    bbox: item.bbox
  }));

  window.MOCK.extractions.unshift(...newExtractions);

  state.activeDocumentId = docId;
  state.activeExtractionId = newExtractions[0]?.id;
  state.activeScreen = 'review';

  return { newDoc, newExtractions };
}
