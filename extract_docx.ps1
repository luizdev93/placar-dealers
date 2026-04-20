Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "c:\Luiz\Placar_Dealers\RV_Especificacao_Funcional.docx"
$outputPath = "c:\Luiz\Placar_Dealers\docx_text.txt"

$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlContent = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

$doc = [xml]$xmlContent
$mgr = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
$mgr.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

$paragraphs = $doc.SelectNodes("//w:p", $mgr)
$lines = @()
foreach ($para in $paragraphs) {
    $tNodes = $para.SelectNodes(".//w:t", $mgr)
    $text = ($tNodes | ForEach-Object { $_.InnerText }) -join ""
    if ($text.Trim() -ne "") {
        $lines += $text
    }
}

$lines -join "`n" | Out-File -FilePath $outputPath -Encoding UTF8
Write-Host "Extraido: $($lines.Count) paragrafos"
