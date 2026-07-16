$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw -Encoding UTF8
$css = Get-Content -LiteralPath (Join-Path $root 'styles.css') -Raw -Encoding UTF8
$js = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw -Encoding UTF8
$visible = [regex]::Replace($html, '<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>', ' ')

$checks = [ordered]@{
  'Один H1' = ([regex]::Matches($html, '<h1\b').Count -eq 1)
  'Нет em dash и en dash' = ($visible -notmatch '[—–]')
  'Hero использует 100dvh' = ($css -match '100dvh' -and $css -notmatch 'h-screen')
  'Hero содержит четыре элемента' = ([regex]::Matches(([regex]::Match($html, '<div class="hero-copy">([\s\S]*?)</div>\s*</div>?\s*<figure').Groups[1].Value), '<p|<h1|<div class="hero-actions"').Count -eq 4)
  'Одна eyebrow' = ([regex]::Matches($html, 'class="eyebrow"').Count -eq 1)
  'Локальный Geist' = ($css -match 'Geist-Variable\.woff2' -and $html -notmatch 'fonts\.googleapis')
  'Три реальные фотографии' = ([regex]::Matches($html, 'assets/(hero-handoff|collective-work|solution-fit)\.webp').Count -ge 6)
  'Изображения существуют' = (@('hero-handoff.webp','collective-work.webp','solution-fit.webp') | ForEach-Object { (Get-Item -LiteralPath (Join-Path $root "assets\$_") -ErrorAction SilentlyContinue).Length -gt 50000 }) -notcontains $false
  'Один UI accent token' = ($css -match '--accent:#' -and [regex]::Matches($css, '--accent:#').Count -eq 2)
  'Острые формы' = ($css -match '--radius:0px')
  'Light и dark tokens' = ($css -match 'prefers-color-scheme:dark')
  'Reduced motion' = ($css -match 'prefers-reduced-motion:reduce' -and $js -match 'prefers-reduced-motion: reduce')
  'Без scroll listener' = ($js -notmatch [regex]::Escape("addEventListener('scroll") -and $js -notmatch [regex]::Escape('addEventListener("scroll'))
  'IntersectionObserver' = ($js -match 'IntersectionObserver')
  'Empty loading success error' = ($html -match 'result-empty' -and $html -match 'result-loading' -and $html -match 'result-success' -and $html -match 'result-error')
  'Реальные маршруты' = ($html -match 'vibeus\.app/projects' -and $html -match 'vibeus\.app/discussions' -and $html -match 'vibeus\.app/ai-tools')
  'Нет scroll cue' = ($visible -notmatch '(?i)scroll|листайте|прокрут')
  'Нет section numbering' = ($visible -notmatch '\b0[0-9]\s*[/·]')
  'Мобильный collapse' = ($css -match '@media\(max-width:900px\)' -and $css -match 'grid-template-columns:1fr')
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
$checks.GetEnumerator() | ForEach-Object { '{0} {1}' -f $(if ($_.Value) {'PASS'} else {'FAIL'}), $_.Key }
if ($failed.Count) { exit 1 }
