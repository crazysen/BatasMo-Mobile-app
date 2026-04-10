Set-Location "c:\Users\Jensen Manalo\Downloads\BatasMo Mobile Apps\BatasMo Mobile App\MyApp"

$files = Get-ChildItem -Path "BatasMoApp/screens" -Recurse -File |
  Select-String -Pattern "SafeAreaView" |
  Select-Object -ExpandProperty Path |
  Sort-Object -Unique

$changed = 0

foreach ($file in $files) {
  $content = Get-Content -Raw -Path $file
  $original = $content

  $content = $content -replace "SafeAreaView\s*,\s*", ""
  $content = $content -replace ",\s*SafeAreaView", ""

  if ($content -match "\bSafeAreaView\b" -and $content -notmatch "react-native-safe-area-context") {
    $content = $content -replace "from 'react-native';", "from 'react-native';`r`nimport { SafeAreaView } from 'react-native-safe-area-context';"
  }

  if ($content -ne $original) {
    Set-Content -Path $file -Value $content
    $changed++
  }
}

Write-Output "Updated files: $changed"
