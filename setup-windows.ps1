# Claude Code 스킬 세팅 — Windows
# 실행: irm https://raw.githubusercontent.com/tpfkswogud0523/claude-skills-setup/main/setup-windows.ps1 | iex

Write-Host ""
Write-Host "=== Claude Code 스킬 세팅 (Windows) ==="

# ~/.claude/skills 디렉터리 생성
$skillsDir = "$HOME\.claude\skills"
if (-not (Test-Path $skillsDir)) {
    New-Item -ItemType Directory -Force $skillsDir | Out-Null
    Write-Host "[+] $skillsDir 생성됨"
}

# 1. caveman 스킬
Write-Host ""
Write-Host "[1/3] caveman 스킬 설치 중..."
$cavemanDir = "$skillsDir\caveman"
if (Test-Path $cavemanDir) {
    Write-Host "    이미 존재 — git pull 실행"
    git -C $cavemanDir pull --quiet
} else {
    git clone https://github.com/amanattar/caveman-claude-skill $cavemanDir
    Write-Host "    [완료] caveman -> $cavemanDir"
}

# 2. claude-video 의존성 (ffmpeg, yt-dlp)
Write-Host ""
Write-Host "[2/3] claude-video 의존성 설치 중..."
Write-Host "    ffmpeg 설치 (winget)..."
winget install -e --id FFmpeg.FFmpeg --accept-source-agreements --accept-package-agreements
if ($LASTEXITCODE -eq 0) {
    Write-Host "    [완료] ffmpeg"
} else {
    Write-Host "    [!] winget 실패. https://ffmpeg.org/download.html 에서 수동 설치하세요."
}

Write-Host "    yt-dlp 설치 (pip)..."
pip install --quiet yt-dlp
if ($LASTEXITCODE -eq 0) {
    Write-Host "    [완료] yt-dlp"
} else {
    Write-Host "    [!] pip 실패. Python이 설치되어 있는지 확인하세요."
}

# 3. claude-video 플러그인 안내
Write-Host ""
Write-Host "[3/3] claude-video 플러그인 등록 안내"
Write-Host "    Claude Code 세션 안에서 아래 두 줄을 입력하세요:"
Write-Host ""
Write-Host "        /plugin marketplace add bradautomates/claude-video"
Write-Host "        /plugin install watch@claude-video"
Write-Host ""

Write-Host "=== 세팅 완료 ==="
Write-Host "caveman 사용법   : Claude Code에서 'caveman mode' 입력"
Write-Host "claude-video    : 위 플러그인 등록 후 '/watch <URL>' 사용"
Write-Host "npx 도구        : 설치 불필요 — npx codeburn / npx impeccable 등 바로 실행"
Write-Host ""
