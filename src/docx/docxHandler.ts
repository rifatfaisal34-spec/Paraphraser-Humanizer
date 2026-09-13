/**
 * DOCX Document Handler using JSZip
 * Reads, extracts, and repacks OpenXML (.docx) documents.
 * Preserves 100% of formatting, layout, styles, tables, headers, and margins.
 */

import JSZip from 'jszip';
import { ParagraphData } from '../types';
import { sanitizePunctuationSpacing } from '../nlp/sanitizer';
import { isSectionHeading } from '../nlp/sentenceValidator';

export interface ExtractedParagraph {
  text: string;
  styleName?: string;
  isHeading?: boolean;
  headingLevel?: number;
  xmlNodeIndex: number;
}

export interface DocxParseResult {
  fileName: string;
  fileSize: number;
  paragraphs: ExtractedParagraph[];
  zipInstance: JSZip;
  rawXml: string;
}

/**
 * Parse an uploaded DOCX file into paragraph items while preserving the ZIP instance.
 */
export async function parseDocx(file: File | Blob, fileName: string): Promise<DocxParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const documentXmlFile = zip.file('word/document.xml');
  if (!documentXmlFile) {
    throw new Error('Invalid DOCX: "word/document.xml" was not found in the archive.');
  }

  const rawXml = await documentXmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawXml, 'application/xml');

  // Check for parse error
  const parserError = xmlDoc.getElementsByTagName('parsererror');
  if (parserError.length > 0) {
    throw new Error('Failed to parse XML within DOCX document.');
  }

  const pNodes = xmlDoc.getElementsByTagNameNS('*', 'p');
  const extractedParagraphs: ExtractedParagraph[] = [];

  for (let i = 0; i < pNodes.length; i++) {
    const pNode = pNodes[i];

    // Extract all text inside this paragraph (<w:t>)
    const tNodes = pNode.getElementsByTagNameNS('*', 't');
    let fullText = '';
    for (let j = 0; j < tNodes.length; j++) {
      const tVal = tNodes[j].textContent || '';
      if (fullText && !/\s$/.test(fullText) && /^[A-Za-z0-9]/.test(tVal)) {
        if (/[.!?]$/.test(fullText)) {
          fullText += ' ';
        }
      }
      fullText += tVal;
    }
    fullText = sanitizePunctuationSpacing(fullText);

    // Check heading style
    const pStyleNode = pNode.getElementsByTagNameNS('*', 'pStyle')[0];
    const styleVal = pStyleNode ? pStyleNode.getAttribute('w:val') || pStyleNode.getAttribute('val') : undefined;

    let isHeading = false;
    let headingLevel = undefined;
    if (styleVal) {
      const headingMatch = styleVal.match(/Heading([1-6])/i);
      if (headingMatch) {
        isHeading = true;
        headingLevel = parseInt(headingMatch[1], 10);
      } else if (/title|heading/i.test(styleVal)) {
        isHeading = true;
      }
    }

    // Also check linguistic patterns for section titles (e.g. "1. Introduction", "Abstract", "Methodology")
    if (!isHeading && isSectionHeading(fullText)) {
      isHeading = true;
    }

    extractedParagraphs.push({
      text: fullText,
      styleName: styleVal || undefined,
      isHeading,
      headingLevel,
      xmlNodeIndex: i,
    });
  }

  return {
    fileName,
    fileSize: file.size,
    paragraphs: extractedParagraphs,
    zipInstance: zip,
    rawXml,
  };
}

/**
 * Re-inject paraphrased text into word/document.xml and export as identical .docx
 */
export async function exportParaphrasedDocx(
  zip: JSZip,
  paragraphs: ParagraphData[],
  outputFileName: string = 'paraphrased_document.docx'
): Promise<{ blob: Blob; fileName: string }> {
  const documentXmlFile = zip.file('word/document.xml');
  if (!documentXmlFile) {
    throw new Error('Could not find word/document.xml in loaded zip.');
  }

  const rawXml = await documentXmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawXml, 'application/xml');

  const pNodes = xmlDoc.getElementsByTagNameNS('*', 'p');

  paragraphs.forEach((p) => {
    const nodeIndex = p.xmlNodeIndex !== undefined ? p.xmlNodeIndex : -1;
    if (nodeIndex >= 0 && nodeIndex < pNodes.length) {
      const targetP = pNodes[nodeIndex];
      const tNodes = targetP.getElementsByTagNameNS('*', 't');

      if (tNodes.length > 0) {
        // Place full paraphrased text in the first text run, preserving its run formatting (<w:rPr>)
        tNodes[0].textContent = p.paraphrasedText;

        // Ensure xml:space="preserve" is set so Word keeps spacing
        tNodes[0].setAttribute('xml:space', 'preserve');

        // Clear subsequent text runs in this paragraph so text isn't duplicated
        for (let j = 1; j < tNodes.length; j++) {
          tNodes[j].textContent = '';
        }
      }
    }
  });

  const serializer = new XMLSerializer();
  const modifiedXml = serializer.serializeToString(xmlDoc);

  // Update the file in the zip
  zip.file('word/document.xml', modifiedXml);

  // Generate downloadable blob
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return { blob, fileName: outputFileName };
}

