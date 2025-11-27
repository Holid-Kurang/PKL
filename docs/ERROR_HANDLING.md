# Error Handling Documentation

## Overview

Sistem error handling terpusat untuk menangani semua error di aplikasi dengan cara yang konsisten dan user-friendly.

## Komponen Utama

### 1. AppError Class (`src/utils/AppError.js`)

Custom error class untuk operational errors (error yang diprediksi).

```javascript
const AppError = require('../utils/AppError');

// Contoh penggunaan
throw new AppError('Data tidak ditemukan', 404);
throw new AppError('Kategori tidak valid', 400);
```

**Parameter:**

-   `message`: Pesan error yang user-friendly
-   `statusCode`: HTTP status code (400, 401, 403, 404, 500, dll)
-   `isOperational`: Boolean, default true (menandakan error yang diprediksi)

### 2. Error Handler Middleware (`src/middlewares/errorHandler.js`)

#### catchAsync Function

Wrapper untuk async functions yang otomatis menangkap error dan pass ke error handler.

```javascript
const { catchAsync } = require('../middlewares/errorHandler');

exports.getData = catchAsync(async (req, res, next) => {
	// Tidak perlu try-catch, error otomatis ditangkap
	const data = await Model.find();
	res.json({ data });
});
```

#### errorHandler Middleware

Middleware utama yang menangani semua error secara terpusat.

**Fitur:**

-   ✅ Log error detail ke console (timestamp, URL, method, IP, stack trace)
-   ✅ Membedakan environment (development vs production)
-   ✅ Transform error spesifik (MongoDB duplicate key, validation, cast error, dll)
-   ✅ Response berbeda untuk API vs rendered pages
-   ✅ Hide sensitive error details di production
-   ✅ User-friendly error messages

## Error Types yang Ditangani

### 1. MongoDB Errors

#### Duplicate Key Error (code 11000)

```javascript
// Otomatis dikonversi ke:
"Data dengan email 'user@example.com' sudah ada. Gunakan nilai yang berbeda.";
```

#### Validation Error

```javascript
// Otomatis dikonversi ke:
'Data tidak valid: Email wajib diisi. Password minimal 6 karakter.';
```

#### Cast Error (Invalid ObjectId)

```javascript
// Otomatis dikonversi ke:
'Data tidak ditemukan. ID tidak valid: 123abc';
```

### 2. JWT Errors

-   JsonWebTokenError → "Token tidak valid. Silakan login kembali."
-   TokenExpiredError → "Sesi Anda telah berakhir. Silakan login kembali."

### 3. Connection Errors

-   MongooseServerSelectionError → "Koneksi ke database gagal. Silakan coba lagi."

## Cara Menggunakan

### Di Controller

#### ❌ Cara Lama (Manual Try-Catch)

```javascript
exports.getData = async (req, res) => {
	try {
		const data = await Model.find();
		res.json({ data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};
```

#### ✅ Cara Baru (Dengan catchAsync)

```javascript
const { catchAsync } = require('../middlewares/errorHandler');
const AppError = require('../utils/AppError');

exports.getData = catchAsync(async (req, res, next) => {
	const data = await Model.find();

	if (!data.length) {
		return next(new AppError('Data tidak ditemukan', 404));
	}

	res.json({
		success: true,
		data,
	});
});
```

### Validation Example

```javascript
exports.createData = catchAsync(async (req, res, next) => {
	const { name, email } = req.body;

	// Validasi input
	if (!name || !email) {
		return next(new AppError('Nama dan email wajib diisi', 400));
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return next(new AppError('Format email tidak valid', 400));
	}

	// Cek duplicate
	const existing = await Model.findOne({ email });
	if (existing) {
		return next(new AppError('Email sudah terdaftar', 409));
	}

	const data = await Model.create(req.body);

	res.status(201).json({
		success: true,
		message: 'Data berhasil dibuat',
		data,
	});
});
```

### Authorization Example

```javascript
exports.deleteData = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const data = await Model.findById(id);

	if (!data) {
		return next(new AppError('Data tidak ditemukan', 404));
	}

	// Cek authorization
	if (data.userId.toString() !== req.user.id) {
		return next(
			new AppError(
				'Anda tidak memiliki akses untuk menghapus data ini',
				403
			)
		);
	}

	await data.remove();

	res.json({
		success: true,
		message: 'Data berhasil dihapus',
	});
});
```

