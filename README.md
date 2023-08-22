## Welcome to bonini-starter-app
This template uses TailwindCSS, shadcn-ui and prisma. It comes with predefined authorization and styling system.

### In order to start the app:
```bash
npm i
npm run dev
```
### Setting up prisma and database
Inside `/prisma` there is database schema in which you should set up your database and create models you need. Also run this command:
```bash
npx prisma generate
```
### Create .env file to store your secrets

### Changing texts and routes
You should change all the texts and routes inside `layout.tsx, page.tsx and on pages inside /app/auth`