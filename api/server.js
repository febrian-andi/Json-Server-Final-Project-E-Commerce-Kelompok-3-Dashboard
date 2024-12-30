const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

const server = jsonServer.create()

// Membaca data dari db.json
const filePath = path.join(__dirname, '..', 'db.json')
const data = fs.readFileSync(filePath, "utf-8")
const db = JSON.parse(data)

// Menggunakan router dengan db yang sudah dibaca
const router = jsonServer.router(db)

const middlewares = jsonServer.defaults()

server.use(middlewares)

// Menambahkan middleware untuk menulis perubahan ke db.json setelah setiap operasi
server.use((req, res, next) => {
  const oldSend = res.send
  res.send = (body) => {
    // Jika body berisi data (misalnya, setelah POST/PUT/DELETE)
    if (body && body !== '[]') {
      // Mengupdate db.json dengan data terbaru
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2))
    }
    // Melanjutkan alur pengiriman respons
    oldSend.call(res, body)
  }
  next()
})

server.use(router)

// Menjalankan server pada port 3000
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Mengekspor API server jika diperlukan
module.exports = server