## Response Format

### API Response (JSON)

#### Success

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {...},
    "pagination": {...}
}
```

#### Error (Development)

```json
{
	"success": false,
	"status": "fail",
	"error": {
		"statusCode": 400,
		"status": "fail",
		"isOperational": true
	},
	"message": "Data tidak valid",
	"stack": "Error: Data tidak valid\n    at..."
}
```

#### Error (Production)

```json
{
	"success": false,
	"status": "fail",
	"message": "Data tidak valid"
}
```

### Rendered Page Response

#### Development Mode

-   Menampilkan error code, message, status, dan stack trace
-   Stack trace dalam collapsible section
-   Link kembali dan ke homepage

#### Production Mode

-   Hanya menampilkan error code dan user-friendly message
-   Hide stack trace dan technical details
-   Professional error page

## HTTP Status Codes

| Code | Meaning               | Usage                                            |
| ---- | --------------------- | ------------------------------------------------ |
| 400  | Bad Request           | Invalid input, validation error                  |
| 401  | Unauthorized          | Not authenticated                                |
| 403  | Forbidden             | Not authorized (authenticated but no permission) |
| 404  | Not Found             | Resource not found                               |
| 409  | Conflict              | Duplicate data                                   |
| 422  | Unprocessable Entity  | Validation failed                                |
| 429  | Too Many Requests     | Rate limit exceeded                              |
| 500  | Internal Server Error | Unexpected server error                          |
| 503  | Service Unavailable   | Database connection failed                       |

## Environment Variables

Pastikan `NODE_ENV` diset di `.env`:

```env
NODE_ENV=development  # Untuk development
NODE_ENV=production   # Untuk production
```

## Best Practices

### 1. ✅ DO: Gunakan AppError untuk Operational Errors

```javascript
if (!user) {
	return next(new AppError('User tidak ditemukan', 404));
}
```

### 2. ✅ DO: Gunakan catchAsync untuk Semua Async Controllers

```javascript
exports.handler = catchAsync(async (req, res, next) => {
	// Logic here
});
```

### 3. ✅ DO: Return next() Setelah throw Error

```javascript
if (error) {
	return next(new AppError('Error message', 400));
}
// Kode tidak akan dieksekusi setelah return
```

### 4. ❌ DON'T: Manual Try-Catch dalam Controller

```javascript
// ❌ Tidak perlu
try {
	await Model.find();
} catch (err) {
	console.error(err);
}
```

### 5. ❌ DON'T: Generic Error Messages

```javascript
// ❌ Buruk
throw new AppError('Error', 500);

// ✅ Baik
throw new AppError('Gagal menyimpan data. Email sudah terdaftar', 409);
```

### 6. ✅ DO: Log Error di Development

```javascript
// Error otomatis di-log dengan detail:
// - Timestamp
// - URL & Method
// - IP Address
// - User Agent
// - Error Message
// - Stack Trace
```

## Testing Error Handler

### Test 404 Error

```
GET http://localhost:3000/non-existent-page
```

### Test Invalid Category

```
GET http://localhost:3000/api/dashboard/invalid-category
```

### Test Invalid MongoDB ID

```
GET http://localhost:3000/api/dashboard/penelitian-pnbp/123abc
```

### Test Validation Error

```
POST http://localhost:3000/api/dashboard/penelitian-pnbp
Body: {} // Empty body
```

## Migration Checklist

Untuk migrate existing controllers:

-   [ ] Import `catchAsync` dan `AppError`
-   [ ] Wrap semua async functions dengan `catchAsync`
-   [ ] Ganti `res.status().json()` error responses dengan `next(new AppError())`
-   [ ] Hapus manual try-catch blocks
-   [ ] Update error messages jadi user-friendly
-   [ ] Add proper status codes
-   [ ] Test semua endpoints

## Troubleshooting

### Error tidak tertangkap?

-   Pastikan `errorHandler` middleware ada di `server.js` paling akhir
-   Pastikan menggunakan `next(error)` bukan `throw error`

### Stack trace tidak muncul?

-   Cek `NODE_ENV` di `.env` harus `development`

### Error 404 untuk semua request?

-   Pastikan 404 handler sebelum error handler middleware
-   Cek urutan middleware di `server.js`
