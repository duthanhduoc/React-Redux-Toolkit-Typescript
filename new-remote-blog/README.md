# Getting Started with Create React App

## Quy ước lỗi trả về với từ server

Server phải trả về một kiểu lỗi thống nhất, không thể trả về tùy tiện được.

Ở đây Server của mình (JSON Server) cấu hình để trả về 2 kiểu lỗi

1. Lỗi liên quan đến việc gửi data như POST, PUT thì error là một object kiểu `EntityError`

```ts
{
  "error": {
    "publishDate": "Không được publish vào thời điểm trong quá khứ"
  }
}
```

```ts
interface EntityError {
  [key: string | number]: string | EntityError | EntityError[]
}
```

Có thể nâng cao hơn `key: string` là `key: object` hoặc `key: array` nếu form phức tạp

2. Các lỗi còn lại sẽ trả về một thông báo dạng `error: string`

```ts
{
  "error": '❌❌❌Lỗi rồi bạn ơi ❌❌❌'
}
```
