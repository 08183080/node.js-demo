/**
 * node.js demo by chatgpt.
 */

// 引入 http 模块
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;

  // 发送响应内容
  res.end('Hello, World!\n');
});

// 监听端口 3000
server.listen(3000, 'localhost', () => {
  console.log('Server running at http://localhost:3000/');
});