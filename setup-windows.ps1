# Claude Code 스킬 세팅 — Windows
# 실행: irm https://raw.githubusercontent.com/tpfkswogud0523/claude-skills-setup/main/setup-windows.ps1 | iex

Write-Host ""
Write-Host "=== Claude Code 스킬 세팅 (Windows) ==="

$skillsDir = "$HOME\.claude\skills"
if (-not (Test-Path $skillsDir)) {
    New-Item -ItemType Directory -Force $skillsDir | Out-Null
    Write-Host "[+] $skillsDir 생성됨"
}

# 1. caveman
Write-Host ""
Write-Host "[1/4] caveman 스킬 설치 중..."
$cavemanDir = "$skillsDir\caveman"
if (Test-Path $cavemanDir) {
    Write-Host "    이미 존재 — git pull 실행"
    git -C $cavemanDir pull --quiet
} else {
    git clone https://github.com/amanattar/caveman-claude-skill $cavemanDir
    Write-Host "    [완료] $cavemanDir"
}

# 2. claude-video 스킬
Write-Host ""
Write-Host "[2/4] claude-video 스킬 설치 중..."
$watchDir = "$skillsDir\watch"
if (Test-Path $watchDir) {
    Write-Host "    이미 존재 — git pull 실행"
    git -C $watchDir pull --quiet
} else {
    git clone https://github.com/bradautomates/claude-video $watchDir
    Write-Host "    [완료] $watchDir"
}

# 3. claude-video 의존성 (ffmpeg, yt-dlp)
Write-Host ""
Write-Host "[3/4] claude-video 의존성 설치 중..."
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

# 4. 완료
Write-Host ""
Write-Host "[4/4] 완료"
Write-Host ""
Write-Host "=== 세팅 완료 ==="
Write-Host "caveman     : Claude Code에서 'caveman mode' 입력"
Write-Host "claude-video: '이 주제 유튜브 영상 3개 찾아서 요약해줘' 처럼 자연어로 요청"
Write-Host "npx 도구    : 설치 불필요 — npx codeburn / npx impeccable 등 바로 실행"
Write-Host ""
