import '../../styles/global.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: 'PizzaManager.js',
  description: 'Created by Zane Schenk',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
