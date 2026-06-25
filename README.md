# Claude Code 스킬 세팅

새 컴퓨터에서 Claude Code 스킬/툴을 빠르게 세팅하는 스크립트 모음.

## 빠른 시작

**Windows (PowerShell)**
```powershell
irm https://raw.githubusercontent.com/tpfkswogud0523/claude-skills-setup/main/setup-windows.ps1 | iex
```

**Mac / Linux**
```bash
curl -fsSL https://raw.githubusercontent.com/tpfkswogud0523/claude-skills-setup/main/setup-mac.sh | bash
```

---

## 포함된 항목

| 도구 | 방식 | 설명 |
|------|------|------|
| **caveman** | SKILL.md → `~/.claude/skills/` | 응답 토큰 75% 절감, `caveman mode`로 켜기 |
| **claude-video** | Claude Code 플러그인 | 영상 URL/파일을 `/watch`로 분석 |
| codeburn | npx (설치 불필요) | `npx codeburn` — 토큰·비용 추적 |
| impeccable | npx (설치 불필요) | `npx impeccable install` — UI 디자인 점검 |
| designlang | npx (설치 불필요) | `npx designlang <url>` — 사이트 디자인 추출 |
| graphify | uv/pip 패키지 | 코드베이스 지식 그래프 생성 |

---

## claude-video 상세 안내 (가장 중요)

### 설치 2단계

**1단계: 의존성 설치 (터미널)**

```powershell
# Windows
winget install -e --id FFmpeg.FFmpeg
pip install yt-dlp
```

```bash
# Mac
brew install ffmpeg yt-dlp
```

> 이 두 개가 있어야 영상 다운로드 + 프레임 추출이 됩니다.

**2단계: Claude Code 플러그인 등록 (Claude Code 세션 안에서 입력)**

```
/plugin marketplace add bradautomates/claude-video
/plugin install watch@claude-video
```

> 새 컴퓨터마다 이 두 명령을 Claude Code 안에서 한 번 실행하면 됩니다.

### 사용법

```
/watch https://youtu.be/XXXXXX 30초 구간에 무슨 일이 일어나?
/watch 영상.mp4 요약해줘
/watch https://youtu.be/XXXXXX --start 1:00 --end 2:00
```

### Whisper API 키 (선택사항)

유튜브 자막이 없는 영상(TikTok, 로컬 파일 등)은 Whisper로 음성을 추출합니다.
- Groq API 키 (무료·빠름): https://console.groq.com/keys
- `~/.config/watch/.env` 파일에 `GROQ_API_KEY=your-key` 추가
- 자막 있는 유튜브는 키 없이도 무료로 작동

---

## 출처

- caveman: https://github.com/amanattar/caveman-claude-skill
- claude-video: https://github.com/bradautomates/claude-video
- codeburn: https://github.com/getagentseal/codeburn
- impeccable: https://github.com/pbakaus/impeccable
- design-extract: https://github.com/Manavarya09/design-extract
- graphify: https://github.com/safishamsi/graphify
