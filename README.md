# Sweeps Hub | Educational & Compliance Guide for Social Casinos

Welcome to *Sweeps Hub*, an open-source, informational directory designed to educate users on the operational mechanics, legal compliance frameworks, and probability dynamics of promotional sweepstakes and social casinos.

## 🎯 Project Purpose & Mission

The objective of Sweeps Hub is to demystify promotional sweepstakes models and promote informed digital participation through transparency, technical analysis, and consumer education.

Unlike traditional real-money gambling platforms, social casinos operate under federal and state promotional sweepstakes laws. This repository serves as a reference implementation for building transparent referral directories, integrating first-party compliance telemetry, and auditing platform fairness.

## 📚 Key Educational Topics Covered

1. **Dual-Currency Mechanics:** Detailed breakdowns comparing non-negotiable *Gold Coins (GC)* used for free social play versus *Sweepstakes Coins (SC)* used in promotional sweepstakes modes.
2. **"No Purchase Necessary" (NPN) Protocols:** Step-by-step guides explaining legally mandated free entry methods, including mail-in request codes (AMOEs) and daily log-in bonuses.
3. **Probability & Return-to-Player (RTP):** Educational resources on understanding volatility, hit frequency, and house edges across sweepstakes titles.
4. **State-Level Regulatory Landscapes:** Clear regional eligibility mapping detailing restricted jurisdictions (e.g., Washington, Idaho, Michigan, Nevada).

## 📂 Educational Site Architecture

- **index.html**: Primary directory featuring verified social gaming platforms, live community review cards, and consent-driven tracking.
- **zula-review.html**: Dedicated platform review and analysis page for Zula Casino (2026 edition).
- **winbonanza-review.html**: Dedicated platform review page for Win Bonanza with integrated referral tracking.
- **free-entry-mechanics.html**: Comprehensive educational guide breaking down "No Purchase Necessary" (NPN) rules, mail-in sweepstakes requests (AMOEs), and daily coin claim schedules.
- **prize-redemption-rules.html**: Transparent analysis of Know Your Customer (KYC) identity verification, playthrough multipliers, redemption thresholds, and payout timelines.
- **legal-blueprint.html & compliance.html**: Regulatory frameworks detailing sweepstakes law definitions, age requirement benchmarks (18+/21+), and state-level restriction matrices.
- **sportzino-review.html**: Deep-dive platform audit evaluating brand legitimacy, game selection, sports prediction mechanics, and payout reliability.
- **admin.html**: Internal compliance queue for reviewing, verifying, and moderating user-submitted reviews prior to public publishing.
- **cookie-tracker.js**: Standalone, zero-third-party JavaScript module capturing explicit user cookie consent, device telemetry, and referral parameters locally.

## 🛠️ Technical Architecture

Sweeps Hub is engineered as a lightweight, privacy-focused web application built with modern web standards:
- **Frontend**: Responsive HTML5 / Tailwind CSS layout optimized for cross-device accessibility and screen readers.
- **Data & Moderation**: Integrated with Supabase for real-time user-generated review submissions and automated moderation queues.
- **Local Telemetry & Privacy**: Utilizes `cookie-tracker.js` to handle localStorage payload encryption and browser-level consent state management without third-party data tracking.
- **Analytics & Attribution**: Conditional Google Tag Manager (GTM) and GA4 integration executed strictly upon explicit user opt-in.
