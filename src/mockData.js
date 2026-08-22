/**
 * MOCK Data Store matching the exact database schema
 */
export const MOCK = {
  matters: [
    {
      id: "mat_101",
      case_number: "٤١٢٩ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "محكمة استئناف القاهرة",
      circuit: "الدائرة ٧ تجاري",
      stage: "استئناف",
      status: "متداولة",
      client_name: "شركة النيل للاستثمار العقاري",
      opponent_name: "مجموعة الأهرام للمقاولات العامة",
      subject: "منازعة تنفيذ عقد مقاولة وتعويض عن التأخير",
      next_hearing_date: "2026-08-25",
      assigned_to: "أ/ أحمد عبد الرحمن"
    },
    {
      id: "mat_102",
      case_number: "٨٩٢ لسنة ٢٠٢٤",
      case_year: 2024,
      court: "محكمة جنوب القاهرة الابتدائية",
      circuit: "الدائرة ١٢ مدني كلي",
      stage: "أول درجة",
      status: "متداولة",
      client_name: "البنك الأهلي التجاري",
      opponent_name: "الشركة الدولية للتوريدات",
      subject: "دعوى مطالبة بمستحقات مالية وفوائد قانونية",
      next_hearing_date: "2026-08-22",
      assigned_to: "أ/ سارة القاضي"
    },
    {
      id: "mat_103",
      case_number: "١٥٣٤ لسنة ٧١ ق",
      case_year: 2024,
      court: "محكمة النقض",
      circuit: "الدائرة المدنية والتجارية",
      stage: "نقض",
      status: "محكوم فيها",
      client_name: "المستشار / سمير خليل وشركاه",
      opponent_name: "مصلحة الضرائب المصرية",
      subject: "طعن بالنقض في تقدير أرباح تجارية وصناعية",
      next_hearing_date: "2026-09-14",
      assigned_to: "أ/ محمود الشناوي"
    },
    {
      id: "mat_104",
      case_number: "٢٦٧ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "محكمة القاهرة الاقتصادية",
      circuit: "دائرة جنح مستأنف",
      stage: "استئناف اقتصادي",
      status: "متداولة",
      client_name: "منصة دلتا للمدفوعات الرقمية",
      opponent_name: "شركة التقنية الحديثة",
      subject: "دعوى تعدٍ على علامة تجارية ومنافسة غير مشروعة",
      next_hearing_date: "2026-08-22",
      assigned_to: "أ/ أحمد عبد الرحمن"
    },
    {
      id: "mat_105",
      case_number: "٣٨١٠ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "محكمة شمال الجيزة الابتدائية",
      circuit: "الدائرة ٣ تعويضات",
      stage: "أول درجة",
      status: "متداولة",
      client_name: "مستشفى الشروق التخصصي",
      opponent_name: "شركة التأمين المتحدة",
      subject: "مطالبة بقيمة وثيقة تأمين الأخطاء المهنية",
      next_hearing_date: "2026-08-29",
      assigned_to: "أ/ كريم فؤاد"
    },
    {
      id: "mat_106",
      case_number: "٥٥٢ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "مجلس الدولة - محكمة القضاء الإداري",
      circuit: "الدائرة الأولى منازعات أفراد",
      stage: "قضاء إداري",
      status: "متداولة",
      client_name: "د. هدى عبد العزيز",
      opponent_name: "وزارة الإسكان والمرافق",
      subject: "طعن على قرار إلغاء تخصيص قطعة أرض صناعية",
      next_hearing_date: "2026-09-02",
      assigned_to: "أ/ محمود الشناوي"
    },
    {
      id: "mat_107",
      case_number: "١١٩٠ لسنة ٢٠٢٤",
      case_year: 2024,
      court: "محكمة استئناف الإسكندرية",
      circuit: "الدائرة ٥ عمال",
      stage: "استئناف",
      status: "مؤجلة للتقرير",
      client_name: "الشركة البحرية للملاحة",
      opponent_name: "عاطف محمد وآخرين (عُمال)",
      subject: "استئناف حكم تعويض فصل تعسفي ومكافأة نهاية خدمة",
      next_hearing_date: "2026-09-10",
      assigned_to: "أ/ سارة القاضي"
    },
    {
      id: "mat_108",
      case_number: "٧٢٤ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "محكمة الجيزة الابتدائية",
      circuit: "الدائرة ٩ إيجارات",
      stage: "أول درجة",
      status: "متداولة",
      client_name: "ورثة الحاج عبد المنعم متولي",
      opponent_name: "سلسلة محلات الفرجاني",
      subject: "دعوى إخلاء لعدم سداد الأجرة وتكرار التأخير",
      next_hearing_date: "2026-08-30",
      assigned_to: "أ/ كريم فؤاد"
    },
    {
      id: "mat_109",
      case_number: "٤٠٥ لسنة ٢٠٢٦",
      case_year: 2026,
      court: "محكمة القاهرة الاقتصادية",
      circuit: "الدائرة ٢ استئناف",
      stage: "استئناف اقتصادي",
      status: "جديدة",
      client_name: "تطبيق وصلة للتوصيل الذكي",
      opponent_name: "الهيئة القومية لسلامة النقل",
      subject: "بطلان قرار إداري بفرض رسوم تشغيل غير مقننة",
      next_hearing_date: "2026-09-18",
      assigned_to: "أ/ أحمد عبد الرحمن"
    },
    {
      id: "mat_110",
      case_number: "٨١٣ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "محكمة استئناف القاهرة",
      circuit: "الدائرة ١٨ مدني",
      stage: "استئناف",
      status: "محجوزة للحكم",
      client_name: "المهندس / طارق جلال",
      opponent_name: "بنك قناة السويس",
      subject: "براءة ذمة من كفالة عينية ورفع حجز تنفيذي",
      next_hearing_date: "2026-08-27",
      assigned_to: "أ/ محمود الشناوي"
    },
    {
      id: "mat_111",
      case_number: "٦٣١ لسنة ٢٠٢٤",
      case_year: 2024,
      court: "محكمة أسرة مدينة نصر",
      circuit: "الدائرة ٤ وراثات ووصايا",
      stage: "أول درجة",
      status: "منتهية صلحاً",
      client_name: "السيدة / ماجدة توفيق",
      opponent_name: "عصام إبراهيم وشركاه",
      subject: "تصفية تركة وتوزيع أنصبة شرعية",
      next_hearing_date: "2026-09-25",
      assigned_to: "أ/ سارة القاضي"
    },
    {
      id: "mat_112",
      case_number: "٩٨٠ لسنة ٢٠٢٥",
      case_year: 2025,
      court: "محكمة حلوان الكلية",
      circuit: "الدائرة ٦ صحة توقيع",
      stage: "أول درجة",
      status: "متداولة",
      client_name: "شركة الواحة للإنشاء والتعمير",
      opponent_name: "شركة المعادي للتنمية",
      subject: "دعوى صحة ونفاذ عقد بيع عقاري مشهر مبدئياً",
      next_hearing_date: "2026-08-22",
      assigned_to: "أ/ كريم فؤاد"
    }
  ],

  hearings: [
    {
      id: "hr_201",
      matter_id: "mat_102",
      hearing_date: "2026-08-22",
      hearing_time: "09:30 ص",
      court: "محكمة جنوب القاهرة الابتدائية",
      circuit: "الدائرة ١٢ مدني كلي",
      outcome: "بانتظار الانعقاد",
      adjournment_reason: "لتقديم أصل السند الإذني والمذكرات الختامية",
      next_date: "2026-09-15"
    },
    {
      id: "hr_202",
      matter_id: "mat_104",
      hearing_date: "2026-08-22",
      hearing_time: "11:00 ص",
      court: "محكمة القاهرة الاقتصادية",
      circuit: "دائرة جنح مستأنف",
      outcome: "بانتظار الانعقاد",
      adjournment_reason: "لورود تقرير خبير الملكية الفكرية",
      next_date: "2026-09-20"
    },
    {
      id: "hr_203",
      matter_id: "mat_112",
      hearing_date: "2026-08-22",
      hearing_time: "12:30 م",
      court: "محكمة حلوان الكلية",
      circuit: "الدائرة ٦ صحة توقيع",
      outcome: "بانتظار الانعقاد",
      adjournment_reason: "لإعادة الإعلان وتكليف المدعي بتقديم كشف رسمي",
      next_date: "2026-09-08"
    },
    {
      id: "hr_204",
      matter_id: "mat_101",
      hearing_date: "2026-08-25",
      hearing_time: "10:00 ص",
      court: "محكمة استئناف القاهرة",
      circuit: "الدائرة ٧ تجاري",
      outcome: "مقررة",
      adjournment_reason: "سماع مرافعة المستأنف ضده والرد على الدفوع الشكلية",
      next_date: "2026-09-29"
    },
    {
      id: "hr_205",
      matter_id: "mat_110",
      hearing_date: "2026-08-27",
      hearing_time: "10:30 ص",
      court: "محكمة استئناف القاهرة",
      circuit: "الدائرة ١٨ مدني",
      outcome: "مقررة",
      adjournment_reason: "النطق بالحكم مع استمرار المداولة",
      next_date: "2026-08-27"
    },
    {
      id: "hr_206",
      matter_id: "mat_105",
      hearing_date: "2026-08-29",
      hearing_time: "11:30 ص",
      court: "محكمة شمال الجيزة الابتدائية",
      circuit: "الدائرة ٣ تعويضات",
      outcome: "مقررة",
      adjournment_reason: "حضور الطبيب الشرعي الاستشاري للمناقشة",
      next_date: "2026-10-04"
    }
  ],

  deadlines: [
    {
      id: "dl_301",
      matter_id: "mat_101",
      title: "إيداع مذكرة الرد على الاستئناف المقابل",
      due_date: "2026-08-20",
      trigger_event: "إعلان صحيفة الاستئناف المقابل",
      trigger_date: "2026-08-10",
      rule_name: "ميعاد تقديم المذكرات التبادلية للاستئناف",
      rule_citation: "مادة ٢٣٥ من قانون المرافعات المدنية والتجارية",
      status: "provisional"
    },
    {
      id: "dl_302",
      matter_id: "mat_102",
      title: "تقديم أصل أوراق السند التنفيذي والمستندات",
      due_date: "2026-08-23",
      trigger_event: "قرار المحكمة بجلسة ٨ أغسطس ٢٠٢٦",
      trigger_date: "2026-08-08",
      rule_name: "أجل تقديم مستندات قاطعة في الدعوى",
      rule_citation: "مادة ٦٥ مرافعات فقرة ٢",
      status: "confirmed"
    },
    {
      id: "dl_303",
      matter_id: "mat_106",
      title: "الطعن أمام المحكمة الإدارية العليا",
      due_date: "2026-08-26",
      trigger_event: "استلام الصيغة التنفيذية لحكم القضاء الإداري",
      trigger_date: "2026-06-27",
      rule_name: "ميعاد الطعن أمام الإدارية العليا (٦٠ يوماً)",
      rule_citation: "مادة ٤٤ من قانون مجلس الدولة رقم ٤٧ لسنة ١٩٧٢",
      status: "confirmed"
    },
    {
      id: "dl_304",
      matter_id: "mat_104",
      title: "سداد أمانة خبير الملكية الفكرية المقضي بها",
      due_date: "2026-08-28",
      trigger_event: "جلسة الحكم التمهيدي بندب خبير",
      trigger_date: "2026-08-14",
      rule_name: "مهلة إيداع أمانة الخبير القضائي",
      rule_citation: "مادة ١٣٦ من قانون الإثبات رقم ٢٥ لسنة ١٩٦٨",
      status: "provisional"
    },
    {
      id: "dl_305",
      matter_id: "mat_103",
      title: "إيداع صحيفة الطعن بالنقض لدى قلم كتاب محكمة النقض",
      due_date: "2026-09-05",
      trigger_event: "صدور الحكم الاستئنافي المطعون فيه",
      trigger_date: "2026-07-07",
      rule_name: "ميعاد الطعن بالنقض المدني (٦٠ يوماً)",
      rule_citation: "مادة ٢٥٢ من قانون المرافعات المدنية والتجارية",
      status: "confirmed"
    },
    {
      id: "dl_306",
      matter_id: "mat_108",
      title: "إعلان شواهد التزوير الفرعي في عقد الإيجار",
      due_date: "2026-09-12",
      trigger_event: "التقرير بالطعن بالتزوير بجلسة المحكمة",
      trigger_date: "2026-09-04",
      rule_name: "ميعاد إعلان مذكرة شواهد التزوير (٨ أيام)",
      rule_citation: "مادة ٤٩ من قانون الإثبات في المواد المدنية والتجارية",
      status: "provisional"
    }
  ],

  documents: [
    {
      id: "doc_401",
      matter_id: "mat_101",
      filename: "صحيفة_افتتاح_الدعوى_وحافظة_المستندات.pdf",
      page_count: 14,
      uploaded_at: "2026-08-21 16:40",
      ocr_status: "review"
    },
    {
      id: "doc_402",
      matter_id: "mat_101",
      filename: "عقد_مقاولة_رئيسي_مشروع_القطامية.pdf",
      page_count: 28,
      uploaded_at: "2026-08-22 08:15",
      ocr_status: "extracting"
    },
    {
      id: "doc_403",
      matter_id: "mat_102",
      filename: "سند_إذني_وكشف_حساب_معتمد.pdf",
      page_count: 6,
      uploaded_at: "2026-08-22 09:30",
      ocr_status: "reading"
    },
    {
      id: "doc_404",
      matter_id: "mat_104",
      filename: "شهادة_تسجيل_علامة_تجارية_رقم_٩٨٢٣.pdf",
      page_count: 3,
      uploaded_at: "2026-08-22 10:10",
      ocr_status: "queued"
    },
    {
      id: "doc_405",
      matter_id: "mat_105",
      filename: "تقرير_الطب_الشرعي_المبدئي.pdf",
      page_count: 9,
      uploaded_at: "2026-08-19 14:20",
      ocr_status: "done"
    }
  ],

  extractions: [
    {
      id: "ext_501",
      document_id: "doc_401",
      page: 1,
      field_name: "رقم الدعوى والسنة القضائية",
      field_value: "٤١٢٩ لسنة ٢٠٢٥ تجاري",
      confidence: 98,
      review_state: "accepted",
      bbox: { top: 12, left: 55, width: 38, height: 6 }
    },
    {
      id: "ext_502",
      document_id: "doc_401",
      page: 1,
      field_name: "المحكمة المختصة والدائرة",
      field_value: "محكمة استئناف القاهرة - مأمورية شمال",
      confidence: 94,
      review_state: "accepted",
      bbox: { top: 20, left: 40, width: 52, height: 7 }
    },
    {
      id: "ext_503",
      document_id: "doc_401",
      page: 1,
      field_name: "اسم المدعي وصفته",
      field_value: "شركة النيل للاستثمار العقاري (ش.م.م)",
      confidence: 96,
      review_state: "accepted",
      bbox: { top: 32, left: 30, width: 62, height: 8 }
    },
    {
      id: "ext_504",
      document_id: "doc_401",
      page: 1,
      field_name: "اسم المدعى عليه ومحل إعلانه",
      field_value: "مجموعة الأهرام للمقاولات - المقر الإداري بالدقي",
      confidence: 88,
      review_state: "pending",
      bbox: { top: 44, left: 25, width: 68, height: 9 }
    },
    {
      id: "ext_505",
      document_id: "doc_401",
      page: 2,
      field_name: "تاريخ إعلان الصحيفة للمعلن إليه",
      field_value: "١٤ يوليو ٢٠٢٥",
      confidence: 92,
      review_state: "pending",
      bbox: { top: 18, left: 45, width: 45, height: 7 }
    },
    {
      id: "ext_506",
      document_id: "doc_401",
      page: 2,
      field_name: "مبلغ المطالبة المالية الأصلي",
      field_value: "١٨,٥٠٠,٠٠٠ جنيه مصري",
      confidence: 68,
      review_state: "pending",
      bbox: { top: 35, left: 35, width: 50, height: 8 }
    },
    {
      id: "ext_507",
      document_id: "doc_401",
      page: 3,
      field_name: "الدفوع وطلبات الموكل الختامية",
      field_value: "فسخ العقد والتعويض الجابر للضرر بنسبة ٥٪",
      confidence: 76,
      review_state: "pending",
      bbox: { top: 55, left: 20, width: 75, height: 14 }
    },
    {
      id: "ext_508",
      document_id: "doc_401",
      page: 3,
      field_name: "اسم المحضر القائم بالإعلان",
      field_value: "قلم محضرين الدقي - محضر أول",
      confidence: 82,
      review_state: "pending",
      bbox: { top: 78, left: 50, width: 42, height: 7 }
    }
  ],

  chronology: [
    {
      id: "chr_601",
      matter_id: "mat_101",
      event_date: "2024-03-15",
      description: "توقيع عقد المقاولة الابتدائي للأعمال الإنشائية ببرج النيل بلازا بقيمة ٦٠ مليون جنيه.",
      document_id: "doc_402",
      page: 2
    },
    {
      id: "chr_602",
      matter_id: "mat_101",
      event_date: "2024-11-20",
      description: "توجيه إنذار رسمي على يد محضر بضرورة إنهاء المرحلة الخرسانية الأولى وتلافي العيوب الهندسية.",
      document_id: "doc_401",
      page: 5
    },
    {
      id: "chr_603",
      matter_id: "mat_101",
      event_date: "2025-02-10",
      description: "محضر إثبات حالة رقم ٨٩٠ إداري التجمع الخامس يثبت توقف المقاول عن استكمال الموقع.",
      document_id: "doc_401",
      page: 8
    },
    {
      id: "chr_604",
      matter_id: "mat_101",
      event_date: "2025-07-14",
      description: "قيد صحيفة الدعوى أمام محكمة استئناف القاهرة وقيدها برقم ٤١٢٩ لسنة ٢٠٢٥ تجاري.",
      document_id: "doc_401",
      page: 1
    },
    {
      id: "chr_605",
      matter_id: "mat_101",
      event_date: "2025-10-08",
      description: "أولى جلسات تداول الدعوى وتقديم حافظة مستندات الموكل وإعلان الخصم بأصل الطلبات.",
      document_id: "doc_401",
      page: 12
    }
  ],

  deadline_rules: [
    {
      id: "rule_701",
      rule_name: "ميعاد استئناف الأحكام الصادرة في المواد المدنية والتجارية",
      trigger_event: "صدور الحكم أو إعلانه إذا كان غيابياً",
      duration: 40,
      duration_unit: "يوم",
      citation: "المادة ٢٢٧ من قانون المرافعات المدنية والتجارية رقم ١٣ لسنة ١٩٦٨",
      active: true
    },
    {
      id: "rule_702",
      rule_name: "ميعاد استئناف الأحكام في المواد المستعجلة",
      trigger_event: "صدور الحكم المستعجل",
      duration: 15,
      duration_unit: "يوم",
      citation: "المادة ٢٢٧ فقرة ٢ من قانون المرافعات",
      active: true
    },
    {
      id: "rule_703",
      rule_name: "ميعاد الطعن بالنقض في المواد المدنية والتجارية",
      trigger_event: "صدور الحكم الاستئنافي المنهي للخصومة",
      duration: 60,
      duration_unit: "يوم",
      citation: "المادة ٢٥٢ من قانون المرافعات المدنية والتجارية",
      active: true
    },
    {
      id: "rule_704",
      rule_name: "ميعاد الطعن أمام المحكمة الإدارية العليا بمجلس الدولة",
      trigger_event: "صدور حكم محكمة القضاء الإداري",
      duration: 60,
      duration_unit: "يوم",
      citation: "المادة ٤٤ من قانون مجلس الدولة رقم ٤٧ لسنة ١٩٧٢",
      active: true
    },
    {
      id: "rule_705",
      rule_name: "ميعاد إعلان شواهد التزوير الفرعي في المستندات",
      trigger_event: "التقرير بالطعن بالتزوير في قلم الكتاب أو بالجلسة",
      duration: 8,
      duration_unit: "يوم",
      citation: "المادة ٤٩ من قانون الإثبات رقم ٢٥ لسنة ١٩٦٨",
      active: true
    },
    {
      id: "rule_706",
      rule_name: "ميعاد التظلم من أوامر الأداء والأوامر على عرائض",
      trigger_event: "إعلان أمر الأداء أو الأمر على عريضة للمدين",
      duration: 10,
      duration_unit: "يوم",
      citation: "المادة ٢٠٦ من قانون المرافعات المدنية والتجارية",
      active: true
    }
  ],

  archive_corpus: [
    {
      id: "arch_801",
      matter_id: "mat_101",
      matter_title: "شركة النيل ضد الأهرام للمقاولات (٤١٢٩ / ٢٠٢٥)",
      document_name: "عقد_مقاولة_رئيسي_مشروع_القطامية.pdf",
      page: 14,
      court: "محكمة استئناف القاهرة",
      doc_type: "عقود واتفاقيات",
      date: "2024-03-15",
      snippet: "... وفي حال إخلال المقاول بالجدول الزمني المعتمد يحق للمالك توقيع غرامة تأخير اتفاقية بواقع ٠.٥٪ عن كل أسبوع تأخير دون حاجة إلى إنذار أو إعذار قضائي طبقاً لأحكام <mark>عقد المقاولة</mark> والتعويض الاتفاقي المنصوص عليه..."
    },
    {
      id: "arch_802",
      matter_id: "mat_102",
      matter_title: "البنك الأهلي ضد الدولية للتوريدات (٨٩٢ / ٢٠٢٤)",
      document_name: "مذكرة_دفاع_في_سند_إذني.pdf",
      page: 4,
      court: "محكمة جنوب القاهرة الابتدائية",
      doc_type: "مذكرات دفاع",
      date: "2024-11-12",
      snippet: "... وحيث إن الثابت أن <mark>السند الإذني</mark> سند تنفيذي مكتمل الشروط الشكلية والموضوعية المنصوص عليها بقانون التجارة رقم ١٧ لسنة ١٩٩٩، ولا يجوز للخصم الدفع بصورية الالتزام لعدم ثبوت غش أو تدليس..."
    },
    {
      id: "arch_803",
      matter_id: "mat_103",
      matter_title: "المستشار سمير خليل ضد مصلحة الضرائب (١٥٣٤ / ٧١ ق)",
      document_name: "تقرير_الطعن_بالنقض_الضريبي.pdf",
      page: 9,
      court: "محكمة النقض",
      doc_type: "صحف طعون",
      date: "2024-08-30",
      snippet: "... مخالفة الحكم المطعون فيه للقانون والخطأ في تطبيقه حين اعتبر المأمورية محقة في إهدار الدفاتر المنتظمة دون استناد إلى تقرير فني صريح يثبت عدم مطابقتها للواقع المالي..."
    },
    {
      id: "arch_804",
      matter_id: "mat_106",
      matter_title: "د. هدى ضد الإسكان (٥٥٢ / ٢٠٢٥)",
      document_name: "حكم_قضاء_إداري_إلغاء_قرار.pdf",
      page: 6,
      court: "مجلس الدولة",
      doc_type: "أحكام قضائية",
      date: "2025-05-18",
      snippet: "... حكمت المحكمة بإلغاء القرار المطعون فيه رقم ٤١٢ الصادر من هيئة المجتمعات العمرانية وما ترتب عليه من آثار، وإلزام جهة الإدارة بالمصروفات ومقابل أتعاب المحاماة..."
    }
  ]
};
