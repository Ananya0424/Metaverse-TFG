# V-Guard Voice AI Assistant — Pricing Proposal

**Prepared for:** V-Guard Industries  
**Date:** April 2026  
**Prepared by:** Development Team

---

## Assumptions

| Parameter | Value |
|---|---|
| Users per day | 100 / 500 / 1,000 |
| Conversations per user/day | 10 voice exchanges per session |
| Avg audio input per exchange | ~8 seconds |
| Avg TTS response per exchange | ~200 characters |
| Avg LLM tokens per exchange | ~500 input + 300 output |
| Total chars TTS per session | 2,000 chars (10 × 200) |
| Total audio per session | ~80 seconds (10 × 8s) |

---

## Our Custom Stack — 3 Tier Options

### Technology Per Tier

| Component | Option A — Economy | Option B — Balanced | Option C — Premium |
|---|---|---|---|
| **STT** | Groq Whisper Turbo | Groq Whisper v3 | Groq Whisper v3 |
| **LLM** | Gemini 2.0 Flash | Gemini 2.0 Flash | Gemini 2.0 Flash |
| **TTS** | Google Standard | Google Neural2 | Google Chirp3-HD |
| **Vector DB** | Pinecone (free) | Pinecone (free) | Pinecone (free) |
| **Voice Quality** | ★★☆☆☆ | ★★★★☆ | ★★★★★ |
| **Tamil Accuracy** | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| **Response Speed** | Fastest | Fast | Fast |

### Quality Notes

| Tier | STT | LLM | TTS |
|---|---|---|---|
| **Economy** | Good Tamil, slightly less accurate on mixed speech | Best for Tamil — Google trained | Robotic monotone. OK for English, poor for Tamil intonation |
| **Balanced** | Best Tamil+English mixed accuracy, prompt-biased | Same | Natural, smooth Tamil. Good intonation. Recommended minimum |
| **Premium** | Same | Same | Studio-quality Tamil. Regional accent support. HD audio. Best user experience |

---

## API Pricing Rates Used

| Service | Model | Rate | Notes |
|---|---|---|---|
| STT | Groq Whisper v3 | $0.0002/min | Free up to ~2,000 req/day |
| STT | Groq Whisper Turbo | $0.0001/min | Free up to ~2,000 req/day |
| LLM | Gemini 2.0 Flash | $0.075/1M in · $0.30/1M out | **Free 1,500 req/day** |
| LLM | Groq Llama 3.3 70B | $0.59/1M in · $0.79/1M out | Free up to rate limits |
| LLM | Groq Llama 3.1 8B | $0.05/1M in · $0.08/1M out | Free, fastest |
| TTS | Google Standard | $4 / 1M chars | Robotic quality |
| TTS | Google Neural2 | $16 / 1M chars | Natural quality |
| TTS | Google Chirp3-HD | $30 / 1M chars | Premium HD quality |
| Vector DB | Pinecone | $0 | Free ≤ 100K vectors, 2M ops/month |

---

## Cost Per Conversation (Single Session)

| Cost Item | Economy | Balanced | Premium |
|---|---|---|---|
| STT (80s audio) | $0.00013 | $0.00027 | $0.00027 |
| LLM (10 queries, paid rate) | $0.00128 | $0.00128 | $0.00128 |
| TTS (2,000 chars) | $0.00800 | $0.03200 | $0.06000 |
| **Total (paid rate)** | **$0.0094** | **$0.0336** | **$0.0616** |
| **Total (within free tier)** | **~$0.008** | **~$0.032** | **~$0.060** |

> **Key insight:** TTS is 85–98% of the total cost. LLM and STT are nearly free.

---

## 100 Users/Day (1,000 sessions/day · 30,000/month)

> Free tier fully covers STT + LLM at this scale (1,000 req/day < Gemini 1,500/day limit)

### API Costs

| Service | Economy | Balanced | Premium |
|---|---|---|---|
| STT | $0 (free tier) | $0 (free tier) | $0 (free tier) |
| LLM (Gemini) | $0 (free tier) | $0 (free tier) | $0 (free tier) |
| TTS /month | **$24** | **$96** | **$180** |
| Vector DB | $0 | $0 | $0 |
| **API Total/month** | **$24** | **$96** | **$180** |

### Server Hosting

