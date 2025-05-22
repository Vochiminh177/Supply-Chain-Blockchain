// "use server"

import mysql from "mysql2/promise"
import { createHash } from "crypto"

// Tạo pool connection để tái sử dụng
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '17723',
  database: process.env.MYSQL_DATABASE || '',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export { pool };

// Hàm thực thi truy vấn
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

// Hàm lấy danh sách đơn hàng
export async function getOrders() {
  const query = `
    SELECT * FROM orders 
    ORDER BY created_at DESC
  `
  return executeQuery(query)
}

// Hàm lấy chi tiết đơn hàng
export async function getOrderById(orderId: number) {
  const query = `
    SELECT * FROM orders 
    WHERE order_id = ?
  `
  const result = await executeQuery(query, [orderId]) as Array<Record<string, any>>;
  return result?.[0] || null;
}

// Hàm lấy danh sách đơn hàng người dùng được xác thực
export async function getOrderByStep(step: string) {
  const query = `
    SELECT o.*, u.username, u.full_name 
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    WHERE o.status = ?
    ORDER BY o.created_at DESC
  `
  return executeQuery(query, [step])
}
// Hàm lấy danh sách đơn hàng của người dùng

// Hàm tạo đơn hàng mới
export async function createOrder(productName: string, origin: string, destination: string) {
  const query = `
    INSERT INTO orders (product_name, origin, destination, status) 
    VALUES (?, ?, ?, 'Khởi tạo')
  `
  const result = (await executeQuery(query, [productName, origin, destination])) as any
  return result.insertId
}

// Hàm lấy danh sách giao dịch của đơn hàng
export async function getTransactionsByOrderId(orderId: number) {
  const query = `
    SELECT t.*, u.username, u.full_name 
    FROM transactions t
    JOIN users u ON t.user_id = u.user_id
    WHERE t.order_id = ?
    ORDER BY t.timestamp ASC
  `
  return executeQuery(query, [orderId])
}

// Hàm tạo giao dịch mới
export async function createTransaction(orderId: number, step: string, location: string, userId: number, note: string) {
  const query = `
    INSERT INTO transactions (order_id, step, location, user_id, note) 
    VALUES (?, ?, ?, ?, ?)
  `
  const result = (await executeQuery(query, [orderId, step, location, userId, note])) as any

  // Cập nhật trạng thái đơn hàng
  await executeQuery(`UPDATE orders SET status = ? WHERE order_id = ?`, [step, orderId])

  return result.insertId
}

// Hàm lấy block cuối cùng
export async function getLastBlock() {
  const query = `
    SELECT * FROM blocks 
    ORDER BY block_id DESC 
    LIMIT 1
  `
  const result = await executeQuery(query) as Array<Record<string, any>>;
  return result[0] || null
}

// Hàm tạo block mới
export async function createBlock(txId: number, previousHash: string, hash: string, verifiedBy: number) {
  const query = `
    INSERT INTO blocks (tx_id, previous_hash, hash, verified_by) 
    VALUES (?, ?, ?, ?)
  `
  const result = (await executeQuery(query, [txId, previousHash, hash, verifiedBy])) as any
  return result.insertId
}

// Hàm lấy danh sách block của đơn hàng
export async function getBlocksByOrderId(orderId: number) {
  const query = `
    SELECT b.*, t.step, t.location, t.note, u.username, u.full_name 
    FROM blocks b
    JOIN transactions t ON b.tx_id = t.tx_id
    JOIN users u ON b.verified_by = u.user_id
    WHERE t.order_id = ?
    ORDER BY b.block_id ASC
  `
  return executeQuery(query, [orderId])
}

export async function getAllBlocks() {
  const query = `
    SELECT b.*, t.step, t.location, t.note, u.username, u.full_name
    FROM blocks b
    JOIN transactions t ON b.tx_id = t.tx_id
    JOIN users u ON b.verified_by = u.user_id
    ORDER BY b.block_id ASC
  `
  return executeQuery(query)
}

// Hàm lấy danh sách người dùng
export async function getUsers() {
  const query = `
    SELECT user_id, username, full_name, role, authorized_steps, created_at 
    FROM users
  `
  return executeQuery(query)
}

// Hàm tạo người dùng mới
export async function createUser(
  username: string,
  fullName: string,
  password: string,
  role: string,
  authorizedSteps: string,
) {
  const hashedPassword = createHash("sha256").update(password).digest("hex")

  const query = `
    INSERT INTO users (username, full_name, password_hash, role, authorized_steps) 
    VALUES (?, ?, ?, ?, ?)
  `
  const result = (await executeQuery(query, [username, fullName, hashedPassword, role, authorizedSteps])) as any
  return result.insertId
}

// Hàm cập nhật người dùng
export async function updateUser(userId: number, fullName: string, role: string, authorizedSteps: string) {
  const query = `
    UPDATE users 
    SET full_name = ?, role = ?, authorized_steps = ? 
    WHERE user_id = ?
  `
  await executeQuery(query, [fullName, role, authorizedSteps, userId])
  return true
}

// Hàm đặt lại mật khẩu
export async function resetPassword(userId: number, newPassword: string) {
  const hashedPassword = createHash("sha256").update(newPassword).digest("hex")

  const query = `
    UPDATE users 
    SET password_hash = ? 
    WHERE user_id = ?
  `
  await executeQuery(query, [hashedPassword, userId])
  return true
}

// Hàm xóa người dùng
export async function deleteUser(userId: number) {
  const query = `
    DELETE FROM users 
    WHERE user_id = ?
  `
  await executeQuery(query, [userId])
  return true
}
