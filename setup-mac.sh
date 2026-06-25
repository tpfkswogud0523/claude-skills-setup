#!/usr/bin/env bash
# Claude Code 스킬 세팅 — Mac / Linux
# 실행: curl -fsSL https://raw.githubusercontent.com/tpfkswogud0523/claude-skills-setup/main/setup-mac.sh | bash

set -e
echo ""
echo "=== Claude Code 스킬 세팅 (Mac/Linux) ==="

SKILLS_DIR="$HOME/.claude/skills"
mkdir -p "$SKILLS_DIR"

# 1. caveman
echo ""
echo "[1/3] caveman 스킬 설치 중..."
if [ -d "$SKILLS_DIR/caveman" ]; then
    echo "    이미 존재 — git pull 실행"
    git -C "$SKILLS_DIR/caveman" pull --quiet
else
    git clone https://github.com/amanattar/caveman-claude-skill "$SKILLS_DIR/caveman"
    echo "    [완료] caveman -> $SKILLS_DIR/caveman"
fi

# 2. claude-video 의존성
echo ""
echo "[2/3] claude-video 의존성 설치 중..."
if command -v brew &>/dev/null; then
    brew install ffmpeg yt-dlp
    echo "    [완료] ffmpeg, yt-dlp (brew)"
elif command -v apt-get &>/dev/null; then
    sudo apt-get install -y ffmpeg
    pip install yt-dlp
    echo "    [완료] ffmpeg (apt), yt-dlp (pip)"
elif command -v dnf &>/dev/null; then
    sudo dnf install -y ffmpeg
    pip install yt-dlp
    echo "    [완료] ffmpeg (dnf), yt-dlp (pip)"
else
    echo "    [!] 패키지 매니저를 찾지 못했습니다. ffmpeg와 yt-dlp를 수동 설치하세요."
fi

# 3. claude-video 플러그인 안내
echo ""
echo "[3/3] claude-video 플러그인 등록 안내"
echo "    Claude Code 세션 안에서 아래 두 줄을 입력하세요:"
echo ""
echo "        /plugin marketplace add bradautomates/claude-video"
echo "        /plugin install watch@claude-video"
echo ""

echo "=== 세팅 완료 ==="
echo "caveman 사용법   : Claude Code에서 'caveman mode' 입력"
echo "claude-video    : 위 플러그인 등록 후 '/watch <URL>' 사용"
echo "npx 도구        : 설치 불필요 — npx codeburn / npx impeccable 등 바로 실행"
echo ""
