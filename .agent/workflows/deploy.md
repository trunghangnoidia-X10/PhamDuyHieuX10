---
description: Deploy app to Vercel production
---

# Deploy to Vercel

Mỗi khi cần deploy app lên production, thực hiện các bước sau:

// turbo-all

1. Stage all changes:

```
git add -A
```

1. Commit with version message:

```
git commit -m "<version_message>"
```

1. Push to GitHub:

```
git push origin master
```

1. Deploy to Vercel production:

```
npx vercel --prod
```

1. Update version number in `src/app/chat/page.tsx` (tăng version 5.x lên số tiếp theo)

## Notes

- Version hiện tại đang hiển thị ở `src/app/chat/page.tsx` (tìm `v5.`)
- Mỗi lần có thay đổi cần deploy, PHẢI tăng version number
- Deploy bằng `npx vercel --prod` vì auto-deploy từ GitHub chưa được cấu hình
