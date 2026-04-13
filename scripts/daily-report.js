#!/usr/bin/env node
/**
 * 서진 일일 업무 보고 발송 스크립트
 * 사용법: node scripts/daily-report.js
 * 필요 환경변수: GMAIL_USER, GMAIL_APP_PASSWORD (또는 RESEND_API_KEY)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECIPIENT = 'nokira1024@gmail.com';
const TODAY = new Date().toISOString().slice(0, 10);
const REPORT_PATH = path.join(__dirname, '..', 'reports', `${TODAY}.md`);

// 보고서 파일 읽기
function loadReport() {
    if (!fs.existsSync(REPORT_PATH)) {
        console.error(`❌ 보고서 파일 없음: ${REPORT_PATH}`);
        console.error('먼저 보고서를 작성하세요: reports/YYYY-MM-DD.md');
        process.exit(1);
    }
    return fs.readFileSync(REPORT_PATH, 'utf-8');
}

// Markdown → 간단한 HTML 변환
function mdToHtml(md) {
    return md
        .replace(/^### (.+)$/gm, '<h3 style="color:#1e3a5f;margin-top:20px">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 style="color:#1a2e44;border-bottom:2px solid #e5e7eb;padding-bottom:6px;margin-top:28px">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 style="color:#0f172a;font-size:22px">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
        .replace(/^✅ (.+)$/gm, '<li style="color:#16a34a;margin:4px 0">✅ $1</li>')
        .replace(/^⚠️ (.+)$/gm, '<li style="color:#d97706;margin:4px 0">⚠️ $1</li>')
        .replace(/^🔴 (.+)$/gm, '<li style="color:#dc2626;margin:4px 0">🔴 $1</li>')
        .replace(/\n/g, '<br>')
        .replace(/---/g, '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">');
}

// curl + Gmail SMTP (앱 비밀번호 방식)
async function sendViaCurl(subject, htmlBody) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        console.error('❌ 환경변수 누락: GMAIL_USER, GMAIL_APP_PASSWORD 필요');
        console.error('설정 방법: export GMAIL_USER=your@gmail.com && export GMAIL_APP_PASSWORD=xxxx');
        process.exit(1);
    }

    // Resend API로 발송 (더 간단)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
        return sendViaResend(subject, htmlBody, resendKey);
    }

    // Gmail SMTP via curl
    const emailContent = [
        `From: 서진 <${user}>`,
        `To: 여보짱 <${RECIPIENT}>`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        htmlBody
    ].join('\r\n');

    const tmpFile = `/tmp/email_${Date.now()}.txt`;
    fs.writeFileSync(tmpFile, emailContent);

    const { execSync } = await import('child_process');
    try {
        execSync(`curl --ssl-reqd \
            --url "smtps://smtp.gmail.com:465" \
            --user "${user}:${pass}" \
            --mail-from "${user}" \
            --mail-rcpt "${RECIPIENT}" \
            --upload-file "${tmpFile}" \
            --silent`, { stdio: 'pipe' });
        fs.unlinkSync(tmpFile);
        console.log(`✅ 이메일 발송 완료: ${RECIPIENT}`);
    } catch (e) {
        fs.unlinkSync(tmpFile);
        throw new Error(`이메일 발송 실패: ${e.message}`);
    }
}

async function sendViaResend(subject, htmlBody, apiKey) {
    const { execSync } = await import('child_process');
    const payload = JSON.stringify({
        from: '서진 <onboarding@resend.dev>',
        to: [RECIPIENT],
        subject,
        html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto;padding:24px">${htmlBody}</div>`
    });

    const tmpFile = `/tmp/resend_${Date.now()}.json`;
    fs.writeFileSync(tmpFile, payload);

    try {
        const result = execSync(`curl -s -X POST https://api.resend.com/emails \
            -H "Authorization: Bearer ${apiKey}" \
            -H "Content-Type: application/json" \
            -d @${tmpFile}`, { stdio: 'pipe' }).toString();
        fs.unlinkSync(tmpFile);
        const res = JSON.parse(result);
        if (res.id) {
            console.log(`✅ Resend 발송 완료 (id: ${res.id}): ${RECIPIENT}`);
        } else {
            throw new Error(JSON.stringify(res));
        }
    } catch (e) {
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
        throw new Error(`Resend 발송 실패: ${e.message}`);
    }
}

// 메인 실행
const reportMd = loadReport();
const subject = `[서진 보고] ${TODAY} 목회자유형앱 일일 업무 보고`;
const htmlBody = mdToHtml(reportMd);

console.log(`📧 보고서 발송 중: ${TODAY}`);
sendViaCurl(subject, htmlBody).catch(e => {
    console.error(e.message);
    process.exit(1);
});
