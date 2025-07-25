#!/usr/bin/env python3
"""
云云星羽网络科技工作室 - 本地预览服务器
简单的HTTP服务器，用于本地预览静态网站
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)
    
    def end_headers(self):
        # 添加CORS头部
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def start_server(port=8080, directory=None):
    """启动本地预览服务器"""
    if directory:
        os.chdir(directory)
    
    handler = CustomHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 云云星羽网络科技工作室 - 本地预览服务器")
            print(f"📁 服务目录: {os.getcwd()}")
            print(f"🌐 预览地址: http://localhost:{port}")
            print(f"📱 移动端预览: http://你的IP地址:{port}")
            print(f"⏹️  按 Ctrl+C 停止服务器\n")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except OSError as e:
        if e.errno == 10048:  # Windows端口被占用
            print(f"❌ 端口 {port} 被占用，尝试端口 {port + 1}")
            start_server(port + 1, directory)
        else:
            print(f"❌ 启动服务器失败: {e}")

if __name__ == "__main__":
    # 检查命令行参数
    port = 8080
    directory = None
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "dist":
            directory = "dist"
            print("📦 预览构建版本")
        elif sys.argv[1].isdigit():
            port = int(sys.argv[1])
    
    if len(sys.argv) > 2 and sys.argv[2].isdigit():
        port = int(sys.argv[2])
    
    start_server(port, directory)