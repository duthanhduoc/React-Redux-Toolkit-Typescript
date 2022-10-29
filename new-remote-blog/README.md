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

## Lỗi từ RTK Query

Sẽ có 2 kiểu: FetchBaseQueryError | SerializedError

Tham khảo: [https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling)

## Cache data

Caching là một tính năng quan trọng của RTK Query. Khi chúng ta fetch dữ liệu từ server, RTK Query sẽ cache dữ liệu vào Redux. Tất nhiên đây là cache trên RAM => F5 lại là mất

Caching sẽ dựa vào

- API endpoint (tức là mấy cái khai báo `getPosts`, `getPost` các kiểu đó)
- Query params được sử dụng (ví dụ `1` là param trong `useGetPostQuery(1)`)
- Số lượng active subscription cộng dồn

Khi một component được mounted và gọi `useQuery` hook, thì component đó subcribe cái data đó => Ta có 1 subsciption, nếu nó unmount thì ta sẽ trở lại 0 (unsubcribe)

Khi request được gọi, nếu data đã được cache thi thì RTK sẽ không thực hiện request mới đến server mà trả về data cache đó

Số lượng subscription được cộng dồn khi mà cùng gọi 1 endpoint và query param. Miễn là còn component subcribe data thì data nó chưa mất, nếu không còn component nào subcribe thì mặc định sau 60s data sẽ xóa khỏi cache (nếu lúc đó có component nào subcribe lại data đó thì còn dữ tiếp)

## Ví dụ về thời gian cache

```jsx
import { useGetUserQuery } from './api.ts'

function ComponentOne() {
  // component subscribes to the data
  const { data } = useGetUserQuery(1)

  return <div>...</div>
}

function ComponentTwo() {
  // component subscribes to the data
  const { data } = useGetUserQuery(2)

  return <div>...</div>
}

function ComponentThree() {
  // component subscribes to the data
  const { data } = useGetUserQuery(3)

  return <div>...</div>
}

function ComponentFour() {
  // component subscribes to the *same* data as ComponentThree,
  // as it has the same query parameters
  const { data } = useGetUserQuery(3)

  return <div>...</div>
}
```

Khi 4 component trên được gọi thì ta có

- Component 1 subcribe data 1
- Component 2 subcribe data 2
- Component 3 và 4 cùng subcribe data 3

Chỉ có 3 request được gửi lên server là request từ component 1,2,3. Còn component 4 sẽ dùng lại data cache từ component 3

Data sẽ được giữ lại cho đến khi không còn component nào subcribe. Ví dụ:

- Nếu component 1 hoặc 2 bị unmount, data 1 hoặc data 2 sẽ bị xóa sau 60s
- Nếu component 3 bị unmount, data 3 vẫn còn vì component 4 vẫn đang subcribe. Nếu lúc này 4 unsubcribe thì data 3 mới bị xóa sau 60s
