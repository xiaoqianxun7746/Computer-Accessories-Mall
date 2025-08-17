@echo off
echo ========================================
echo    电脑配件商城 - 项目启动脚本
echo ========================================
echo.

echo 正在检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到 Node.js，请先安装 Node.js 16.0+
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js 已安装
echo.

echo 正在检查项目依赖...
if not exist "node_modules" (
    echo 正在安装项目依赖...
    npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    echo 依赖安装完成
) else (
    echo 项目依赖已存在
)

echo.
echo 正在启动后端 API 服务器...
start "API Server" cmd /k "echo 后端 API 服务器 && echo 访问地址: http://localhost:3001 && echo. && node api-server.js"

echo.
echo 等待后端服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo 正在启动前端开发服务器...
start "Frontend Dev Server" cmd /k "echo 前端开发服务器 && echo 访问地址: http://localhost:3000 && echo. && npm run dev"

echo.
echo ========================================
echo 项目启动完成！
echo.
echo 前端地址: http://localhost:3000
echo API地址:  http://localhost:3001
echo.
echo 提示：
echo    - 两个窗口都需要保持运行
echo    - 按 Ctrl+C 可以停止服务器
echo    - 修改代码会自动热更新
echo ========================================
echo.

echo 正在打开浏览器...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo 按任意键退出此窗口...
pause >nul