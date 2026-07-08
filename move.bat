@echo off
mkdir "src\app\admin\(authenticated)"
move "src\app\admin\customers" "src\app\admin\(authenticated)\"
move "src\app\admin\hr" "src\app\admin\(authenticated)\"
move "src\app\admin\inventory" "src\app\admin\(authenticated)\"
move "src\app\admin\payments" "src\app\admin\(authenticated)\"
move "src\app\admin\workflow" "src\app\admin\(authenticated)\"
move "src\app\admin\page.tsx" "src\app\admin\(authenticated)\"
move "src\app\admin\layout.tsx" "src\app\admin\(authenticated)\"
