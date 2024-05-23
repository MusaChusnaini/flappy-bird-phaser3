@echo on

rem Mengubah direktori ke lokasi eksekusi
cd /d %~dp0

rem Menjalankan server HTTP di latar belakang
start /B python -m http.server

rem Mengambil alamat IP lokal dengan ipconfig
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "local_ip=%%a"
)

rem Menghapus spasi yang mungkin ada di sekitar alamat IP
set "local_ip=%local_ip: =%"

rem Menampilkan alamat IP lokal
echo Alamat IP lokal: %local_ip%