| Provider | Spec | Cost/month |
|---|---|---|
| DigitalOcean / Linode | 2 vCPU · 4 GB RAM | $18 |
| Railway / Render | Starter Plan | $20 |
| AWS EC2 t3.small | 2 vCPU · 2 GB | $15 |

### Total Monthly (100 users/day)

| | Economy | Balanced | Premium |
|---|---|---|---|
| API costs | $24 | $96 | $180 |
| Server | $18 | $18 | $18 |
| **Grand Total** | **$42/month** | **$114/month** | **$198/month** |
| **Per session** | **$0.0014** | **$0.0038** | **$0.0066** |

---

## 500 Users/Day (5,000 sessions/day · 150,000/month)

> Gemini free: 1,500/day. Paid for remaining 3,500/day.

### API Costs

| Service | Economy | Balanced | Premium |
|---|---|---|---|
| STT /month | $4 | $8 | $8 |
| LLM (Gemini, ~3,500 paid/day) /month | $13 | $13 | $13 |
| TTS /month | **$120** | **$480** | **$900** |
| Vector DB | $0 | $0 | $0 |
| **API Total/month** | **$137** | **$501** | **$921** |

### Server Hosting

| Provider | Spec | Cost/month |
|---|---|---|
| DigitalOcean / Linode | 4 vCPU · 8 GB RAM | $48 |
| AWS EC2 t3.large | 2 vCPU · 8 GB | $60 |
| GCP e2-standard-2 | 2 vCPU · 8 GB | $49 |

### Total Monthly (500 users/day)

| | Economy | Balanced | Premium |
|---|---|---|---|
| API costs | $137 | $501 | $921 |
| Server | $48 | $48 | $48 |
| **Grand Total** | **$185/month** | **$549/month** | **$969/month** |
| **Per session** | **$0.0012** | **$0.0037** | **$0.0065** |

---

## 1,000 Users/Day (10,000 sessions/day · 300,000/month)

> Gemini paid for 8,500 sessions/day.

### API Costs

| Service | Economy | Balanced | Premium |
|---|---|---|---|
| STT /month | $8 | $16 | $16 |
| LLM (Gemini, ~8,500 paid/day) /month | $33 | $33 | $33 |
| TTS /month | **$240** | **$960** | **$1,800** |
| Vector DB | $70 (Standard plan) | $70 | $70 |
| **API Total/month** | **$351** | **$1,079** | **$1,919** |

### Server Hosting

| Provider | Spec | Cost/month |
|---|---|---|
| DigitalOcean / Linode | 8 vCPU · 16 GB RAM | $96 |
| AWS EC2 c5.xlarge | 4 vCPU · 8 GB | $124 |
| GCP n2-standard-4 | 4 vCPU · 16 GB | $118 |

### Total Monthly (1,000 users/day)

| | Economy | Balanced | Premium |
|---|---|---|---|
| API costs | $351 | $1,079 | $1,919 |
| Server | $96 | $96 | $96 |
| **Grand Total** | **$447/month** | **$1,175/month** | **$2,015/month** |
| **Per session** | **$0.0015** | **$0.0039** | **$0.0067** |

---

## ConvAI Comparison

ConvAI (convai.com) and similar platforms (Vapi.ai, Retell.ai, Play.ai) charge per **minute of voice conversation**.

| Platform | Rate | Avg 10-exchange session (~2.5 min) | Notes |
|---|---|---|---|
| Vapi.ai | $0.05/min | ~$0.125/session | Most popular, good integrations |
| Retell.ai | $0.07/min | ~$0.175/session | Good quality |
| Play.ai | $0.08/min | ~$0.200/session | Premium voices |
| ConvAI.com | $0.10/min | ~$0.250/session | Bundled platform |

### ConvAI Monthly Cost Comparison

| Scale | ConvAI (~$0.05/min) | Our Option A | Our Option B | Our Option C |
|---|---|---|---|---|
| **100 users/day** | $375/month | $42/month | $114/month | $198/month |
| **500 users/day** | $1,875/month | $185/month | $549/month | $969/month |
| **1,000 users/day** | $3,750/month | $447/month | $1,175/month | $2,015/month |

### Cost Savings vs ConvAI (per month)

