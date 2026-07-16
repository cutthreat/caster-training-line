$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw -Encoding UTF8
$css = Get-Content -LiteralPath (Join-Path $root 'styles.css') -Raw -Encoding UTF8
$js = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw -Encoding UTF8

$checks = [ordered]@{
  'Один H1' = ([regex]::Matches($html, '<h1\b').Count -eq 1)
  'Два локальных видео' = ($html -match 'assets/ocean-impact\.web\.mp4' -and $html -match 'assets/starship-launch\.webm')
  'Видео muted playsinline' = ([regex]::Matches($html, '<video[^>]+muted[^>]+playsinline').Count -eq 2)
  'Есть постеры' = ($html -match 'ocean-poster\.svg' -and $html -match 'rocket-poster\.svg')
  'Регистрация одна' = ([regex]::Matches($html, 'auth\?mode=register').Count -eq 1)
  'Реальные маршруты' = ($html -match 'vibeus\.app/projects' -and $html -match 'vibeus\.app/discussions' -and $html -match 'vibeus\.app/ai-tools')
  'Reduced motion' = ($css -match 'prefers-reduced-motion' -and $js -match 'prefers-reduced-motion')
  'События удара' = ($js -match 'triggerImpact' -and $html -match 'data-impact-stage')
  'Океан загружен' = ((Get-Item -LiteralPath (Join-Path $root 'assets/ocean-impact.web.mp4') -ErrorAction SilentlyContinue).Length -gt 100000)
  'Океан оптимизирован' = ((Get-Item -LiteralPath (Join-Path $root 'assets/ocean-impact.web.mp4') -ErrorAction SilentlyContinue).Length -lt 10000000)
  'Starship загружен' = ((Get-Item -LiteralPath (Join-Path $root 'assets/starship-launch.webm') -ErrorAction SilentlyContinue).Length -gt 100000)
  'Атрибуция присутствует' = ($html -match 'Ali Soheil / Pexels' -and $html -match 'janos / CC BY 3.0')
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
$checks.GetEnumerator() | ForEach-Object { '{0} {1}' -f $(if ($_.Value) {'PASS'} else {'FAIL'}), $_.Key }
if ($failed.Count) { exit 1 }
