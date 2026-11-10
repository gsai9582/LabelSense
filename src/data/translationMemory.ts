import { TranslationBlock } from '../types';

export const TRANSLATION_MEMORY: TranslationBlock[] = [
  {
    key: 'SINGLE_USE_WARNING',
    label: 'Single Use Clinical Restriction',
    sourceEn: 'Do not re-use. For single use on a single patient only.',
    lockedTokens: ['{{SINGLE_USE}}', '{{PATIENT_RESTRICTION}}'],
    translations: {
      de: 'Nicht wiederverwenden. Nur zum einmaligen Gebrauch an einem einzelnen Patienten.',
      fr: 'Ne pas réutiliser. À usage unique pour un seul patient.',
      es: 'No reutilizar. Para un solo uso en un único paciente.',
      ja: '再使用禁止。単一の患者への単回使用に限定。',
      te: 'పునర్వినియోగించవద్దు. ఒకే రోగికి ఒకేసారి ఉపయోగించడానికి మాత్రమే.',
    },
    backTranslations: {
      de: {
        backText: 'Do not reuse. For one-time use only on an individual patient.',
        driftScore: 0.99,
        hasFlag: false,
      },
      ja: {
        backText: 'Reuse prohibited. Limited to single use on a single patient.',
        driftScore: 0.98,
        hasFlag: false,
      },
      fr: {
        backText: 'Do not reuse. Single use for one patient.',
        driftScore: 0.99,
        hasFlag: false,
      },
      te: {
        backText: 'Do not reuse. Only for single use on a single patient.',
        driftScore: 0.98,
        hasFlag: false,
      }
    }
  },
  {
    key: 'STERILIZATION_NOTICE',
    label: 'Sterilization State & Integrity',
    sourceEn: 'Sterile unless package is opened or damaged. Sterilized using ethylene oxide.',
    lockedTokens: ['{{STERILE_EO}}', '{{INTEGRITY_CHECK}}'],
    translations: {
      de: 'Steril, sofern die Verpackung nicht geöffnet oder beschädigt ist. Mit Ethylenoxid sterilisiert.',
      fr: 'Stérile sauf si l’emballage est ouvert ou endommagé. Stérilisé à l’oxyde d’éthylène.',
      es: 'Estéril salvo que el envase esté abierto o dañado. Esterilizado con óxido de etileno.',
      ja: '包装が開封または破損していない限り無菌。エチレンオキサイドガス滅菌済み。',
      te: 'ప్యాకేజీ తెరిచి లేదా దెబ్బతింటే తప్ప శుభ్రమైనది. ఇథిలీన్ ఆక్సైడ్ ఉపయోగించి క్రిమిరహితం చేయబడింది.',
    },
    backTranslations: {
      de: {
        backText: 'Sterile unless package is opened or damaged. Sterilized with ethylene oxide.',
        driftScore: 0.99,
        hasFlag: false,
      },
      ja: {
        backText: 'Sterile unless package is opened or damaged. Ethylene oxide gas sterilized.',
        driftScore: 0.98,
        hasFlag: false,
      }
    }
  },
  {
    key: 'STORAGE_CONDITIONS',
    label: 'Storage & Humidity Constraints',
    sourceEn: 'Store between 15°C and 30°C (59°F - 86°F). Keep dry and away from direct sunlight.',
    lockedTokens: ['{{TEMP_MIN_15}}', '{{TEMP_MAX_30}}', '{{KEEP_DRY}}'],
    translations: {
      de: 'Zwischen 15 °C und 30 °C lagern. Trocken aufbewahren und vor direkter Sonneneinstrahlung schützen.',
      fr: 'Conserver entre 15 °C et 30 °C. Conserver au sec et à l’abri du soleil direct.',
      es: 'Conservar entre 15 °C y 30 °C. Mantener seco y alejado de la luz solar directa.',
      ja: '15℃〜30℃で保管してください。乾燥状態を保ち、直射日光を避けてください。',
      te: '15°C మరియు 30°C మధ్య నిల్వ చేయండి. పొడిగా ఉంచండి మరియు నేరుగా సూర్యకాంతి నుండి దూరంగా ఉంచండి.',
    },
    backTranslations: {
      de: {
        backText: 'Store between 15°C and 30°C. Keep dry and protect from direct sunlight.',
        driftScore: 0.99,
        hasFlag: false,
      }
    }
  },
  {
    key: 'MRI_CONDITIONAL',
    label: 'MRI Safety Conditional Warning',
    sourceEn: 'MR Conditional. A patient with this stent can be scanned safely in an MR system under specified conditions.',
    lockedTokens: ['{{MR_CONDITIONAL}}', '{{FIELD_STRENGTH_3T}}'],
    translations: {
      de: 'Bedingt MR-sicher. Ein Patient mit diesem Stent kann unter festgelegten Bedingungen sicher gescannt werden.',
      fr: 'Compatible avec l’IRM sous conditions. Un patient porteur de ce stent peut passer un examen IRM en toute sécurité sous conditions prescrites.',
      es: 'Seguro para RM bajo ciertas condiciones. Un paciente con este stent puede someterse a RM con seguridad bajo condiciones específicas.',
      ja: 'MR条件付。本ステントを植え込んだ患者は、指定された条件下で安全にMR撮影を受けられます。',
      te: 'నిర్దిష్ట నిబంధనల ప్రకారం MR సురక్షితం. ఈ స్టెంట్ ఉన్న రోగి నిర్దేశించిన షరతుల ప్రకారం సురక్షితంగా MR పరీక్ష చేయించుకోవచ్చు.',
    },
    backTranslations: {
      de: {
        backText: 'MR Conditional. A patient with this stent can be safely scanned under specified conditions.',
        driftScore: 0.98,
        hasFlag: false,
      }
    }
  }
];

// Pre-seeded Neural Back-Translation Anomaly (used for Scenario B & C)
export const SEEDED_TRANSLATION_DRIFT_ANOMALY = {
  lang: 'ja',
  source: 'Do not re-use. For single use on a single patient only.',
  drifted: '洗浄後は再使用可能。複数患者への適用も可。', // Drifted error: "Reusable after cleaning. Applicable to multiple patients."
  backTranslated: 'CRITICAL ANOMALY: "Reusable after washing. Permitted for multiple patients."',
  clinicalRisk: 'CRITICAL' as const,
  reason: 'Semantic inversion of "Do not re-use" (ISO 15223-1 Ref 5.4.2) into "Reusable". Critical patient cross-contamination hazard.',
};