| Scale | Option A saves | Option B saves | Option C saves |
|---|---|---|---|
| 100 users/day | **$333 (89% cheaper)** | $261 (70% cheaper) | $177 (47% cheaper) |
| 500 users/day | **$1,690 (90% cheaper)** | $1,326 (71% cheaper) | $906 (48% cheaper) |
| 1,000 users/day | **$3,303 (88% cheaper)** | $2,575 (69% cheaper) | $1,735 (46% cheaper) |

### What ConvAI Includes vs Our Stack

| Feature | ConvAI | Our Stack |
|---|---|---|
| Voice AI pipeline | ✅ Bundled | ✅ Custom-built |
| Tamil language support | ⚠️ Limited/basic | ✅ Full (Chirp3-HD, Whisper v3) |
| 3D avatar | ❌ No | ✅ Yes (ReadyPlayerMe) |
| Custom V-Guard knowledge base | ❌ No (extra cost) | ✅ Pinecone RAG built-in |
| Branding / white-label | ❌ ConvAI branding | ✅ Full custom V-Guard UI |
| Model flexibility | ⚠️ Platform-locked | ✅ Switch any model anytime |
| Data privacy | ❌ Data leaves to ConvAI | ✅ Only to Google/Groq APIs |
| One-time dev cost | ❌ None (SaaS only) | ✅ Already built |

---

## Summary Recommendation Table

| Scale | Recommended Tier | Monthly Cost | Per Session | Quality |
|---|---|---|---|---|
| **100 users/day** | **Option B — Balanced** | **$114/month** | **$0.0038** | ★★★★☆ |
| **500 users/day** | **Option A — Economy** | **$185/month** | **$0.0012** | ★★☆☆☆ |
| **500 users/day** | **Option B — Balanced** | **$549/month** | **$0.0037** | ★★★★☆ |
| **1,000 users/day** | **Option A — Economy** | **$447/month** | **$0.0015** | ★★☆☆☆ |
| **1,000 users/day** | **Option B — Balanced** | **$1,175/month** | **$0.0039** | ★★★★☆ |

---

## Cost Reduction Strategies

### Strategy 1 — Switch TTS to Neural2 (saves ~75%)
- From Chirp3-HD ($30/1M) → Neural2 ($16/1M)
- 1,000 users/day: saves **$840/month**
- Quality loss: minimal — still natural Tamil

### Strategy 2 — Cache Common Responses (saves ~20-40%)
- Store TTS audio for top 50 most-asked questions
- Re-serve cached MP3 instead of regenerating
- No TTS cost for cached hits
- Implementation: Redis or simple file cache

### Strategy 3 — Text-only mode option (saves ~90% on TTS)
- Give users option to read answer instead of listen
- Mobile / slow connection users prefer this anyway
- TTS only when user explicitly plays audio

### Strategy 4 — Use Llama 8B for simple queries (saves ~70% LLM)
- Detect query complexity on frontend
- Simple product-spec questions → Llama 3.1 8B (free, fast)
- Complex multi-product comparisons → Gemini Flash

---

## Infrastructure Recommendation by Scale

| Scale | Hosting | DB | CDN | Monthly |
|---|---|---|---|---|
| ≤ 100 users/day | DigitalOcean 2vCPU/4GB | Pinecone free | None needed | $18 |
| 100–500 users/day | DigitalOcean 4vCPU/8GB | Pinecone free | Cloudflare free | $48 |
| 500–1,000 users/day | DigitalOcean 8vCPU/16GB | Pinecone Standard $70 | Cloudflare free | $166 |
| 1,000–5,000 users/day | Load-balanced 2× 4vCPU + nginx | Pinecone Standard | Cloudflare Pro $20 | $300–400 |

---

## Final Comparison at a Glance

```
Cost per conversation session (10 voice exchanges):

Our Stack — Economy :  $0.001 ─────────────────────────────── 
Our Stack — Balanced:  $0.004 ──────────────────────────────────────────
Our Stack — Premium :  $0.007 ────────────────────────────────────────────────────
ConvAI / Vapi.ai    :  $0.125 ████████████████████████████████████████████████████████████████
```

**Bottom line:** Our custom stack is **18x–90x cheaper** than ConvAI depending on tier, while delivering superior Tamil language quality, a custom 3D avatar experience, and full white-label V-Guard branding.

---

*All pricing based on publicly available API rates as of April 2026. Actual costs may vary with usage patterns. Free tier limits subject to change by API providers.*