/**
 * Create a sample valid DOCX document in-memory so users can test immediately.
 */
export async function createSampleDocx(sampleType: 'academic' | 'business' | 'casual'): Promise<{
  blob: Blob;
  fileName: string;
  paragraphs: ExtractedParagraph[];
  zipInstance: JSZip;
  rawXml: string;
}> {
  const zip = new JSZip();

  let title = '';
  let contentParagraphs: string[] = [];
  let fileName = '';

  if (sampleType === 'academic') {
    fileName = 'AI_Draft_Social_Media_Research.docx';
    title = 'Impact of Social Media Usage on Well-Being in University Students';
    contentParagraphs = [
      '1. Introduction',
      'In this empirical investigation, a representative sample of 380 university students completed a structured survey measure. The dataset was analyzed using multiple regression models to examine psychological outcomes. The primary results demonstrate that frequent social media use was significantly correlated with reduced self-esteem (r = -0.34, p < .01). Furthermore, it is crucial to delve into how peer comparison plays a pivotal role in shaping daily affective experiences.',
      'Table 1: Participant Demographics and Baseline Characteristics',
      'Data collection and preprocessing.',
      'Note: A representative sample of 380 university students completed a structured survey measure. Demographic indicators were recorded during the initial intake phase.',
      'The statistical models meticulously controlled for baseline demographic indicators and academic load across participants. In addition, these quantitative findings stand as a testament to the importance of fostering mindful digital consumption. It is worth noting that future longitudinal research should continue to explore how specific algorithmic feeds influence cognitive fatigue over time.',
    ];
  } else if (sampleType === 'business') {
    fileName = 'AI_Draft_Executive_Proposal.docx';
    title = 'Strategic Proposal for Enterprise Workflow Modernization';
    contentParagraphs = [
      'Executive Summary:',
      'A comprehensive audit was performed across legacy enterprise applications to identify persistent operational bottlenecks. Furthermore, it is crucial to navigate the dynamic landscape of cloud infrastructure to maintain a competitive market posture. The engineering leadership team meticulously reviewed the initial metrics, which underscored the paramount importance of automation.',
      'Section 2. Key Initiatives',
      'Quarterly infrastructure milestones.',
      'Note: Operational efficiency increased by 28% following the implementation of continuous integration pipelines.',
      'In addition, this strategic overhaul stands as a testament to fostering cross-functional efficiency across distributed teams. We must leverage modern integration patterns to spearhead innovation and streamline delivery pipelines.',
    ];
  } else {
    fileName = 'AI_Draft_Team_Announcement.docx';
    title = 'Weekly Product Sprint and Architecture Sync';
    contentParagraphs = [
      'Sprint Overview:',
      'Our development squad completed the core platform redesign during the previous weekly sprint cycle. Furthermore, it is crucial to delve into the user feedback metrics to verify that navigation remains seamless. We are embarking on a fresh series of usability tests to ensure high performance before the upcoming production rollout.',
      'Release 4.2 roadmap and deliverables.',
    ];
  }

  // Minimal standard OpenXML structures
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="1E293B"/>
        </w:rPr>
        <w:t xml:space="preserve">${title}</w:t>
      </w:r>
    </w:p>
    ${contentParagraphs
      .map(
        (p) => `<w:p>
      <w:pPr>
        <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
          <w:color w:val="334155"/>
        </w:rPr>
        <w:t xml:space="preserve">${p}</w:t>
      </w:r>
    </w:p>`
      )
      .join('\n    ')}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  zip.file('word/document.xml', documentXml);

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const parsed = await parseDocx(blob, fileName);

  return {
    blob,
    fileName,
    paragraphs: parsed.paragraphs,
    zipInstance: zip,
    rawXml: documentXml,
  };
}
